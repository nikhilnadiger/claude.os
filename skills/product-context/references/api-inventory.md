---
skills: [product-context]
last_updated: Mar 2026
source: live codebase — backend-nest/src/ (verified Mar 2026)
---

# staffroom — API Inventory

All endpoints live on the NestJS backend (`backend-nest/src/`). Base URL
resolved via `getApiBaseUrl()` in server-side code; client-side uses
helpers from `lib/api-client.ts`.

Do not reference legacy CF Worker endpoints (`api.thestaffroom.in`,
`thestaffroom2024.*`). These are deprecated and must not be called.

---

## Auth Module — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/send-otp` | None | Sends OTP to teacher's phone via WhatsApp/SMS. Body: `{ phone: string }` |
| POST | `/auth/verify` | None | Verifies OTP. Body: `{ phone: string, otp: string }`. Returns JWT in response body; stored in httpOnly cookie by frontend. |
| GET | `/auth/me` | JWT required | Returns current authenticated user profile. Used by `getServerSideProps` to verify session on protected pages. |

---

## Schools Module — `/schools`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/schools/:identifier` | Optional | Returns school profile + aggregate review scores. `:identifier` = slug or ID. Includes teacher count resolution (Neon → D1 flow — see data-flow.md Flow 2). |
| GET | `/schools/:identifier/reviews` | Optional | Returns paginated teacher experiences for a school. Teacher identity never returned — anonymity preserved. |
| GET | `/top-rated` | None | Returns schools ranked by aggregate review scores, above a minimum review count threshold. Not a certification — a ranked list. |

---

## Search Module — `/search`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/search/resolve` | Optional | Searches schools by name. Body: `{ name: string, userId?: string }`. Creates a `UserSearch` record in Neon `searches` table (field `name` = search term, not the teacher's name). Returns school slug, name, location, score data. |

---

## Short Form Module — `/short-form`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/short-form/save` | JWT required (`JwtAuthGuard`) | Saves or updates partial/complete review submission. Body: review form data. Upserts into `stepper_form_data` in Neon. On completion: creates `stepper_form_approval` record with 5 boolean approval fields (admin-reviewed). |
| GET | `/short-form/get` | Optional (enriches if present) | Retrieves teacher's existing form progress. Auth optional — reads JWT from header if present to return teacher's own submission. |

---

## Nudge Module — `/nudge`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/nudge` | Internal | System-triggered. Sends WhatsApp nudge to a teacher. Looks up teacher's phone in `users` table. Rate-limited per teacher per period to prevent spam. Not called from frontend directly. |

---

## Admin Routes

Admin routes are protected by `AdminAuthGuard`. Do not expose admin endpoints
in any public-facing frontend code. All `/admin/...` paths must carry
`@UseGuards(AdminAuthGuard)` in the controller — confirm this on any PR
touching admin functionality.

---

## Auth Model

| Situation | Guard | Notes |
|---|---|---|
| Protected route (must be logged in) | `JwtAuthGuard` | `@UseGuards(JwtAuthGuard)` on controller method |
| Auth enriches but not required | `OptionalJwtAuthGuard` or manual header check | See `schools.controller.ts` for reference pattern |
| Public — no auth needed | None | Omit guard entirely |
| Admin only | `AdminAuthGuard` | Required on all `/admin/...` routes |

JWT is issued at `/auth/verify`, stored in httpOnly cookie, sent as
`Authorization: Bearer <token>` on protected API calls. Validated via
Passport `JwtAuthGuard`.

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
