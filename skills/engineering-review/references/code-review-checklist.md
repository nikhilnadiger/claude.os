---
skills: [engineering-review]
last_updated: Mar 2026
source: live codebase (backend-nest/src/, pages/, lib/) + deployment context
---

# Code Review Checklist

## Section 1: Safety Rules — Blocking

Any PR that fails these must be rejected. No exceptions.

| Rule | Check |
|---|---|
| No calls to legacy CF workers | `grep -r "thestaffroom2024" .` returns nothing in new code |
| No calls to api.thestaffroom.in | `grep -r "api.thestaffroom.in" .` returns nothing in new code |
| No changes to `backend-deprecated/` | Diff shows no files modified under `backend-deprecated/` |
| No hardcoded `/api/...` paths in server-side code | No `fetch('/api/...` calls in `getServerSideProps` or server-side utilities |
| `getApiBaseUrl()` used for server-side API calls | All server-side fetches use `getApiBaseUrl()` from `lib/api-base.ts` |
| `pnpm build` passes | Both repo root and `/backend-nest` build with 0 errors |
| `pnpm lint` passes | Both repo root and `/backend-nest` lint with 0 errors |

---

## Section 2: NestJS Patterns

**Module structure:**
- New features register a NestJS module with `@Module({ imports, controllers, providers })`
- Module imported in `app.module.ts` — confirm it appears in the diff
- Services injected via constructor DI, not instantiated with `new`
- No business logic in controllers — controllers route + validate + delegate only

**PostgresService usage:**
- All DB access through `PostgresService` (injected as `private readonly postgres: PostgresService`)
- Queries use parameterised form: `this.postgres.query('SELECT ... WHERE id = $1', [id])`
- Returns `T[]` directly — the service unwraps `result.rows` internally. Access as `rows[0]`, not `result.rows[0]`.
- All `postgres.query()` calls must be awaited — missing `await` causes silent data loss
- **NOT TypeORM entity pattern** — no `@Entity()`, no `Repository<T>`, no `getRepository()`
- PostgresService wraps raw `pg` Pool with parameterised SQL. Do not introduce TypeORM patterns.

**DTOs:**
- Request validation uses class-validator decorators on DTO classes (`@IsString()`, `@IsNotEmpty()`, etc.)
- No raw `req.body` access without prior DTO validation

---

## Section 3: Next.js Patterns

**API calls:**
- Server-side: always `getApiBaseUrl()` from `lib/api-base.ts`, never hardcoded paths
- Client-side: use helpers from `lib/api-client.ts` where they exist
- Do not call `localhost:9000` directly — wrong in production and UAT
- Wrong fallback port to watch for: `8788` (old CF Worker port) — flag any occurrence

**Auth:**
- Protected pages: `UserAuthGuard` via `getServerSideProps`
- Optional auth: check for token in cookie/header, proceed with or without user
- Admin pages: `AdminAuthGuard` — confirm guard is applied, not missing

**State:**
- Redux store in `store/slices/` — new state goes in a new slice file
- Do not add component-local state for data that should be global
- Component-local UI state (open/closed, hover, loading) can stay in `useState`

**Animations:**
- Use `m.*` pattern (lazy-loaded): `import { m } from 'framer-motion'`
- Not `motion.*` — this loads the full bundle eagerly, hurts performance on low-end devices
- Wrap animated sections in `<AnimatePresence>` for enter/exit
- Animation duration ≤ 0.6s — longer feels broken on budget Android devices

---

## Section 4: Database

**Active tables (Neon PostgreSQL):**

| Table | Status | Notes |
|---|---|---|
| `stepper_form_data` | Active | Primary review submission data |
| `stepper_form_approval` | Active | 5 boolean approval fields |
| `schools` | Active | School lookup — includes pincode and location fields |
| `"User"` | Active | Auth + profile (camelCase columns, Prisma-originated — must be quoted in SQL) |
| `searches` | Active | `name` field = search term (not the teacher's name) |
| `pincode_lookup` | Active | **Materialized view** in Neon — not a regular table. Fallback for location resolution. |
| `FormReview` | Legacy | `ENABLE_FORM_REVIEW_FETCH=false` — do not write new code against it |

**Cloudflare D1:**
- D1 is used by multiple NestJS modules — not just `teacher-counts`. Active modules using D1
  include: teacher-counts, nudges, tracking, places, admin, short-form, phone-otp, and others.
- All D1 access goes through `D1Service` — never query D1 directly from frontend or CF Workers.
- **Do not create new D1 tables without explicit approval from Nikhil.**
- New features that need new persistent data should use Neon via PostgresService by default.
- Full D1 table list: `product-context/references/d1-schema.md` Section 1.

---

## Section 5: Security

| Check | What to look for |
|---|---|
| JWT verification | Backend routes use `JwtAuthGuard` or `OptionalJwtAuthGuard` as appropriate — never unguarded for sensitive data |
| Anonymity preservation | Teacher identity (name, phone, email) never returned in school review responses or search results |
| Admin routes guarded | All `/admin/...` routes protected by `AdminAuthGuard` |
| No credentials in code | No API keys, tokens, or secrets hardcoded — use environment variables |
| Input validated | All user input goes through DTO validation before reaching service layer |

---

## Section 6: Common Failure Modes

These are the most frequently seen bugs in this codebase:

| Failure | How it manifests | Fix |
|---|---|---|
| Wrong fallback port | Code references `localhost:8788` (old CF Worker port) | Use `localhost:9000` for NestJS or `getApiBaseUrl()` |
| Business logic in `getServerSideProps` | Data transformation, conditionals, or calculations in the page function | Move to a service or utility function |
| `motion.div` instead of `m.div` | Larger JS bundle, slower initial load on low-end devices | Use `import { m } from 'framer-motion'` |
| Hardcoded `/api/` path | Works on localhost, fails in production (proxy inactive) | Always `getApiBaseUrl()` for server-side |
| D1 in new module | New feature queries D1 directly | Use Neon PostgreSQL via PostgresService |
| TypeORM pattern | `@Entity()`, `getRepository()`, `Repository<T>` | Use `PostgresService.query()` with parameterised SQL |
| Missing `await` on PostgresService | Silent data loss or stale data returned | All `this.postgres.query()` calls must be awaited |

---

## Section 7: Pre-PR Checklist

Complete all items before pushing. No shortcuts.

**Build + lint:**
- [ ] `pnpm build` in repo root — 0 errors
- [ ] `pnpm lint` in repo root — 0 errors
- [ ] `pnpm build` in `/backend-nest` — 0 errors
- [ ] `pnpm lint` in `/backend-nest` — 0 errors

**Local testing:**
- [ ] Feature works end-to-end on localhost
- [ ] Tested at 360px mobile viewport (Chrome DevTools — this is the minimum Android width in production traffic)
- [ ] Edge cases covered: empty state, error state, loading state
- [ ] No console errors or warnings in browser devtools
- [ ] No unexpected network requests in devtools Network tab

- [ ] Apply Test Fidelity Classification (Section 9) to all tests — declare tier for each. All Fidelity C items must appear in the ready report before Nikhil decides to push to UAT.

**Safety grep checks:**
- [ ] `grep -r "thestaffroom2024" .` — no new references
- [ ] `grep -r "api.thestaffroom.in" .` — no new references in active code
- [ ] `grep -rn "fetch('/api/" pages/` — no new hardcoded paths in server-side code
- [ ] `grep -rn "localhost:8788" .` — no references

**Database:**
- [ ] If schema change: migration file written and tested locally
- [ ] If new table: confirmed in Neon by default; new D1 tables require explicit Nikhil approval
- [ ] If data migration: tested with real data shape, rollback path documented

---

## Section 8: Cross-Impact Analysis

Complete this for every proposed change before finalising a plan. No item is
exempt — even small changes can have non-obvious downstream effects.

**For each proposed change, answer:**

| Question | Required answer |
|---|---|
| What other features, APIs, or flows does this change touch? | List them explicitly. "None" must be verified, not assumed. |
| Can this change break, slow, or degrade any currently working feature? | State any risk — even mild. Silence is not acceptable. |
| Is this fix addressing the root cause, or a visible symptom? | If symptom-only: which root-cause fix must accompany it to be effective? |
| Are any two items in this plan solving the same root problem? | If yes, merge them into one item. |
| Does this change have hard dependencies (A only works if B is done first)? | If yes, state explicitly and sequence accordingly. |
| Does this change affect cost, complexity, or response speed? | If yes, explain the impact and why it is justified. |

**WebView-specific cross-impact check:**
For any change involving OTP, authentication, external links, deep links, or
browser navigation — confirm whether the fix also works inside Instagram and
WhatsApp in-app browsers. A fix that works in real Chrome but fails in a
WebView is an incomplete fix. State the WebView behaviour explicitly.

---

## Section 9: Test Fidelity Framework

Every test falls into one of three tiers. Declare the tier for each test in the ready report. Never report a Fidelity B or C test as passing without stating the limitation.

**Fidelity A — Claude Code can run, result reliable:**
Build, lint, grep safety checks, API responses, server-side rendering, Redux state, DB query results, network request inspection in devtools.

**Fidelity B — proxy only. Must declare the proxy and its known limitation:**

| Proxy used | What it covers | What it does NOT cover |
|---|---|---|
| Chrome DevTools at 360px | Viewport width, layout reflow | WebView keyboard behavior — `visualViewport.resize` fires in Chrome but not in real Instagram/WhatsApp/Facebook in-app browsers |
| Chrome DevTools network throttling | Approximate bandwidth reduction | Real network variability, packet loss, and latency on budget Android devices |
| Lighthouse / DevTools CPU throttling | Approximate performance signal | Real memory pressure, thermal throttling, and jank on low-end devices |

**Fidelity C — cannot test. Requires Nikhil's manual verification before UAT push:**
- Real WebView keyboard behavior: input field visibility above keyboard on focus in Instagram, WhatsApp, Facebook, Telegram, LinkedIn in-app browsers
- Real OTP flow: requires Nikhil's phone to receive and enter the OTP
- Real low-end Android device: CPU/memory pressure, scroll jank, touch response
- Share deep links: correct opening behavior in external apps
- Any behavior dependent on the system keyboard rather than the browser's simulated keyboard

**Rule:** All Fidelity C items relevant to the PR must appear verbatim in the ready report under "Requires manual verification." The ready report format is defined in `codebase-context/references/deployment-guide.md`.
