---
skills: [product-context, codebase-context, engineering-review]
last_updated: May 2026
source: Cloudflare D1 live query (REVIEW_DB, uuid a8fabb84-3699-4c60-a431-82ef3dd94053), NestJS codebase analysis (backend-nest/src/), PRAGMA table_info verified May 27 2026 via Cloudflare MCP
staleness_note: >
  Schema reflects production state as of May 27 2026 (full table list + PRAGMA verified live).
  Verify against D1 before any table change. Use PRAGMA table_info(<table>) via Cloudflare MCP or wrangler.
---

# staffroom — D1 Schema

Cloudflare D1 (REVIEW_DB, uuid: `a8fabb84-3699-4c60-a431-82ef3dd94053`) is the secondary database.
All access goes through `D1Service` (REST API calls to Cloudflare). D1 uses SQLite syntax.
Used for the nudge/tracking pipeline, form completion tracking, and admin auth.

**Do not create new D1 tables without explicit approval from Nikhil.**
New features that need new persistent data should use Neon PostgreSQL via PostgresService by default.

> For Neon schema (primary DB, active/legacy tables, enum types) → `neon-schema.md`

---

## D1 Table Freshness Status (verified May 27 2026)

Live queries confirmed which tables are actively written vs frozen. Check this before relying on any D1 table for current-state metrics.

### Live (writing as of May 2026)

Verified via direct D1 query May 27 2026. Row counts and latest timestamps confirmed live.

| Table | Row count | Latest timestamp | Timestamp column |
|---|---|---|---|
| `nudge_link_clicks` | 22,928 | May 27, 2026 | `clicked_at` |
| `nudges` | 2,687 | May 27, 2026 | `created_at` |
| `question_completion_tracking` | 947 | May 27, 2026 | `created_at` |
| `full_completion_queue` | 444 | May 27, 2026 | `created_at` |
| `abandonment_queue` | 912 | May 27, 2026 | `created_at` |
| `update_is_live_queue` | 615 | May 27, 2026 | `created_at` |
| `initiation_nudge_queue` | 228 | May 27, 2026 | `created_at` |
| `school_nudge_tracking` | 199 | May 27, 2026 | `last_nudge_sent_at` |
| `completion_nudge_queue` | 155 | May 27, 2026 | `created_at` |
| `share_clicks` | 195 | May 26, 2026 | `clicked_at` |
| `share_events` | 119 | May 26, 2026 | `shared_at` |
| `referrals` | 18 | May 26, 2026 | `created_at` |
| `badge_contributor` | 466 | ~May 2026 | Unix timestamp |

### Stale (frozen — not being written to)

| Table | Row count | Last write | Root cause |
|---|---|---|---|
| `user_tracking` | 1,408 | Feb 15, 2026 (search) / Jan 31, 2026 (visit) | `/tracking/search` and `/tracking/visit` endpoints stopped writing to this table in Feb 2026. Root cause not confirmed. |
| `search_intent_queue` | 1,125 | Feb 14, 2026 | Companion to user_tracking; same root cause. |

⚠ **Do not use `user_tracking` or `search_intent_queue` for current school discovery or visit metrics.** They reflect Jan–Feb 2026 state only. The nudge pipeline and form tracking tables (above) are the live tracking sources.

### Not freshness-verified

`phone_otps`, `manual_schools`, cache tables (`api_cache`, `place_city_cache`, `place_location_cache`, `school_details_cache`, `top_rated_cache`), `nudge_template_configs`, `whatsapp_nudge_templates`, `unmapped_schools` — row counts and freshness not queried May 27 2026. These are config/cache tables unlikely to affect current-state analytics.

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
| `section_zero_completed` | INTEGER | 0 or 1 — gate answered (`workedRecently = 'yes'`) |
| `section_one_completed` | INTEGER | 0 or 1 — Overall Rating submitted (`overallExperience > 0`) |
| `section_two_completed` | INTEGER | 0 or 1 — legacy definition: all quantitative fields answered (old S2 bundle) |
| `section_three_completed` | INTEGER | 0 or 1 — Full Completion (`whatToImprove` answered) |
| `is_full_complete` | INTEGER | 0 or 1 — same as section_three_completed |

⚠ **These column names reflect the old S0/S1/S2/S3 model.** The admin dashboard does not read these columns for its analytics — it queries Neon `stepper_form_data` directly using field-level anchors (see neon-schema.md for the 7-stage model). Do not conflate `section_two_completed` with the dashboard's "Salary & Work Experience" stage (which uses only `totalWorkExperience > 0` as its anchor).
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
Six queue tables. The original four share one schema; the two newer nudge-type queues share a slightly different schema.

**Original four — `search_intent_queue`, `abandonment_queue`, `update_is_live_queue`, `full_completion_queue`:**

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

**Trigger logic (original four):**
- `search_intent_queue`: populated by `tracking.service.ts` when a user visits a school page (delay: 8h, dedup: 24h window)
- `abandonment_queue`: populated when S0 answered but S1 not complete (delay: 60min)
- `update_is_live_queue`: populated when S1 answered but S2 not complete (delay: 60min)
- `full_completion_queue`: populated when S3 (full) complete (delay: 0min — immediate nudge)

**Newer two — `initiation_nudge_queue`, `completion_nudge_queue`** (added Apr–May 2026, verified May 27 2026):

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `user_id` | TEXT | NOT NULL |
| `question_tracking_id` | INTEGER | nullable |
| `phone` | TEXT | nullable |
| `scheduled_at` | TEXT | nullable |
| `created_at` | TEXT | default datetime('now') |
| `processed` | INTEGER | default 0 |
| `processed_at` | TEXT | nullable |

Note: no `tracking_id` column (unlike the original four). `user_id` is TEXT here vs INTEGER in original four. These correspond to the `042026` nudge templates injected by the deploy scripts.

**Used by:** `short-form-legacy.service.ts`, `tracking.service.ts`, `nudges.service.ts`, `cron.service.ts`, `nudge-process.service.ts`.

---

### `school_nudge_tracking` (D1)
Tracks nudge send history per user per school context. Prevents over-nudging. Added Apr–May 2026, verified May 27 2026.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `user_id` | TEXT | NOT NULL |
| `question_tracking_id` | INTEGER | NOT NULL — FK → question_completion_tracking.id |
| `school_name` | TEXT | nullable |
| `nudge_type` | TEXT | nullable — type of nudge sent |
| `priority` | INTEGER | nullable |
| `nudges_sent_count` | INTEGER | default 0 |
| `first_nudge_sent_at` | TEXT | nullable |
| `last_nudge_sent_at` | TEXT | nullable |
| `created_at` | TEXT | default datetime('now') |

**Used by:** nudge pipeline services — tracks how many nudges have been sent per user/school pair to prevent repeat sends.

---

### `top_rated_cache` (D1)
Single-row JSON cache for the top-rated schools list. Avoids recomputing the ranked list on every request.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, default 1 — always a single row |
| `data` | TEXT | NOT NULL — JSON string of cached top-rated result |
| `updated_at` | TEXT | NOT NULL |
| `created_at` | TEXT | default datetime('now') |

**Used by:** `top-rated.service.ts` (read-through cache — upsert on id=1).

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
| `source` | — | **Column does not exist in live D1** (confirmed PRAGMA May 27 2026). Was documented in error. |
| `action_taken` | TEXT | default 'none' — updated if user takes action |

**Used by:** `tracking.service.ts` (INSERT + UPDATE), admin users service (analytics).

**Query note (May 27 2026):** All 1,408 rows have `searched_at_ist` populated. 266 rows also have `visited_at_ist` — these are actual school page visits. The refresh-protocol.md D1 query `WHERE event_type = 'visit'` references a non-existent column. Correct query for visit events: `WHERE visited_at_ist IS NOT NULL`.

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

### `nudge_template_configs` (D1)
Configuration for WhatsApp nudge message delivery — API credentials and template pointers per slug/provider.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `slug` | TEXT | NOT NULL — identifies the nudge config (e.g. 'default', 'abandonment') |
| `display_name` | TEXT | nullable |
| `api_base_url` | TEXT | NOT NULL — WhatsApp API provider base URL |
| `customer_id` | TEXT | NOT NULL — provider customer ID |
| `bot_id` | TEXT | NOT NULL — provider bot/channel ID |
| `template_name` | TEXT | NOT NULL — WhatsApp template name to use |
| `namespace` | TEXT | NOT NULL — WhatsApp template namespace |
| `language_code` | TEXT | default `'en_US'` |
| `component_spec_json` | TEXT | nullable — JSON string of template component variables |
| `enabled` | INTEGER | default 1 — 0 = disabled |
| `created_at` | TEXT | default strftime |
| `updated_at` | TEXT | default strftime |

**Used by:** `nudge-send.service.ts` (reads config before dispatching WhatsApp messages).

---

### `whatsapp_nudge_templates` (D1)
Lightweight per-nudge-type template mapping. Simpler than `nudge_template_configs`; keyed by nudge_type.

| Column | Type | Notes |
|---|---|---|
| `nudge_type` | TEXT | PK — 'search_intent' \| 'abandonment' \| 'update_is_live' \| 'full_completion' |
| `template_name` | TEXT | NOT NULL — WhatsApp template name |
| `template_language` | TEXT | default `'en_US'` |
| `enabled` | INTEGER | default 1 |
| `created_at` | TEXT | default datetime('now') |
| `updated_at` | TEXT | default datetime('now') |

**Used by:** nudge pipeline services (alternate template lookup keyed by nudge type).

---

### `place_location_cache` (D1)
Cache of resolved city/district/state for Google Places IDs. Powers teacher count geography resolution.

| Column | Type | Notes |
|---|---|---|
| `place_id` | TEXT | PK — Google Maps Place ID |
| `city` | TEXT | nullable |
| `district` | TEXT | nullable |
| `state` | TEXT | nullable |
| `created_at` | INTEGER | unix epoch, NOT NULL |
| `updated_at` | INTEGER | nullable, unix epoch |

**Used by:** `places.service.ts` (cache lookup before calling Google Places API for city resolution).

---

### `referrals` (D1)
Records referral relationships between teachers.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `referrer_id` | TEXT | NOT NULL — D1 users.id of the referring teacher |
| `referee_id` | TEXT | NOT NULL — D1 users.id of the referred teacher |
| `referrer_phone` | TEXT | nullable |
| `referee_phone` | TEXT | nullable |
| `referral_code` | TEXT | NOT NULL — the code used to track this referral |
| `created_at` | TEXT | default datetime('now') |

**Used by:** `referral.service.ts` (INSERT when a referred teacher signs up), `user.service.ts` (SELECT for referral stats).

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
| `top_rated_cache` | None | **Active** | D1-only single-row cache for top-rated list. Was misclassified as Dead in Apr 2026 schema — corrected May 27 2026. |

---

---

## 3. D1 Tables With No Active Code Reference

These tables exist in D1 but are not referenced anywhere in `backend-nest/src/`. Schema is preserved for completeness; they may have been written by legacy CF Workers.

### `place_city_cache` (D1 — no active NestJS reference)
Rich cache of Google Places data + UDISE school matching for a place ID.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT | PK |
| `place_id` | TEXT | NOT NULL — Google Maps Place ID |
| `google_city` | TEXT | nullable |
| `google_admin_area_level_2` | TEXT | nullable — district from Google |
| `google_admin_area_level_1` | TEXT | nullable — state from Google |
| `google_full_address_components` | TEXT | nullable — JSON of full address components |
| `school_db_school_id` | INTEGER | nullable — matched UDISE school_id |
| `school_db_block_name` | TEXT | nullable |
| `school_db_district_name` | TEXT | nullable |
| `school_db_state_name` | TEXT | nullable |
| `school_db_address` | TEXT | nullable |
| `school_db_pincode` | TEXT | nullable |
| `possible_city_matches` | TEXT | nullable — JSON array of candidate city matches |
| `normalized_city` | TEXT | nullable |
| `teacher_count` | INTEGER | default 0 |
| `data_source` | TEXT | nullable |
| `last_updated` | TIMESTAMP | default CURRENT_TIMESTAMP |
| `created_at` | TIMESTAMP | default CURRENT_TIMESTAMP |

### `top_rated_cache` (D1 — no active NestJS reference)
Cached top-rated school list. Singleton row (id defaulted to 1).

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | PK, default 1 — singleton |
| `data` | TEXT | NOT NULL — JSON string of cached result |
| `updated_at` | TEXT | NOT NULL |
| `created_at` | TEXT | default datetime('now') |


---

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
D1 referrals.referrer_id  ←→  D1 users.id (referrer)
D1 referrals.referee_id   ←→  D1 users.id (referee)
D1 referrals.referral_code ←→ Neon "User".referral_code (referral tracking)
D1 place_location_cache.place_id  ←→  stepper_form_data.placeId (teacher count resolution)
D1 nudge_template_configs.slug  ←→  nudge_type values in D1 nudges (WhatsApp delivery config)
```
