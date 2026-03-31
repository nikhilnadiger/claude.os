---
skills: [codebase-context]
last_updated: Mar 2026
source: live codebase + infrastructure
---

# Stack Topology

---

## Frontend

| Item | Detail |
|---|---|
| Framework | Next.js 16 |
| UI library | React 19 |
| Styling | Tailwind v4 |
| State | Redux Toolkit |
| Port (prod) | :3000 |
| Port (UAT) | :5000 |

---

## Backend (Active — backend-nest/)

| Item | Detail |
|---|---|
| Framework | NestJS 11 |
| DB client | pg (raw Pool, parameterised queries — NOT TypeORM) |
| Auth | Passport/JWT |
| DB driver | pg (PostgreSQL) |
| Port (prod) | :9000 |
| Port (UAT) | :7000 |
| Process manager | PM2, user: stfrmuser1 |
| External URL (prod) | api-prod.thestaffroom.in |
| External URL (UAT) | uat-api.thestaffroom.in |

**API routing:**
- Production: `NEXT_PUBLIC_API_BASE_URL=https://api-prod.thestaffroom.in`
  (baked into Next.js build at build time — changing requires a rebuild)
- Localhost/UAT: catch-all proxy at `pages/api/[...path].ts` →
  `INTERNAL_BACKEND_URL` (NOT active in production)
- Always use `getApiBaseUrl()` from `lib/api-base.ts` for server-side calls.
  Never hardcode `/api/...` paths.

---

## Backend (Legacy — DO NOT CALL)

Two Cloudflare Workers are still deployed but are NOT used by the active
codebase. Do not add any code that calls either of these.

| Worker | URL | Status |
|---|---|---|
| school-review worker | school-review.thestaffroom2024.workers.dev | Legacy — safe to disable |
| backend worker | api.thestaffroom.in | Legacy — DO NOT CALL |

**school-review worker:** Original backend from separate repo (school-reviewer-forked).
~59 req/24h from its own internal cron jobs. Cron calls a dead Azure endpoint
(orailap.azurewebsites.net) — all subrequests returning 4xx. Zero references
in current frontend or NestJS. Safe to disable when convenient.

**backend worker:** Corresponds to `backend-deprecated/` in repo. ~28 req/24h
from old cached clients or crawlers, NOT from the main app. Still receiving
legacy traffic — do not touch backend-deprecated/.

---

## Hosting

| Environment | Droplet | Region | Services |
|---|---|---|---|
| Production | strm-app-prd | BLR1 | Next.js :3000 + NestJS :9000 |
| UAT | ubuntu-s-1vcpu-2gb-blr1-01 | BLR1 | Next.js :5000 + NestJS :7000 |

**nginx (production):**
- `thestaffroom.in` → `:3000` (Next.js)
- `api-prod.thestaffroom.in` → `:9000` (NestJS)

**nginx (UAT):**
- `uat-api.thestaffroom.in` → NestJS UAT instance

---

## Database

| DB | Purpose | Used by |
|---|---|---|
| Neon PostgreSQL | Primary — reviews, users, schools, UDISE data | NestJS (backend-nest) via PostgresService |
| Cloudflare D1 (REVIEW_DB) | Nudge pipeline, tracking, admin auth, school enrichment | NestJS via D1Service (REST API) |

**D1 is used by more than just teacher-counts.** Active D1 tables include:
`teacher_counts`, `admins`, `users` (legacy phone store), `question_completion_tracking`,
`nudges`, `nudge_link_clicks`, `phone_otps`, `manual_schools`, `unmapped_schools`,
`school_details_cache`, `api_cache`, `user_tracking`, `share_clicks`, `share_events`,
`badge_contributor`, and four queue tables (`search_intent_queue`, `abandonment_queue`,
`update_is_live_queue`, `full_completion_queue`).

**Several tables exist in BOTH databases** — the Neon copies are historical shadows;
NestJS always reads/writes the D1 versions for those tables.

Full schema with all columns, constraints, and active/legacy status:
→ `product-context/references/db-schema.md`

Do not create new D1 tables or new Neon tables without explicit approval from Nikhil.
Do not query D1 from the frontend or a CF Worker — always go through NestJS.

---

## Repository

- Path: `/mnt/GitHub/staffroom-v2`
- `backend-nest/` — active NestJS backend (all new features here)
- `backend-deprecated/` — old CF Worker (deployed, do not touch)
- `PROJECT_REFERENCE.md` — **outdated**, describes old dual-CF-Worker
  architecture. Ignore entirely.
