---
skills: [product-context, codebase-context, engineering-review]
last_updated: Mar 2026
source: Neon pg_dump --schema-only (staffroom-schema.sql), NestJS codebase analysis (backend-nest/src/)
staleness_note: >
  Schema reflects production state as of Mar 2026. Verify against Neon and D1 before any
  migration, column addition, or query change. For Neon: pg_dump --schema-only. For D1:
  PRAGMA table_info(<table>) via Cloudflare MCP or wrangler.
---

# staffroom — Neon Schema

Neon PostgreSQL is the primary application database. Accessed via raw `pg` Pool (NOT TypeORM) through `PostgresService`.

> For D1 schema, dual-database tables, and cross-database relationships → `d1-schema.md`

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

### `searches` (Neon)
Search query log. One row per search request from the `/search/resolve` endpoint.

| Column | Type | Notes |
|---|---|---|
| `name` | text | The search term entered by the teacher — NOT the teacher's name |
| *(additional columns — verify against pg_dump for full schema)* | | |

**Key distinction:** `name` stores the search query string (e.g., "Delhi Public School Bengaluru"), not any personal identifier. Do not confuse with teacher name fields.

**Used by:** `search.service.ts` (INSERT on every `/search/resolve` call). Referenced for search-count metrics in `staffroom-product-metrics.md`.

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

## 3. Neon Enum Types


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

## 4. Inactive / Legacy Neon Tables

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

> For D1 schema, dual-database tables, and cross-database relationships → `d1-schema.md`
