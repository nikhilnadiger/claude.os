---
skills: [codebase-context]
last_updated: Mar 2026
source: Nikhil's deployment workflow
---

# Deployment Guide

---

## Nikhil's Workflow (Primary)

```
Local changes (via Claude Code)
  → Push to UAT branch on GitHub
    → CI/CD auto-deploys to UAT server
      → Test at uat.thestaffroom.in
        → Merge to main branch
          → CI/CD auto-deploys to production
            → Live at thestaffroom.in
```

**Before pushing to any branch:**
1. Run `pnpm build` in repo root — must succeed with 0 errors
2. Run `pnpm lint` in repo root — must succeed with 0 errors
3. Run `pnpm build` in `/backend-nest` — must succeed with 0 errors
4. Run `pnpm lint` in `/backend-nest` — must succeed with 0 errors

Never push a failing build or lint. Fix all errors first.

---

## Developer Workflow (Krishnan / Nilangshu)

Unknown — confirm with them before advising on deployment steps. Do not
assume they follow the same workflow as Nikhil.

---

## Environment URLs

| Environment | Frontend | Backend API |
|---|---|---|
| Production | thestaffroom.in | api-prod.thestaffroom.in |
| UAT | uat.thestaffroom.in | uat-api.thestaffroom.in |
| Localhost | localhost:3000 | via catch-all proxy /api/[...path] |

---

## Environment Variables

| Variable | Environment | Value / Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Production build | `https://api-prod.thestaffroom.in` |
| `INTERNAL_BACKEND_URL` | Localhost / UAT | Points to local or UAT NestJS instance |

`NEXT_PUBLIC_API_BASE_URL` is baked into the Next.js build at build time.
Changing it requires a full rebuild and redeploy.

---

## Key Constraints

- **Do not edit proxy config, ports, environment variables, or routing logic**
  without explicit approval from Nikhil. State the change, the risk, and the
  mitigation before proceeding.
- **The catch-all proxy (`pages/api/[...path].ts`)** is only active on
  localhost and UAT. It is NOT in production. Server-side code must use
  `getApiBaseUrl()` — never hardcoded paths.
