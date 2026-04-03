---
name: codebase-context
version: 1.0
description: >
  Load for any staffroom engineering task: fixing bugs, implementing features,
  understanding the codebase, deployment questions, database queries,
  or infrastructure questions. Triggers: 'fix this bug', 'implement feature',
  'how is the backend set up', 'deploy to', 'which file handles', 'how does X
  work in the codebase', 'database schema', 'add an endpoint', 'what port does',
  'how do I run'. Not for code review or architecture decisions (use
  engineering-review), content strategy, visual assets, or brand decisions.

triggers:
  - "fix this bug"
  - "implement feature"
  - "how is the backend set up"
  - "deploy to"
  - "which file handles"
  - "how does this work in the codebase"
  - "database schema"
  - "add an endpoint"
  - "what port does"
  - "codebase"
  - "backend"
  - "NestJS"
  - "Next.js"
  - "production server"
  - "UAT"
  - "PM2"

uses_references:
  - references/stack-topology.md
  - references/deployment-guide.md

related_skills:
  - engineering-review
  - product-context
  - product-design
---

# codebase-context

## Purpose

Provides full technical context for the staffroom codebase — stack topology,
environment specifics, legacy system details, and deployment workflow. Load
this for any engineering task.

## When to Load This Skill

- Fixing a bug in the frontend or backend
- Implementing a new feature or endpoint
- Understanding how a part of the codebase works
- Deployment, CI/CD, or environment questions
- Database schema or query questions
- Infrastructure or hosting questions

## When NOT to Load This Skill

- Code review or PR review → use engineering-review
- Architecture decisions or ADRs → use engineering-review
- Understanding product features or data flows → use product-context
- UI/UX design decisions → use product-design
- Content strategy or script writing → use content-strategy
- Visual asset creation → use visual-asset-creation
- Brand voice review → use brand-custodian

## Safety Rules — Non-Negotiable

These rules are also in CLAUDE.md. They are repeated here because violating
them causes real harm to the codebase and production system.

1. **New features go into `backend-nest/` only.** Do NOT touch `backend-deprecated/`
   — it is the old CF Worker, still deployed and receiving legacy traffic.
2. **Do NOT add any code that calls the legacy CF workers** — not the
   school-review worker, not api.thestaffroom.in. Zero calls. Ever.
3. **`PROJECT_REFERENCE.md` in the repo is outdated** — it describes the old
   dual-CF-Worker architecture. Ignore it entirely.
4. **Never hardcode `/api/...` paths** for server-side calls. Always use
   `getApiBaseUrl()` from `lib/api-base.ts`. The catch-all proxy at
   `pages/api/[...path].ts` is only active on localhost and UAT — not production.
5. **After completing local changes, run `pnpm build` and `pnpm lint`** — in BOTH
   repo root AND `/backend-nest`. Fix all errors and re-run until both pass. Stop
   and report ready — do NOT push to UAT until Nikhil explicitly asks.
6. **Avoid edits to proxy config, ports, environment variables, or routing
   logic** unless there is no other way. If unavoidable, ask Nikhil for explicit
   approval with risks and mitigation stated.
7. **Before pushing to UAT when asked:** run `git status` to confirm working tree
   is clean and all changes are committed. If uncommitted changes exist, commit
   them first (`git add <specific files>` + `git commit`). Then run
   `git push origin uat` — never `git push origin main:uat` or other refspecs.

## Code Investigation Rule

When investigating a bug or issue: go through the workflow one step at a time,
confirming inputs and outputs are working as expected at each step before
moving to the next. Do not jump to fixes before confirming the diagnosis.

## Reference Files

- **`references/stack-topology.md`** — read for any question about stack
  versions, ports, hosting, databases, nginx, PM2, or legacy workers
- **`references/deployment-guide.md`** — read for deployment workflow, CI/CD,
  UAT vs production environment details, and URLs
