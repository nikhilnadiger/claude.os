---
skills: [engineering-review]
last_updated: Mar 2026
source: live codebase (backend-nest/src/) + engineering principles
---

# Architecture Patterns

## NestJS Module Structure

Every new feature is a NestJS module. Standard structure:

```
backend-nest/src/feature-name/
├── feature-name.module.ts       — @Module decorator, imports, providers, controllers
├── feature-name.controller.ts   — Route handlers only, no business logic
├── feature-name.service.ts      — All business logic and DB access
└── dto/
    ├── create-feature.dto.ts    — Input validation with class-validator
    └── feature-response.dto.ts  — Response shaping (optional)
```

**Module registration:** Import into `app.module.ts`. Confirm it appears in the diff before merging.

---

## Controller Responsibilities

Controllers do exactly three things:
1. Define the route and HTTP method
2. Validate/extract the request (via DTOs + `@Body()`, `@Param()`, `@Query()`)
3. Delegate to the service and return the result

No business logic in controllers. No direct DB calls in controllers.

```typescript
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFeature(@Param('id') id: string) {
    return this.featureService.getById(id);  // delegate — nothing else
  }
}
```

---

## Service Responsibilities

Services own all business logic and all database access.

```typescript
@Injectable()
export class FeatureService {
  constructor(private readonly postgres: PostgresService) {}

  async getById(id: string) {
    const result = await this.postgres.query(
      'SELECT * FROM feature_table WHERE id = $1',
      [id]
    );
    return result.rows[0] ?? null;
  }
}
```

**PostgresService is not TypeORM.** It wraps a raw `pg` Pool directly:
- Use `this.postgres.query(sql, params)` — always parameterised, never string-concatenated
- Returns `{ rows: T[] }` — access via `.rows`
- All calls must be `await`ed

**Important:** `codebase-context/references/stack-topology.md` lists `ORM: TypeORM` — this is
incorrect. The live `postgres.service.ts` imports `Pool` from `pg` and executes raw SQL
with parameterised queries. Do not introduce TypeORM entity patterns into this codebase.

---

## Auth Pattern

| Route type | Guard | How |
|---|---|---|
| Must be authenticated | `JwtAuthGuard` | `@UseGuards(JwtAuthGuard)` |
| Auth optional (enriches response if present) | `OptionalJwtAuthGuard` or manual cookie/header check | See `schools.controller.ts` for pattern |
| Public, no auth needed | No guard | Omit decorator |
| Admin only | `AdminAuthGuard` | `@UseGuards(AdminAuthGuard)` |

JWT is verified via Passport. Do not implement custom JWT verification in a service.

---

## Database Conventions

**Neon PostgreSQL (primary — all new features):**

| Table/View | Status | Notes |
|---|---|---|
| `stepper_form_data` | Active | Primary review submissions |
| `stepper_form_approval` | Active | 5 boolean approval flags |
| `schools` | Active | Core school data, includes pincode fields |
| `users` | Active | Auth + profile |
| `searches` | Active | `name` = search term (not teacher's name) |
| `pincode_lookup` | Active | **Materialized view** — not a regular table. Refreshed on schedule. Fallback for location resolution after `schools` table lookup. |
| `FormReview` | Legacy | `ENABLE_FORM_REVIEW_FETCH=false` — do not reference |

**Cloudflare D1 (existing usage only):**
- `teacher_counts` table — used by NestJS `teacher-counts` module via `D1Service`
- This is existing, legitimate architecture — the module reads D1 intentionally
- **Do not create new D1 tables or extend D1 usage to new modules**
- Modifying existing teacher-counts D1 queries is acceptable
- Note: `codebase-context/references/stack-topology.md` says "CF Workers only (legacy)"
  for D1 — this predates the NestJS teacher-counts module and is incorrect for that module.

---

## Frontend Architecture

**Router:** Next.js Pages Router (not App Router). All pages in `pages/`.

**Data fetching pattern:**
```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl = getApiBaseUrl();  // always — never hardcode
  const res = await fetch(`${baseUrl}/schools/${slug}`);
  // ...
  return { props: { data } };
};
```

**Known exception:** `pages/school/[slug].tsx` uses `NEXT_PUBLIC_API_BASE_URL` directly
in `getServerSideProps` — this is a known inconsistency, not the correct pattern.
Do not replicate it.

**Redux:** Global state in `store/slices/`. Use `createSlice` from `@reduxjs/toolkit`.
Component-local UI state (open/closed, hover) can stay in `useState`.

---

## Scalability Principles

When reviewing architecture decisions, apply these:

1. **One source of truth** — if the same data is read from two places, it will
   eventually diverge. Pick one canonical source.
2. **Fail loudly in development, gracefully in production** — errors in dev should
   throw and surface clearly; in production, fail gracefully with a logged error
   and a safe fallback.
3. **Stateless services** — services should not hold state between requests.
   All persistent state lives in the database or the request context.
4. **Debuggability first** — prefer the approach that produces clearer error messages
   and easier log tracing. Elegant abstractions that hide errors are anti-patterns.
5. **Simplicity over cleverness** — the next developer reading this code may be
   under pressure at 11pm. Write for that person.
6. **Module boundaries** — a module's service should not import another module's
   service directly unless through a proper NestJS module dependency declaration.
   Circular imports are a design smell, not a clever pattern.

---

## Architecture Decision Records (ADRs)

### What requires an ADR

Write an ADR before implementing any of the following:

- Adding a new external dependency (npm package, third-party API, new cloud service)
- Changing the database schema in a way that affects multiple modules
- Introducing a new authentication or authorisation pattern
- Changing API contracts (endpoints, request/response shapes) that affect the frontend
- Adding a new NestJS module that crosses existing module boundaries
- Any change to proxy config, ports, environment variables, or routing logic
- Switching from one technology to another (e.g., adding caching, message queue)

### What does NOT require an ADR

- Adding a new endpoint within an existing module
- Adding a new field to an existing DTO
- Bug fixes that do not change architecture
- Refactoring within a single module with no interface changes

### ADR format

```markdown
# ADR-[number]: [Short title]

**Date:** [YYYY-MM-DD]
**Status:** [Proposed / Accepted / Superseded]
**Decider:** Nikhil Nadiger

## Context
[What is the problem or situation that requires a decision?]

## Decision
[What was decided?]

## Options considered
[List alternatives with brief pros/cons for each]

## Consequences
[What does this decision enable? What does it make harder?]

## Risks
[What could go wrong? How would we detect it?]
```

### ADR location

Store in `docs/adr/` in the staffroom-v2 repo.

**This directory does not yet exist.** Create it on the first ADR:
```bash
mkdir -p docs/adr
touch docs/adr/.gitkeep
git add docs/adr/.gitkeep
```
