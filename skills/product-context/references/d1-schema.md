---
skills: [product-context, codebase-context, engineering-review]
last_updated: Mar 2026
source: Cloudflare D1 live query (REVIEW_DB, uuid a8fabb84-3699-4c60-a431-82ef3dd94053), NestJS codebase analysis (backend-nest/src/)
staleness_note: >
  Schema reflects production state as of Mar 2026. Verify against D1 before any
  table change. Use PRAGMA table_info(<table>) via Cloudflare MCP or wrangler.
---

# staffroom — D1 Schema

Cloudflare D1 (REVIEW_DB, uuid: `a8fabb84-3699-4c60-a431-82ef3dd94053`) is the secondary database.
All access goes through `D1Service` (REST API calls to Cloudflare). D1 uses SQLite syntax.
Used for the nudge/tracking pipeline, form completion tracking, and admin auth.

**Do not create new D1 tables without explicit approval from Nikhil.**
New features that need new persistent data should use Neon PostgreSQL via PostgresService by default.

> For Neon schema (primary DB, active/legacy tables, enum types) → `neon-schema.md`

---

## 1. Active D1 Tables

All accessed via `D1Service` through the Cloudflare REST API. D1 uses SQLite syntax.

---

### `teacher_counts` (D1)
Pre-computed teacher headcounts by geography. Read-only from NestJS (data loaded separately).

| Column | Notes |
|---|---|
| `district_name` | |
| `block_name` | |
| `state_name` | |
| `normalized_district_name` | lowercase, stripped of 'District'/'Taluk'/'Block' suffixes |
| `normalized_block_name` | same |
| `normalized_state_name` | same |
| `district_teacher_count` | integer |
| `block_teacher_count` | integer |
| `state_teacher_count` | integer |

**Used by:** `teacher-counts.service.ts` — displayed on school pages and search results.

---

### `admins` (D1)
Admin user credentials for the staffroom admin panel.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `phone` | TEXT | |
| `email` | TEXT | nullable, UNIQUE |
| `name` | TEXT | nullable |
| `password_hash` | TEXT | SHA-256 hash |
| `is_active` | INTEGER | 1 = active, 0 = inactive |
| `created_at` | TEXT | datetime string |
| `updated_at` | TEXT | nullable |

**Used by:** `auth.service.ts` (admin login), `admin-d1.service.ts`.

---

### `users` (D1)
Legacy phone-based user store. Parallel to Neon's `"User"` table — used by the nudge pipeline to store simplified user records keyed by phone number.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `name` | TEXT | |
| `email` | TEXT | nullable |
| `phone` | TEXT | 10-digit normalized |
| `created_at` | TEXT | IST datetime string |
| `updated_at` | TEXT | |

**Used by:** `short-form-legacy.service.ts` (getOrCreateLegacyUser), `tracking.service.ts` (getOrCreateLegacyUser), `user-context.service.ts` (badge lookup cross-reference).

---

### `question_completion_tracking` (D1)
Per-user-per-school form completion progress. Written on every form save.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `user_id` | TEXT | references D1 users.id |
| `school_id` | TEXT | nullable |
| `place_id` | TEXT | nullable |
| `school_name` | TEXT | nullable |
| `phone` | TEXT | nullable |
| `worked_recently_answered` | INTEGER | 0 or 1 |
| `salary_on_time_answered` | INTEGER | 0 or 1 |
| `professional_feedback_answered` | INTEGER | 0 or 1 |
| `written_contract_answered` | INTEGER | 0 or 1 |
| `overall_experience_answered` | INTEGER | 0 or 1 |
| `salary_per_month_answered` | INTEGER | 0 or 1 |
| `total_work_experience_answered` | INTEGER | 0 or 1 |
| `highest_qualification_answered` | INTEGER | 0 or 1 |
| `designation_answered` | INTEGER | 0 or 1 |
| `days_work_home_answered` | INTEGER | 0 or 1 |
| `benefits_answered` | INTEGER | 0 or 1 |
| `fees_deductions_answered` | INTEGER | 0 or 1 |
| `applying_for_leave_answered` | INTEGER | 0 or 1 |
| `working_with_teachers_answered` | INTEGER | 0 or 1 |
| `working_with_management_answered` | INTEGER | 0 or 1 |
| `trying_new_things_answered` | INTEGER | 0 or 1 |
| `giving_feedback_to_principal_answered` | INTEGER | 0 or 1 |
| `what_you_like_answered` | INTEGER | 0 or 1 |
| `what_to_improve_answered` | INTEGER | 0 or 1 |
| `section_zero_completed` | INTEGER | 0 or 1 — workedRecently answered |
| `section_one_completed` | INTEGER | 0 or 1 — S0 + salary + overall |
| `section_two_completed` | INTEGER | 0 or 1 — S1 + all quantitative fields |
| `section_three_completed` | INTEGER | 0 or 1 — S2 + whatYouLike + whatToImprove |
| `is_full_complete` | INTEGER | 0 or 1 — same as section_three_completed |
| `created_at` | TEXT | IST datetime string |
| `updated_at` | TEXT | IST datetime string |

**Used by:** `short-form-legacy.service.ts` (UPSERT on every save), `nudges.service.ts` (lookup school_name), admin users service.

---

### `nudges` (D1)
Central nudge dispatch table. One row per nudge message (WhatsApp).

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `user_id` | TEXT | nullable |
| `tracking_id` | INTEGER | nullable, FK → user_tracking.id |
| `question_tracking_id` | INTEGER | nullable, FK → question_completion_tracking.id |
| `phone` | TEXT | recipient phone |
| `nudge_type` | TEXT | 'search_intent' \| 'abandonment' \| 'update_is_live' \| 'full_completion' |
| `status` | TEXT | 'pending' \| 'sent' \| 'failed' \| 'cancelled' |
| `scheduled_at` | TEXT | IST datetime |
| `sent_at` | TEXT | nullable, IST datetime |
| `created_at` | TEXT | IST datetime |
| `error_message` | TEXT | nullable |

**Used by:** `nudges.service.ts`, `nudge-process.service.ts`, `nudge-send.service.ts`, admin services.

---

### `nudge_link_clicks` (D1)
Tracks clicks on WhatsApp nudge redirect links (via /nudge/go endpoint).

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `link` | TEXT | the destination URL clicked |
| `clicked_at` | TEXT | IST datetime |
| `user_agent` | TEXT | nullable |
| `is_webview` | INTEGER | 1 = WhatsApp WebView, 0 = browser |
| `user_id` | TEXT | nullable |

**Used by:** `nudge.service.ts` (INSERT), `nudges.service.ts` (analytics queries).

---

### `phone_otps` (D1)
OTP records for phone-based authentication.

| Column | Type | Notes |
|---|---|---|
| `phone` | TEXT | |
| `otp_hash` | TEXT | |
| `expires_at` | TEXT | datetime |
| `verified` | INTEGER | 0 or 1 |
| `created_at` | TEXT | datetime('now') |

**Used by:** admin users service (OTP generation and verification flow).

---

### `manual_schools` (D1)
Manually curated school records for schools not in UDISE dataset (e.g., new private schools).

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `search_keywords` | TEXT | NOT NULL, full-text search tokens |
| `school_name` | TEXT | NOT NULL |
| `address` | TEXT | nullable |
| `city` | TEXT | nullable |
| `state` | TEXT | nullable |
| `district` | TEXT | nullable |
| `pincode` | TEXT | nullable |
| `latitude` | REAL | nullable |
| `longitude` | REAL | nullable |
| `created_at` | INTEGER | unix epoch, default unixepoch() |

**Used by:** `places.service.ts` (search), `manual-schools.service.ts` (CRUD via admin API).

---

### `unmapped_schools` (D1)
Google Places schools that have been fetched but not yet matched to a UDISE school_id. Staging table.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `place_id` | TEXT | NOT NULL, Google Maps Place ID |
| `school_name` | TEXT | NOT NULL |
| `address` | TEXT | nullable |
| `city` | TEXT | nullable |
| `state` | TEXT | nullable |
| `district` | TEXT | nullable |
| `block` | TEXT | nullable |
| `pincode` | TEXT | nullable |
| `latitude` | REAL | nullable |
| `longitude` | REAL | nullable |
| `created_at` | INTEGER | unix epoch |

**Used by:** `places.service.ts` (INSERT when Google lookup succeeds but auto-mapping fails; DELETE when later mapped; SELECT on place ID lookup).

---

### `school_details_cache` (D1)
Cache for supplementary school data (report_card + facility) fetched from Neon. TTL: 30 days.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT | PK — school_id as string |
| `data` | TEXT | JSON string of cached result |
| `created_at` | INTEGER | unix epoch |
| `expires_at` | INTEGER | unix epoch (created_at + 30d) |

**Used by:** `school-details.service.ts` (read-through cache for report_card + facility data).

---

### `api_cache` (D1)
Generic API response cache. Cleared via admin endpoint.

| Column | Notes |
|---|---|
| `id` (inferred) | cache key |
| `data` | cached response |
| `created_at` | |

**Used by:** `cache.service.ts` (admin clear-all only).

---

### Queue Tables (D1)
Four queue tables with identical schemas. Each represents a nudge trigger type.

**Tables:** `search_intent_queue`, `abandonment_queue`, `update_is_live_queue`, `full_completion_queue`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `user_id` | INTEGER | FK → D1 users.id |
| `tracking_id` | INTEGER | nullable, FK → user_tracking.id |
| `question_tracking_id` | INTEGER | nullable, FK → question_completion_tracking.id |
| `phone` | TEXT | recipient phone |
| `scheduled_at` | TEXT | IST datetime when to send |
| `created_at` | TEXT | IST datetime |
| `processed` | INTEGER | 0 = pending, 1 = processed |
| `processed_at` | TEXT | nullable, IST datetime |

**Trigger logic:**
- `search_intent_queue`: populated by `tracking.service.ts` when a user visits a school page (delay: 8h, dedup: 24h window)
- `abandonment_queue`: populated when S0 answered but S1 not complete (delay: 60min)
- `update_is_live_queue`: populated when S1 answered but S2 not complete (delay: 60min)
- `full_completion_queue`: populated when S3 (full) complete (delay: 0min — immediate nudge)

**Used by:** `short-form-legacy.service.ts`, `tracking.service.ts`, `nudges.service.ts`, `cron.service.ts`, `nudge-process.service.ts`.

---

### `user_tracking` (D1)
One row per school page visit (search/discovery event). Powers the search_intent nudge and admin analytics.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `keyword` | TEXT | nullable — search term used |
| `email` | TEXT | nullable |
| `phone` | TEXT | nullable |
| `user_id` | INTEGER | nullable, FK → D1 users.id |
| `school_id` | TEXT | nullable |
| `place_id` | TEXT | nullable |
| `searched_at_ist` | TEXT | IST datetime |
| `source` | TEXT | 'search' \| 'top_rated_card' \| 'near_school' |
| `action_taken` | TEXT | default 'none' — updated if user takes action |

**Used by:** `tracking.service.ts` (INSERT + UPDATE), admin users service (analytics).

---

### `share_clicks` (D1)
Tracks clicks on the share button in the UI.

| Column | Notes |
|---|---|
| `id` | PK, autoincrement |
| `user_id` | TEXT |
| `clicked_at` | datetime('now') |
| `share_type` | TEXT, nullable |

**Used by:** `tracking.service.ts` (INSERT), admin users service (analytics).

---

### `share_events` (D1)
Tracks completed share actions (after platform is chosen).

| Column | Notes |
|---|---|
| `id` | PK, autoincrement |
| `user_id` | TEXT, nullable |
| `platform` | TEXT — e.g. 'whatsapp', 'copy' |
| `shared_at` | datetime('now') |
| `share_type` | TEXT, nullable |
| `place_id` | TEXT, nullable |

**Used by:** `tracking.service.ts` (INSERT), admin users service (analytics).

---

### `badge_contributor` (D1)
Records which users have earned the "Contributor" badge (for completing a full review).

| Column | Notes |
|---|---|
| `user_id` | TEXT — D1 users.id (can be integer or string) |
| `review_id` | TEXT |
| `badge_status` | INTEGER — 1 = active |

**Used by:** `short-form-legacy.service.ts` (INSERT OR IGNORE after full completion), `user-context.service.ts` (SELECT for badge display).

---

---

## 2. Dual-Database Tables — Neon Shadows

The following tables exist in **both** Neon and D1. The **NestJS code exclusively uses the D1 versions** for all read/write operations. The Neon copies are historical shadows from the pre-NestJS Cloudflare Workers architecture and are not written to by current code.

| Table | Neon status | D1 status | Notes |
|---|---|---|---|
| `users` | Shadow (not written) | **Active** | D1 keyed by phone; Neon `"User"` is the live Neon user table |
| `question_completion_tracking` | Shadow | **Active** | |
| `nudges` | Shadow | **Active** | |
| `abandonment_queue` | Shadow | **Active** | |
| `full_completion_queue` | Shadow | **Active** | |
| `search_intent_queue` | Shadow | **Active** | |
| `update_is_live_queue` | Shadow | **Active** | |
| `user_tracking` | Shadow | **Active** | Neon version has slightly different schema (no `source` column) |
| `admins` | Shadow | **Active** | |
| `badge_contributor` | Shadow | **Active** | |
| `phone_otps` | Shadow | **Active** | |
| `school_details_cache` | Shadow | **Active** | |
| `unmapped_schools` | Shadow | **Active** | |
| `top_rated_cache` | Dead | Dead | Not referenced in NestJS code at all |

---

---

## 3. D1 Tables With No Active Code Reference


| Table | Notes |
|---|---|
| `place_city_cache` | D1-only table (not in Neon). Not referenced anywhere in backend-nest/src/. Possibly written by legacy CF Workers. |
| `top_rated_cache` | Exists in both Neon and D1. Not referenced in NestJS code. Dead feature. |


---

## 4. Key Cross-Database Relationships


```
Neon "User".id  ←→  stepper_form_data.userId
Neon "User".phone  ←→  D1 users.phone  (cross-db identity bridge)
D1 users.id  ←→  D1 question_completion_tracking.user_id
D1 question_completion_tracking.id  ←→  D1 nudges.question_tracking_id
D1 question_completion_tracking.id  ←→  D1 abandonment_queue.question_tracking_id
Neon stepper_form_data.reviewId  ←→  Neon stepper_form_approval.reviewId
Neon school_mapping.school_id  ←→  Neon schools.school_id
Neon school_mapping.place_id  ←→  stepper_form_data.placeId
```
