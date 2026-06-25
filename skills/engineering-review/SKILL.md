---
name: engineering-review
version: 1.0
description: >
  Use for code review, PR review, architecture decisions, and engineering
  best practice questions. Triggers: 'review this PR', 'code review', 'is
  this the right approach', 'should I structure this as', 'architecture
  decision', 'engineering best practice', 'ADR', 'is this pattern correct',
  'review this code'. Routes to code-review-checklist.md for PR/code review
  tasks and architecture-patterns.md for architecture and design decisions.
  Not for building or fixing code (use codebase-context) or product design
  decisions (use product-context + product-design).

triggers:
  - "review this PR"
  - "code review"
  - "is this the right approach"
  - "should I structure"
  - "architecture decision"
  - "engineering best practice"
  - "ADR"
  - "is this pattern correct"
  - "review this code"
  - "comprehensive review"
  - "audit the product"
  - "full product review"
  - "engineering review"
  - "review production"
  - "product audit"

uses_references:
  - references/code-review-checklist.md
  - references/architecture-patterns.md

related_skills:
  - codebase-context
  - product-context
  - product-design
---

# engineering-review

## Purpose

Reviews code, PRs, and architecture decisions against staffroom's codebase
standards, safety rules, and scalability principles. The companion to
codebase-context — use codebase-context to build; use engineering-review
to evaluate what was built or to decide how to structure something.

## When to Load This Skill

- Reviewing a PR before merge
- Code review of a specific change or diff
- Deciding the right architecture for a new feature
- Evaluating whether an approach is correct or safe
- Creating an Architecture Decision Record (ADR)
- Checking engineering best practices for NestJS, Next.js, or the staffroom stack

## When NOT to Load This Skill

- Building or fixing code → use codebase-context
- Understanding product features or data flows → use product-context
- UI/UX design decisions → use product-design
- General deployment or stack questions → use codebase-context

## Safety Rules — Non-Negotiable

These rules are also in CLAUDE.md. Repeated here because violating them in
a PR or architecture decision causes real, hard-to-reverse harm.

1. **Do NOT add any code that calls the legacy CF workers** — not the
   school-review worker, not api.thestaffroom.in. Zero calls. Ever.
2. **New features go into `backend-nest/` only.** Do NOT touch
   `backend-deprecated/` — it is still deployed and receiving legacy traffic.
3. **Never hardcode `/api/...` paths** for server-side calls. Always use
   `getApiBaseUrl()` from `lib/api-base.ts`.
4. **Before any PR — mandatory sequence for frontend/UI changes:**
   a. **UX constraint validator first:** `node claude.os/skills/ux-constraint-validator/validate.js http://localhost:3000`. Zero `[FAIL]` items required. `[WARN]` items must be assessed and either fixed or explicitly documented as acceptable.
   b. **Then `pnpm build` and `pnpm lint`** in BOTH repo root AND `/backend-nest`. Both must pass with 0 errors. Non-negotiable.
   For backend-only PRs with no UI changes, skip (a).
5. **`PROJECT_REFERENCE.md` is outdated** — describes the old dual-CF-Worker
   architecture. Ignore entirely.
6. **Avoid edits to proxy config, ports, environment variables, or routing
   logic** without explicit approval from Nikhil. If unavoidable, state the
   change, the risk, and the mitigation before proceeding.

## Routing

| Task | Reference file |
|---|---|
| PR review or code review | `references/code-review-checklist.md` |
| Architecture decision or ADR | `references/architecture-patterns.md` |
| Both apply | Read both files |
| Comprehensive product/engineering audit | Read both reference files + load `product-context` skill + load `product-design` skill + load `knowledge/staffroom-ux-constraints.md` |

## Workflow

1. Determine task type using the routing table above
2. Load the relevant reference file(s)
3. Apply checks systematically — start with safety rules (blocking), then
   patterns, then pre-PR checklist
4. For architecture decisions that meet the ADR threshold (see
   architecture-patterns.md), produce a structured ADR before approving
   the approach
5. State findings clearly: what passes, what fails, what needs change

**In audit mode (comprehensive product/engineering review):**
- Every issue surfaced must be verified against production code or live
  Clarity/Neon/Cloudflare data before being included in the plan. Do not
  assert that a feature is missing or present — confirm it from the source.
- Apply the full Planning Protocol from `CLAUDE.md` before presenting the plan:
  cross-impact analysis, dependency identification, manual intervention flags,
  and root-cause vs. symptom check on every item.
