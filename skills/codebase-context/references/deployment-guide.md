---
skills: [codebase-context]
last_updated: Mar 2026
source: Nikhil's deployment workflow
---

# Deployment Guide

---

## Local Development

### Starting the stack

Run both processes simultaneously in separate terminals:

```bash
# Terminal 1 — Frontend (Next.js)
pnpm dev
# Runs on localhost:3000

# Terminal 2 — Backend (NestJS)
cd backend-nest && pnpm start:dev
# Runs on localhost:8788
```

The catch-all proxy (`pages/api/[...path].ts`) reads `INTERNAL_BACKEND_URL=http://localhost:8788` from root `.env`. No config changes needed — routing works out of the box.

### OTP bypass for local login

A hardcoded bypass exists in `backend-nest/src/whatsapp/whatsapp.service.ts` (lines 195–224):

- **Phone:** `7592090926`
- **OTP:** `000000`

`verifyOtp` for this pair skips all D1 lookups and returns a valid JWT directly. No real WhatsApp message is needed — even if one is sent, it is never checked for this phone number.

### ⚠ Risk: local backend connects to production databases

`backend-nest/.env` points to production Neon PostgreSQL and production Cloudflare D1. There is no local or staging DB.

| Action | Risk |
|---|---|
| Viewing school pages | Read-only — zero risk |
| Logging in with bypass phone | Creates/updates user record for `7592090926` in production PG — low risk, manually deletable |
| Submitting a review | Writes a real review to production PG — delete manually after testing |

---

## Nikhil's Workflow (Primary)

```
Local changes (via Claude Code)
  → Push to UAT branch on GitHub   ← CLAUDE CODE STOPS HERE
    → CI/CD auto-deploys to UAT server
      → Nikhil tests at uat.thestaffroom.in
        → Nikhil merges to main (manually, on GitHub)
          → CI/CD auto-deploys to production
            → Live at thestaffroom.in
```

**Claude Code's role ends at `git push origin uat`. Nothing beyond that.**

- Do NOT run `gh pr create` — not to main, not to any branch, unless Nikhil explicitly asks
- Do NOT open, draft, or suggest a PR targeting `main`
- Do NOT merge branches
- Nikhil handles UAT testing and the merge to main himself

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
