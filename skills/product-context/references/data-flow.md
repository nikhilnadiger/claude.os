---
skills: [product-context]
last_updated: Mar 2026
source: live codebase — backend-nest/src/, pages/ (verified Mar 2026)
---

# staffroom — Data Flows

Six primary flows verified from live codebase. Do not rely on legacy
`SCHOOL_DATA_FLOW.md` or `PROJECT_REFERENCE.md` — both are outdated.

For full DB table definitions, column names, and active/legacy status across both
Neon and D1, see `references/db-schema.md`.

---

## Flow 1: School Search

**Entry:** Teacher types school name in search bar on `/home` or homepage.

**Steps:**
1. Frontend sends `POST /search/resolve` with `{ name: searchTerm, userId? }`
2. NestJS `search.service.ts` creates a `UserSearch` record in Neon
   (`searches` table — `name` field stores the search term, not the teacher's name)
3. Service queries `schools` table in Neon for matching school names
4. Results returned to frontend with school `slug`, name, location, and score data
5. Teacher clicks a result → navigates to `/school/[slug]`

**Signal:** 108 users have searched 3+ times (high-intent). 1,408 total searches logged.

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
3. Fetch existing progress: `GET /short-form/get` — auth optional (reads from header if present)
4. On completion: `stepper_form_approval` records created with 5 boolean approval fields
   - Approval is admin-reviewed
   - `FormReview` table is legacy — `ENABLE_FORM_REVIEW_FETCH=false` — do not reference

**Completion rate:** 635 submitted, 255 fully complete (~40%). Drop-off is mid-form.

---

## Flow 4: Authentication

**Entry:** Teacher reaches any protected page or clicks "Login".

**Steps:**
1. Teacher enters phone number → `POST /auth/send-otp` → OTP sent via WhatsApp/SMS
2. Teacher enters OTP → `POST /auth/verify` → JWT returned in response
3. JWT stored in cookie (httpOnly)
4. Protected pages: `getServerSideProps` reads cookie, attaches to backend call
   → `GET /auth/me` to verify
5. On protected API calls: JWT sent in `Authorization: Bearer <token>` header
6. Backend: `JwtAuthGuard` via Passport validates the token

**Drop-off signal:** 606 login page exits — primary conversion problem (Mar 2026).

---

## Flow 5: WhatsApp Nudge

**Entry:** System-triggered event (new sign-up, incomplete review, etc.).

**Steps:**
1. Event triggers `POST /nudge` → `nudge.service.ts`
2. Service looks up teacher's phone in `users` table
3. Sends WhatsApp message via external WhatsApp API integration
4. Nudge record created for deduplication (rate-limited per teacher per period)

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

## Summary: Key Data Stores

| Store | Type | What's in it |
|---|---|---|
| Neon PostgreSQL | Primary | schools, users, searches, stepper_form_data, stepper_form_approval |
| `pincode_lookup` | Neon materialized view | Location fallback — refreshed on schedule, not a regular table |
| Cloudflare D1 | Existing NestJS module only | `teacher_counts` — queried by teacher-counts module, not CF Workers |
