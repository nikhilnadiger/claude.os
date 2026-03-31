---
skills: [product-context, codebase-context, engineering-review]
last_updated: Mar 2026
source: Neon pg_dump --schema-only (staffroom-schema.sql), Cloudflare D1 live query (REVIEW_DB), NestJS codebase analysis (backend-nest/src/)
staleness_note: >
  Schema reflects production state as of Mar 2026. Verify against Neon and D1 before any
  migration, column addition, or query change. For Neon: pg_dump --schema-only. For D1:
  PRAGMA table_info(<table>) via Cloudflare MCP or wrangler.
---

# staffroom — Database Schema

Two databases are in production:

- **Neon PostgreSQL** — primary application database. Accessed via raw `pg` Pool (NOT TypeORM) through `PostgresService`.
- **Cloudflare D1** (REVIEW_DB, uuid: `a8fabb84-3699-4c60-a431-82ef3dd94053`) — secondary database. Accessed via `D1Service` (REST API calls to Cloudflare). Used for the nudge/tracking pipeline and admin auth.

**Important:** Several tables exist in BOTH databases. The NestJS code exclusively uses D1 for those tables — the Neon copies are historical shadows from pre-NestJS infrastructure. See [Section 5: Dual-Database Tables](#5-dual-database-tables--neon-shadows).

---

## 1. Active Neon Tables

These tables are actively queried or written by NestJS `backend-nest/src/`.

---

### `"User"` (Neon)
Primary user table. Created by Prisma; camelCase column names.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | text | PK | UUID string |
| `name` | text | nullable | Display name |
| `email` | text | nullable | |
| `emailVerified` | timestamp(3) | nullable | Prisma auth field |
| `image` | text | nullable | |
| `phone` | text | nullable | 10-digit Indian mobile |
| `createdAt` | timestamp(3) | NOT NULL, default NOW | |
| `updatedAt` | timestamp(3) | NOT NULL | |
| `referralCode` | text | nullable | auto-generated: `u_<userId[0:8]>` |
| `referralCount` | integer | NOT NULL, default 0 | |
| `referralVerifiedReviewCount` | integer | NOT NULL, default 0 | |
| `referredById` | text | nullable, FK → User.id | |

**Used by:** `auth.service.ts` (OTP login), `referral.service.ts`, `user-context.service.ts`, `short-form-legacy.service.ts`, admin users service.

---

### `"UserLoginSession"` (Neon)
One row per login event. Used to store geolocation (lat/lon → pincode/city via reverse geocoding).

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | text | PK | UUID |
| `userId` | text | NOT NULL, FK → User.id | |
| `latitude` | double precision | nullable | |
| `longitude` | double precision | nullable | |
| `loggedInAt` | timestamp(3) | NOT NULL, default NOW | |
| `pincode` | text | nullable | reverse-geocoded from lat/lon |
| `city` | text | nullable | reverse-geocoded from lat/lon |

**Used by:** `login-session.service.ts` (INSERT on login), `user-context.service.ts` (SELECT city/pincode), admin users service.

---

### `stepper_form_data` (Neon)
**The primary review table.** One row per user per school per review attempt.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | text | PK | UUID |
| `reviewId` | text | NOT NULL | format: `review_<userId[0:8]>_<timestamp>` |
| `placeId` | text | nullable | Google Maps Place ID |
| `userId` | text | nullable | FK → User.id |
| `schoolId` | bigint | nullable | legacy duplicate of school_id |
| `school_id` | bigint | nullable | FK → schools.school_id |
| `schoolName` | text | nullable | denormalized school name |
| `userName` | text | nullable | denormalized user display name |
| `workedRecently` | text | nullable | **Section 0** anchor field — if null/blank, review is not live |
| `salaryOnTime` | text | nullable | |
| `professionalFeedback` | text | nullable | |
| `writtenContract` | text | nullable | |
| `overallExperience` | integer | nullable | 1–5 star rating — **required for live review** |
| `applyingForLeave` | text | nullable | **Section 1** starts here |
| `workingWithTeachers` | text | nullable | |
| `workingWithManagement` | text | nullable | |
| `tryingNewThings` | text | nullable | |
| `givingFeedbackToPrincipal` | text | nullable | |
| `daysWorkHome` | text | nullable | |
| `salaryPerMonth` | integer | nullable | **Section 2** starts here |
| `benefits` | text | nullable | JSON array string |
| `feesDeductions` | text | nullable | JSON array string |
| `totalWorkExperience` | integer | nullable | years |
| `highestQualification` | text | nullable | |
| `designation` | text | nullable | |
| `benefitsOther` | text | nullable | |
| `feesDeductionsOther` | text | nullable | |
| `whatYouLike` | text | nullable | **Section 3** — free text |
| `whatToImprove` | text | nullable | **Section 3** — presence = full completion |
| `createdAt` | timestamp(3) | NOT NULL, default NOW | |
| `updatedAt` | timestamp(3) | NOT NULL | |

**Review form sections (derived from `question_completion_tracking` column names):**
- **Section 0 (S0):** `workedRecently` answered
- **Section 1 (S1):** S0 + `salaryOnTime` + `overallExperience` answered
- **Section 2 (S2):** S1 + all of: `salaryPerMonth`, `totalWorkExperience`, `highestQualification`, `designation`, `daysWorkHome`, `benefits`, `feesDeductions`, `applyingForLeave`, `workingWithTeachers`, `workingWithManagement`, `tryingNewThings`, `givingFeedbackToPrincipal` answered
- **Section 3 (S3 / full):** `whatYouLike` + `whatToImprove` answered — this is "full completion"

**Live review criteria:** `workedRecently` IS NOT NULL AND TRIM ≠ '' AND `overallExperience` IS NOT NULL AND > 0.

**Used by:** `short-form.service.ts` (CRUD), `schools.service.ts` (read), `user-context.service.ts` (read), `referral.service.ts` (read), admin review-density + users services.

---

### `stepper_form_approval` (Neon)
Moderation flags for each review field. Joined with `stepper_form_data` via `reviewId`.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | text | PK | UUID |
| `reviewId` | text | NOT NULL | FK → stepper_form_data.reviewId |
| `placeId` | text | nullable | |
| `userId` | text | nullable | |
| `schoolId` | integer | nullable | |
| `school_id` | integer | nullable | |
| `schoolName` | text | nullable | |
| `userName` | text | nullable | |
| `workedRecentlyApproved` | boolean | NOT NULL, default true | |
| `salaryOnTimeApproved` | boolean | NOT NULL, default true | |
| `professionalFeedbackApproved` | boolean | NOT NULL, default true | |
| `writtenContractApproved` | boolean | NOT NULL, default true | |
| `overallExperienceApproved` | boolean | NOT NULL, default true | |
| `applyingForLeaveApproved` | boolean | NOT NULL, default true | |
| `workingWithTeachersApproved` | boolean | NOT NULL, default true | |
| `tryingNewThingsApproved` | boolean | NOT NULL, default true | |
| `givingFeedbackToPrincipalApproved` | boolean | NOT NULL, default true | |
| `daysWorkHomeApproved` | boolean | NOT NULL, default true | |
| `salaryPerMonthApproved` | boolean | NOT NULL, default true | |
| `benefitsApproved` | boolean | NOT NULL, default true | |
| `feesDeductionsApproved` | boolean | NOT NULL, default true | |
| `totalWorkExperienceApproved` | boolean | NOT NULL, default true | |
| `benefitsOtherApproved` | boolean | NOT NULL, default true | |
| `feesDeductionsOtherApproved` | boolean | NOT NULL, default true | |
| `whatYouLikeApproved` | boolean | NOT NULL, default true | |
| `whatToImproveApproved` | boolean | NOT NULL, default true | |
| `highestQualificationApproved` | boolean | NOT NULL, default true | |
| `workingWithManagementApproved` | boolean | NOT NULL, default true | (inferred — queried by schools.service.ts but not in schema listing; likely present) |
| `createdAt` | timestamp(3) | NOT NULL, default NOW | |
| `updatedAt` | timestamp(3) | NOT NULL | |

**Used by:** `schools.service.ts`, `user-context.service.ts` (LEFT JOIN on reviewId).

---

### `school_mapping` (Neon)
Maps Google Place IDs to UDISE school IDs. Central bridge table.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `school_id` | bigint | nullable, FK → schools.school_id | |
| `year_id` | integer | nullable | UDISE data year |
| `address` | text | nullable | formatted address |
| `pincode` | varchar(50) | nullable | |
| `place_id` | text | nullable | Google Maps Place ID |
| `latitude` | numeric | nullable | |
| `longitude` | numeric | nullable | |
| `circle_name` | text | nullable | India Post circle |
| `region_name` | text | nullable | India Post region |
| `division_name` | text | nullable | India Post division |
| `district_name` | text | nullable | |
| `state_name` | text | nullable | |
| `pincode_source` | text | nullable | e.g. 'google', 'nominatim', 'udise' |

**Used by:** `schools.service.ts`, `teacher-counts.service.ts`, `places.service.ts`, `school-details.service.ts`, admin services.

---

### `schools` (Neon)
UDISE school master data. ~1.5M+ private school records.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `school_id` | bigint | PK (de facto) | UDISE school code |
| `udise_sch_code` | text | nullable | |
| `school_name` | text | nullable | |
| `pincode` | bigint | nullable | |
| `state_name` | text | nullable | |
| `district_name` | text | nullable | |
| `block_name` | text | nullable | |
| `cluster_name` | text | nullable | |
| `discovered_year_hint` | bigint | nullable | |
| `discovered_at` | text | nullable | |
| `city` | text | nullable | |

**Used by:** `schools.service.ts`, `teacher-counts.service.ts`, admin services, `places.service.ts`.

---

### `profile` (Neon)
School contact and administrative profile from UDISE. One row per school+year.

| Column | Type | Notes |
|---|---|---|
| `school_id` | bigint | FK → schools.school_id |
| `year_id` | bigint | UDISE year |
| `address` | text | |
| `website` | text | |
| `email` | text | |
| `headMasterName` | text | |
| `estdYear` | text | |
| `boardSecName` | text | |
| `boardHighSecName` | text | |
| `schPhone` | text | |
| `mediumOfInstr1`…`4` | text | medium of instruction |
| `boardSec`, `boardHighSec` | bigint | board affiliation codes |
| *(+ 30+ more admin/recognition fields)* | | rarely queried |

**Used by:** `schools.service.ts` (headMasterName, website, email, schPhone only).

---

### `report_card` (Neon)
UDISE report card data per school per year. One row per school+year.

**Key columns queried by code:**
`udiseschCode`, `schoolName`, `stateName`, `districtName`, `blockName`, `pincode`, `schCategoryDesc`, `schTypeDesc`, `schMgmtStateDesc`, `schMgmtNationalDesc`, `schStatusName`, `lowClass`, `highClass`, `totalTeacher`, `totMale`, `totFemale`, `totTchBelowGraduate`, `totTchGraduateAbove`, `totTchPgraduateAbove`, `tchAbove55`

*(Full table has 80+ columns covering teacher counts by category, grants, expenditure, geographic coding — see SQL dump for complete definition)*

**Used by:** `schools.service.ts` (COALESCE fallbacks for school name/location), `school-details.service.ts` (teacher + contact info).

---

### `facility` (Neon)
UDISE infrastructure/facility data per school per year.

**Key columns queried by code:**
`bldStatus`, `clsrmsInst`, `toiletYn`, `toiletb`, `toiletg`, `internetYn`, `laptopTot`, `tabletsTot`

*(Full table has 60+ columns — see SQL dump for complete definition)*

**Used by:** `school-details.service.ts` (infrastructure info panel).

---

### `save_school_by_user` (Neon)
Schools bookmarked by a user.

| Column | Type | Constraints |
|---|---|---|
| `id` | text | PK (UUID) |
| `userId` | text | NOT NULL, FK → User.id |
| `placeId` | text | nullable |
| `schoolId` | integer | nullable |
| `name` | text | NOT NULL |
| `address` | text | NOT NULL |
| `url` | text | nullable |
| `savedAt` | timestamp(3) | NOT NULL, default NOW |
| `updatedAt` | timestamp(3) | NOT NULL |

**Used by:** `saved-schools.service.ts`.

---

### `whatsapp_users` (Neon)
WhatsApp-verified user records. One row per verified phone number.

| Column | Type | Constraints |
|---|---|---|
| `id` | text | PK (UUID) |
| `phone` | text | NOT NULL |
| `userId` | text | NOT NULL, FK → User.id |
| `verifiedAt` | timestamp(3) | NOT NULL, default NOW |
| `createdAt` | timestamp(3) | NOT NULL, default NOW |
| `updatedAt` | timestamp(3) | NOT NULL |
| `name` | text | nullable |
| `occupation` | text | nullable |
| `pincode` | text | nullable |

**Used by:** `whatsapp.service.ts`, admin users service.

---

### `pincode_directory` (Neon)
India Post pincode reference data. ~160K+ rows. Source table for the `pincode_lookup` materialized view.

| Column | Type | Notes |
|---|---|---|
| `id` | integer | PK, serial |
| `circle_name` | text | India Post circle |
| `region_name` | text | |
| `division_name` | text | |
| `office_name` | text | Post office name |
| `pincode` | text | NOT NULL |
| `office_type` | text | HO / PO / BO |
| `delivery` | text | 'Delivery' or other |
| `district` | text | |
| `state_name` | text | |
| `latitude` | numeric | |
| `longitude` | numeric | |

**Not directly queried** — all access is through `pincode_lookup` materialized view.

---

## 2. Materialized View: `pincode_lookup` (Neon)

One row per pincode (DISTINCT ON pincode, preferring Delivery offices > HO > PO > BO).

| Column | Type |
|---|---|
| `pincode` | text |
| `circle_name` | text |
| `region_name` | text |
| `division_name` | text |
| `district` | text |
| `state_name` | text |
| `latitude` | numeric |
| `longitude` | numeric |

**Used by:** `teacher-counts.service.ts` (fallback pincode → district/state resolution when `schools` table has no match).
**Refresh:** `REFRESH MATERIALIZED VIEW pincode_lookup` — must be run after `pincode_directory` updates.

---

## 3. Active D1 Tables

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

## 4. Neon Enum Types

| Enum | Values | Usage |
|---|---|---|
| `BadgeType` | FIRST_VOICE, ACTIVE_VOICE, GUIDE, COMMUNITY_BUILDER, MOVEMENT_LEADER | UserBadge table (inactive) |
| `DeliveryStatus` | SENT, DELIVERED, OPENED, CLICKED, BOUNCED, UNSUBSCRIBED | EmailLog (legacy) |
| `EmailType` | (various) | EmailLog (legacy) |
| `FormVerificationStatus` | PENDING, APPROVED, REJECTED | FormReview (legacy) |
| `IssueType` | (various) | Issue table (inactive) |
| `NextEmailType` | (various) | UserEmailState (inactive) |
| `ReviewTag` | (various) | Review (legacy) |
| `UserStateType` | NEW_SIGNUP, etc. | UserEmailState (inactive) |

None of these enums are used by active NestJS code.

---

## 5. Dual-Database Tables — Neon Shadows

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

## 6. Inactive / Legacy Neon Tables

These tables exist in the Neon schema but have **zero references** in `backend-nest/src/`. They are either from the pre-NestJS era, from Prisma scaffolding, or from abandoned features.

| Table | Likely origin |
|---|---|
| `"Account"` | Prisma NextAuth scaffolding |
| `"Authenticator"` | Prisma NextAuth |
| `"Session"` | Prisma NextAuth |
| `"VerificationToken"` | Prisma NextAuth |
| `"_prisma_migrations"` | Prisma system table |
| `neon_auth.users_sync` | Neon Auth system |
| `"FormReview"` | Legacy review form (ENABLE_FORM_REVIEW_FETCH=false env flag) |
| `"Review"` | Pre-stepper review system |
| `"School"` | Pre-schools table |
| `"EmailLog"` | Email pipeline (no longer in use) |
| `"UserEmailState"` | Email state machine (no longer in use) |
| `"UserBadge"` | Badge system (replaced by D1 badge_contributor) |
| `"UserLocationPincode"` | Replaced by UserLoginSession.pincode |
| `"UserSearch"` | Replaced by D1 user_tracking |
| `"UnfoundSchoolSearch"` | Unused |
| `"Issue"` | Internal issue tracking, unused |
| `"AiSalaryData"`, `"IndeedSalaryData"`, `"NaukriSalaryData"` | Salary research data, not queried |
| `"MedianSalary"`, `"MergedSalary"` | Salary aggregates, not queried |
| `"NoDataSchol"`, `"NoEmailSchool"`, `"NoReviewSchool"`, `"NoSalarySchool"` | Admin reporting tables, not queried |
| `"_NoReviewSchoolToReview"` | Prisma junction table |
| `"SchoolOutreachLog"` | Outreach tracking, not queried |
| `by_year_snapshot`, `by_year_snapshot_old` | UDISE year snapshots, not queried |
| `schools_full` | Denormalized UDISE view, not queried |
| `schools_google_cache` | Google Places cache (not referenced) |
| `school_status_ok` | AI review staging, not queried |
| `school_visit` | Visit tracking (replaced by D1 user_tracking) |
| `school_year` | UDISE year mappings, not queried |
| `short_form_section` | Old form structure, not queried |
| `fetch_status` | UDISE data fetch status, not queried |
| `phone_verified_users` | Pre-whatsapp_users table |
| `place_location_cache` | Google place resolution cache (NOT D1 place_city_cache — different table entirely) |
| `"schoolMails"` | School email outreach list, not queried |
| `school_status_ok` | Not queried |
| `"UserEmailState"` | Not queried |

---

## 7. D1 Tables With No Active Code Reference

| Table | Notes |
|---|---|
| `place_city_cache` | D1-only table (not in Neon). Not referenced anywhere in backend-nest/src/. Possibly written by legacy CF Workers. |
| `top_rated_cache` | Exists in both Neon and D1. Not referenced in NestJS code. Dead feature. |

---

## 8. Key Cross-Database Relationships

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
