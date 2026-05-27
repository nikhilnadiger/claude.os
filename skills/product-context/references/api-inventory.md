---
skills: [product-context]
last_updated: May 2026
source: live codebase — backend-nest/src/ (all controllers verified Apr 2026) + rum.controller.ts verified May 2026
---

# staffroom — API Inventory

All endpoints live on the NestJS backend (`backend-nest/src/`). Base URL
resolved via `getApiBaseUrl()` in server-side code; client-side uses
helpers from `lib/api-client.ts`.

Do not reference legacy CF Worker endpoints (`api.thestaffroom.in`,
`thestaffroom2024.*`). These are deprecated and must not be called.

---

## WhatsApp Auth Module — `/whatsapp`

Teacher-facing authentication. **Not `/auth/`** — the `/auth/` prefix
belongs to admin login only (see Admin Routes below).

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/whatsapp/send-otp` | None | Sends OTP to teacher's phone via WhatsApp. Body: `{ phone: string }` |
| POST | `/whatsapp/verify-otp` | None | Verifies OTP. Body: `{ phone: string, otp: string }`. Returns JWT in response body. |
| POST | `/whatsapp/update-profile` | JWT required | Updates teacher's pincode and occupation post-login (profile completion step). |

> There is **no `/auth/send-otp`**, **no `/auth/verify`**, and **no `/auth/me`** endpoint
> for teachers. Session verification is done via `GET /user/context` (see User Module below).

---

## User Module — `/user`

Teacher profile, badges, referrals, and session verification.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/user/context` | JWT required | Returns current teacher profile, badge status, and contribution summary. Used by `getServerSideProps` on protected pages to verify session. This is the correct session-check endpoint — not `/auth/me`. |
| GET | `/user/badge-status` | JWT required | Returns whether the teacher has earned the "Contributor" badge. |
| GET | `/user/referral` | JWT required | Returns the teacher's referral code and referral stats. |
| POST | `/user/login-session` | JWT required | Records a login session event for tracking. |

---

## Saved Schools Module — `/user/saved-schools`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/user/saved-schools/status` | JWT required | Returns saved status for a given school (query param). |
| POST | `/user/saved-schools/toggle` | JWT required | Toggles saved/unsaved for a school. Body: `{ schoolId?, placeId? }` |

---

## Schools Module — `/schools`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/schools/:identifier` | Optional | Returns school profile + aggregate review scores. `:identifier` = slug or ID. Includes teacher count resolution (Neon → D1 flow — see data-flow.md Flow 2). |
| GET | `/schools/:identifier/reviews` | Optional | Returns paginated teacher experiences for a school. Teacher identity never returned — anonymity preserved. |
| GET | `/schools/:identifier/details` | Optional | Returns supplementary school data (report_card + facility). Read-through cache via `school_details_cache` in D1. |
| GET | `/schools/:identifier/salary-ranges` | Optional | Returns salary range data for a school derived from review submissions. |
| GET | `/schools/near-me` | Optional | Returns schools near a given location. Query params: `lat`, `lng`. |
| GET | `/schools/slugs` | None | Returns list of all school slugs (used for static generation). |

---

## Top Rated Module — `/top-rated`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/top-rated` | None | Returns schools ranked by aggregate review scores above a minimum review count threshold. Not a certification — a ranked list. |

---

## Search Module — `/search`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/search/resolve` | Optional | Resolves a Google Place ID to a staffroom school record. Body: `{ placeId: string (required), schoolName?: string }`. `placeId` is mandatory — returns 400 if missing. Calls `PlacesService.resolvePlaceId()` internally. **Does NOT search by school name and does NOT log to any Neon table.** School name autocomplete is `GET /places/autocomplete`. |

---

## Places Module — `/places`

Used in `/share-experience` school search (Google Places-backed, not UDISE search).

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/places/autocomplete` | Optional | School name autocomplete using Google Places API. Query param: `input`. Results cached in `place_city_cache` and `place_location_cache` in D1. |
| GET | `/places/:placeId/city` | Optional | Returns city/district/state for a Google Places ID. Used to resolve teacher count geography. |

---

## Teacher Counts Module — `/teacher-counts`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/teacher-counts/location-from-pincode` | None | Resolves a pincode to a location and returns teacher headcount for that area from D1 `teacher_counts` table. |

---

## Short Form Module — `/short-form`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/short-form/save` | JWT required (`JwtAuthGuard`) | Saves or updates partial/complete review submission. Upserts into `stepper_form_data` in Neon and `question_completion_tracking` in D1. Also enqueues nudge triggers. |
| GET | `/short-form/get` | Optional (enriches if present) | Retrieves teacher's existing form progress. Auth optional — reads JWT from header if present to return teacher's own submission. |

> **`stepper_form_approval` is never written by any code.** No moderation pipeline is implemented.

---

## Insights Module — `/insights`

Career insights and salary data derived from aggregated review submissions.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/insights/career-stats` | None | Returns aggregated salary, experience, and role stats from `stepper_form_data`. Powers the Career Insights section. |
| GET | `/insights/user-insights` | JWT required | Returns personalised career insights for the logged-in teacher based on their designation, experience, and subject. |

---

## Tracking Module — `/tracking`

Tracks teacher actions for the nudge pipeline and analytics.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/tracking/search` | Optional | Records a search event. Lightweight — returns `{ success: true }`. |
| POST | `/tracking/visit` | Optional | Records a school page visit. Body: `{ trackingId?, schoolId?, placeId? }`. Inserts into `user_tracking` in D1 and populates `search_intent_queue`. |
| POST | `/tracking/share` | Optional (`OptionalJwtGuard`) | Records a share click or share completion event. Inserts into `share_clicks` or `share_events` in D1. |

---

## Nudge Module — `/nudge`

Handles redirect links from WhatsApp nudge messages. **Not a teacher-facing action endpoint.**
Nudge sending is queue-based — see data-flow.md Flow 5 for the full pipeline.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/nudge/go` | None | Redirect link used in WhatsApp nudge messages. Query params: `to` (destination URL), optional tracking params. Logs to `nudge_link_clicks` in D1, then redirects. |
| POST | `/nudge/record-landing` | None | Records where the teacher landed after following a nudge link. Body: `{ link?, is_webview?, user_id? }` |

---

## Referral Module — `/referral`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/referral` | None | Handles visiting a referral link. Query params: `code` (referral code), `redirect` (destination). Records the referral in D1 `referrals` table and redirects. |

---

## RUM Module — `/rum`

Real User Monitoring. Collects browser-side performance timing events (FCP, LCP, TTFB, etc.) from the Next.js frontend. Data is logged server-side; no DB write occurs.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/rum` | None | Ingests a RUM timing event from the browser. Body: `RumEvent` object (timing type + value). Returns HTTP 204 No Content. |

> This endpoint has no auth guard and no DB persistence. It is a fire-and-forget telemetry sink. Do not build features that depend on its data being durable.

---

## Admin Routes

All `/admin/...` paths are protected by `AdminAuthGuard`. Do not expose admin
endpoints in any public-facing frontend code.

**Auth:**
| Path | Description |
|---|---|
| `POST /admin/login` | Admin login. Body: `{ email, password }`. Returns admin JWT. |
| `GET /admin/health` | Health check. |

**Cron:**
| Path | Description |
|---|---|
| `POST /admin/cron/trigger` | Manually triggers the nudge processing pipeline (admin use only). The automated nudge schedule runs on an internal NestJS `@Cron('*/5 * * * *')` — this endpoint is not the scheduled mechanism. |
| `GET /admin/cron/status` | Returns cron job status. |
| `GET /admin/cron/history` | Returns recent cron run history. |

**Nudge management:**
| Path | Description |
|---|---|
| `GET /admin/nudges/summary` | Nudge counts by type and status. |
| `GET /admin/nudges/clicks` | Nudge link click data. |
| `GET /admin/nudges/clicks/summary` | Aggregated click stats. |
| `POST /admin/nudges/:id/resend` | Resend a failed nudge. |
| `PATCH /admin/nudges/:id` | Update nudge status. |
| `DELETE /admin/nudges/:id` | Delete a nudge record. |
| `POST /admin/nudges/requeue-cancelled` | Re-enqueue cancelled nudges. |

**Review density analytics:**
| Path | Description |
|---|---|
| `GET /admin/review-density/stats` | Overall review density stats. |
| `GET /admin/review-density/schools/review-by-school-wise` | Per-school review counts. |
| `GET /admin/review-density/schools/unique-school-pipeline` | Schools in the review pipeline. |
| `GET /admin/review-density/schools/rating-distribution` | Rating score distribution. |
| `GET /admin/review-density/districts` | Review density by district. |
| `GET /admin/review-density/pincodes` | Review density by pincode. |
| `GET /admin/review-density/unmapped` | Schools with unmapped place IDs. |

**User analytics:**
| Path | Description |
|---|---|
| `GET /admin/users/dashboard-summary` | Top-level dashboard KPIs. |
| `GET /admin/users/active-stats` | Active user counts. |
| `GET /admin/users/signup-stats` | Sign-up trends. |
| `GET /admin/users/contributor-stats` | Contributor badge stats. |
| `GET /admin/users/tracking-stats` | School page visit tracking stats. |
| `GET /admin/users/school-coverage-stats` | School coverage by city/district. |
| `GET /admin/users/by-save-count` | Users segmented by saved schools count. |
| `GET /admin/users/by-share-count` | Users segmented by share activity. |
| `GET /admin/users/by-share-type` | Users by share platform. |
| `GET /admin/users/by-referral-bucket` | Users by referral activity. |
| `GET /admin/users/by-active` | Active vs inactive users. |
| `GET /admin/users/by-contributor-status` | Contributor vs non-contributor. |
| `GET /admin/users/by-power-influencer-bucket` | Power influencer segments. |

**Other admin:**
| Path | Description |
|---|---|
| `GET /admin/whatsapp-stats/details` | WhatsApp message delivery stats. |
| `GET /admin/queues/diagnose` | Diagnose queue health and stuck items. |
| `POST /admin/cache/clear` | Clear D1 `api_cache` table. |
| `POST /admin/create` | Create admin user. Body: `{ phone, email?, name?, password_hash }` |
| `GET /admin/d1/tables/admins` | List admin records from D1. |
| `PUT /admin/manual-schools/:id` | Update a manual school record. |
| `DELETE /admin/manual-schools/:id` | Delete a manual school record. |
| `GET /admin/routes` | Lists all registered NestJS routes (dev/debug). |
| `GET /tables/:tableName` | Read a D1 table by name (dev/debug — no admin prefix). |

---

## Auth Model

| Situation | Guard | Notes |
|---|---|---|
| Protected route (must be logged in) | `JwtAuthGuard` | `@UseGuards(JwtAuthGuard)` on controller method |
| Auth enriches but not required | `OptionalJwtGuard` | See `tracking.controller.ts` for reference pattern |
| Public — no auth needed | None | Omit guard entirely |
| Admin only | `AdminAuthGuard` | Required on all `/admin/...` routes |

JWT is issued at `/whatsapp/verify-otp`, stored as auth token, sent as
`Authorization: Bearer <token>` on protected API calls. Validated via
Passport `JwtAuthGuard`. Session verified via `GET /user/context`.

---

## Key Constraints

- **Anonymity:** Teacher identity (name, phone, email) must never appear
  in school review responses or search results.
- **No legacy calls:** No frontend or backend code should reference
  `api.thestaffroom.in` or `thestaffroom2024.*` CF Worker paths.
- **Server-side fetching:** All `getServerSideProps` calls use
  `getApiBaseUrl()` from `lib/api-base.ts` — never hardcoded `/api/...` paths.
- **FormReview table:** Legacy. `ENABLE_FORM_REVIEW_FETCH=false`. Do not
  write new code against it.
- **stepper_form_approval:** Schema exists but is never written to. No moderation
  pipeline is implemented. Do not build new features assuming this works.
