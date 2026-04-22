---
skills: [product-context]
last_updated: Apr 2026
source: live codebase — backend-nest/src/, pages/ (verified Apr 2026)
---

# staffroom — Data Flows

Eight primary flows verified from live codebase. Do not rely on legacy
`SCHOOL_DATA_FLOW.md` or `PROJECT_REFERENCE.md` — both are outdated.

For full DB table definitions, column names, and active/legacy status across both
Neon tables, see `references/neon-schema.md`. D1 tables, see `references/d1-schema.md`.

---

## Flow 1: School Search

**Entry:** Teacher types school name in search bar on `/home` or homepage.

**Steps:**
1. Frontend calls `GET /places/autocomplete?input=<searchTerm>` — Google Places-backed
   autocomplete. Returns a list of matching schools with `placeId`, name, and address.
   Results cached in `place_city_cache` and `place_location_cache` in D1.
2. Teacher selects a school from autocomplete results
3. Frontend sends `POST /search/resolve` with `{ placeId: string (required), schoolName?: string }`
   — resolves the Google Place ID to a staffroom school record. No Neon search log is written.
4. `SearchController` → `PlacesService.resolvePlaceId()` → queries `school_mapping` in Neon
   to find matching school record, then fetches from `schools` table
5. Result returned: school `slug`, name, location, and score data
6. Teacher clicks result → navigates to `/school/[slug]`
7. School page visit tracked via `POST /tracking/visit` → D1 `user_tracking` table
   (this is the search intent signal, not the resolve call itself)

⚠ **There is no `searches` table in Neon and no `search.service.ts`.** The legacy
`"UserSearch"` table in Neon is inactive (see Section 4 of neon-schema.md).
Search count metrics come from D1 `user_tracking` (visit events), not a Neon query log.

**Signal:** 1,408 total school page visit events in D1 user_tracking (Mar 2026).
108 users have 3+ visit events (high-intent researchers).

---

## Flow 2: School Profile Load

**Entry:** Teacher navigates to `/school/[slug]`.

**Steps:**
1. `getServerSideProps` in `pages/school/[slug].tsx` calls the NestJS backend
   - Known inconsistency: this page uses `NEXT_PUBLIC_API_BASE_URL` directly instead of
     `getApiBaseUrl()`. Do not replicate in new pages.
2. Backend: `GET /schools/:identifier` (identifier = slug or ID)
   - `schools.service.ts` → queries Neon `schools` table
   - Returns school profile + aggregate review scores
3. Separate call: `GET /schools/:identifier/reviews` — paginated teacher experiences
4. Teacher count resolution (multi-step):
   - Step 1a: query `schools` table in Neon for pincode → resolve location
   - Step 1b: if location not resolved, query `pincode_lookup` **materialized view** in Neon
     (fallback — this is a materialized view, not a regular table)
   - Step 2: query `teacher_counts` table in **Cloudflare D1** using resolved location
     → get actual teacher count for that area
   - Both Neon and D1 are used in this flow. Handled by the `teacher-counts` NestJS module
     via `D1Service` + `PostgresService`.
5. Full school profile rendered: name, location, aggregate scores, teacher count, experiences

---

## Flow 3: Review Submission

**Entry:** Authenticated teacher on `/share-experience`.

**Components:** `GroupedStepperForm` (grouped question flow) and `SectionWiseShortForm`
(section-by-section). Both confirmed in `pages/share-experience.tsx`.

**Steps:**
1. Teacher completes multi-step form
2. On each step save: `POST /short-form/save` with JWT in header (`JwtAuthGuard` required)
   - `short-form.service.ts` → upserts into `stepper_form_data` in Neon
   - `stepper_form_data` is the active table — records partial and complete submissions
   - `short-form-legacy.service.ts` → simultaneously upserts into `question_completion_tracking`
     in D1 (per-question progress tracking) and enqueues nudge triggers
3. Fetch existing progress: `GET /short-form/get` — auth optional (reads from header if present)
4. On completion: `badge_contributor` record inserted in D1 (contributor badge earned)
   - **`stepper_form_approval` exists in the schema but is NOT written by any code.**
     There is no moderation or admin-review pipeline implemented. Do not build against
     stepper_form_approval — it is an unused schema artifact.
   - `FormReview` table is legacy — `ENABLE_FORM_REVIEW_FETCH=false` — do not reference

**Completion rate:** 838 submitted (Apr 2026), 336 fully complete (~40%). Drop-off is mid-form.

---

## Flow 4: Authentication

**Entry:** Teacher reaches any protected page or clicks "Login".

**Steps:**
1. Teacher enters phone number → `POST /whatsapp/send-otp` → OTP sent via WhatsApp
2. Teacher enters OTP → `POST /whatsapp/verify-otp` → JWT returned in response body
3. Teacher optionally updates profile (name, role) → `POST /whatsapp/update-profile`
4. JWT stored as auth token (httpOnly cookie or local storage depending on context)
5. Protected pages: `getServerSideProps` reads token, calls `GET /user/context` to verify
   session and return current user profile, badge status, contribution history
6. On protected API calls: JWT sent in `Authorization: Bearer <token>` header
7. Backend: `JwtAuthGuard` via Passport validates the token

**Drop-off signal:** 662 exits from the login page (Apr 2026) — primary conversion problem.

⚠ **WebView risk:** Teachers arriving via Instagram or WhatsApp ads are in an in-app
browser (WebView). Switching to WhatsApp to retrieve the OTP may close the session.
Any OTP flow change must account for WebView behaviour — see `staffroom-ux-constraints.md`.

---

## Flow 5: WhatsApp Nudge Pipeline

**Entry:** System-triggered on specific user events. Queue-based. Not a direct API call
from the frontend. Processed by a cron job every 5 minutes.

**Queue population triggers:**
- Teacher visits a school page → `tracking.service.ts` → INSERT into `search_intent_queue`
  (delay: 8h, dedup: 24h window). Does not trigger if teacher has already reviewed this school.
- S0 answered but S1 not complete → `short-form-legacy.service.ts` → INSERT into
  `abandonment_queue` (delay: 60min)
- S1 answered but S2 not complete → `short-form-legacy.service.ts` → INSERT into
  `update_is_live_queue` (delay: 60min)
- Full review complete (S3) → `short-form-legacy.service.ts` → INSERT into
  `full_completion_queue` (delay: 0min — immediate)

**Processing pipeline (every 5 minutes):**
1. Cron job triggers `POST /admin/cron/trigger`
2. `cron.service.ts` reads all four queue tables in D1 for unprocessed rows
3. `nudge-process.service.ts` filters out duplicates and recently-nudged teachers
   (dedup window per nudge type)
4. For each eligible row: `nudge-send.service.ts` sends WhatsApp message via external
   WhatsApp API using template from `nudge_template_configs` or `whatsapp_nudge_templates` in D1
5. D1 `nudges` table updated: status `pending` → `sent` or `failed`
6. Queue row marked `processed = 1`

**Nudge link clicks:**
- Nudge messages contain a link to `/nudge/go?to=<destination>&...`
- `GET /nudge/go` → `nudge.service.ts` → logs to `nudge_link_clicks` table in D1 → redirects
- `POST /nudge/record-landing` → records where the teacher landed after the nudge

---

## Flow 6: Top-Rated Schools

**Entry:** Teacher navigates to top-rated view.

**Steps:**
1. Frontend calls `GET /top-rated`
2. NestJS queries Neon for schools with highest aggregate review scores
   above a minimum review count threshold
3. Returns ranked list with school profiles and aggregate scores
4. Rendered as a ranked data list — not a certification or award

---

## Flow 7: Tracking

**Entry:** Teacher performs tracked actions (school visit, share click, share completion).

**Steps:**
1. Frontend calls the appropriate tracking endpoint on each action:
   - `POST /tracking/search` — teacher performed a search (lightweight; returns `{ success: true }`)
   - `POST /tracking/visit` — teacher viewed a school page; body: `{ trackingId?, schoolId?, placeId? }`
     → `tracking.service.ts` → INSERT into `user_tracking` in D1 → populates `search_intent_queue`
   - `POST /tracking/share` → logs to `share_clicks` or `share_events` in D1
2. Tracking data feeds admin analytics dashboard and nudge pipeline

---

## Flow 8: Career Insights

**Entry:** Teacher navigates to Career Insights section.

**Steps:**
1. Frontend calls `GET /insights/career-stats` — public, no auth required
   → aggregated salary and experience data from `stepper_form_data` in Neon
2. For personalised insights: `GET /insights/user-insights` — `JwtAuthGuard` required
   → returns insights relevant to the current teacher's profile (designation, experience, subject)
3. Results rendered in the Career Insights UI

---

## Summary: Key Data Stores

| Store | Type | What's in it |
|---|---|---|
| Neon PostgreSQL | Primary | schools, users ("User"), stepper_form_data, school_mapping |
| `pincode_lookup` | Neon materialized view | Location fallback — refreshed on schedule, not a regular table |
| Cloudflare D1 | Secondary | teacher_counts, nudge pipeline tables, tracking tables, admin auth, caches, referrals |
