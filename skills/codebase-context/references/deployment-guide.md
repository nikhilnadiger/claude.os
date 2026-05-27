---
skills: [codebase-context]
last_updated: May 2026
source: live codebase — deployment/deploy-prod.sh, deployment/deploy-uat.sh, ecosystem.production.config.cjs, ecosystem.uat.config.cjs, .github/workflows/deploy-prod.yml (verified May 2026)
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

### Risk: local backend connects to production databases

`backend-nest/.env` points to production Neon PostgreSQL and production Cloudflare D1. There is no local or staging DB.

| Action | Risk |
|---|---|
| Viewing school pages | Read-only — zero risk |
| Logging in with bypass phone | Creates/updates user record for `7592090926` in production PG — low risk, manually deletable |
| Submitting a review | Writes a real review to production PG — delete manually after testing |

---

## How Production Deploy Works

Understanding this architecture is required when debugging deploy failures.

### Server and user layout

- **Production droplet:** deploy user is `stfrmuser1`. PM2 daemon runs as root. Repo path: `/home/stfrmuser1/staffroom/staffroom-v2`.
- **UAT droplet:** deploy user IS root. PM2 runs as root. No `stfrmuser1` exists. Repo path: `/root/staffroom/staffroom-v2`.

### The chown problem and fix

Because PM2 runs as root on production, Node processes write files (`.next/cache`, `public/og/school/`) owned by root between deploys. On the next deploy, `stfrmuser1` cannot overwrite these root-owned files.

Fix: every production deploy runs `sudo chown -R stfrmuser1:stfrmuser1 .` as the first step, before `pnpm install` and `pnpm build`. This reclaims all root-owned files repo-wide. It is idempotent and safe even if PM2 is mid-write. Authorised via `/etc/sudoers.d/90-stfrmuser1-pm2`.

UAT does not have this problem — deploy user is root, so no chown is needed.

### PM2 management

- **Production:** `stfrmuser1` must use `sudo pm2` because PM2 belongs to root.
- **UAT:** use `pm2` (no sudo) — deploy user is root.

PM2 strategy is `delete + start`, not `restart`. Each deploy runs:
```bash
pm2 delete <name> || true
pm2 start ecosystem.config.cjs --only <name>
```
This ensures the new ecosystem config is always loaded cleanly. Using `restart` would not pick up ecosystem config changes.

### INTERNAL_BACKEND_URL

`INTERNAL_BACKEND_URL` is hardcoded in the PM2 ecosystem configs — not only in `.env`. The ecosystem config value takes precedence over `.env`.

- Production ecosystem: `http://localhost:9000`
- UAT ecosystem: `http://localhost:7000`

All SSR calls from the Next.js frontend use this value. This is why `getApiBaseUrl()` is required on the server side — it reads `INTERNAL_BACKEND_URL` correctly in the PM2 environment. Never hardcode `/api/...` paths in server-side code.

### GIT_COMMIT_SHA and deterministic BUILD_ID

`next.config.ts` reads `GIT_COMMIT_SHA` in `generateBuildId`. Both deploy scripts export this from `git rev-parse HEAD` before the build runs.

Without `GIT_COMMIT_SHA`, BUILD_ID falls back to `build-${Date.now()}` — non-deterministic, which breaks post-deploy verification (the CI health check cannot know what to match against).

### Fail-fast guard on empty BUILD_ID

Both deploy scripts check `[ ! -s .next/BUILD_ID ]` immediately after build. If the file is missing or empty, the script aborts. This catches silent build corruption before PM2 is restarted.

### Post-deploy verification (CI)

After deploy, GitHub Actions runs a verification loop:
- Polls `https://www.thestaffroom.in/?_cb=${timestamp}` for `buildId` matching the commit SHA.
- Polls `https://api-prod.thestaffroom.in/api/admin/health` for HTTP 200.
- 5 attempts × 12 second intervals. Fails the workflow if both do not pass.

This was added after the 24 May 2026 incident where CI reported success but the old build was still live. If this check fails, the old process did not exit cleanly — inspect PM2 logs and the `delete + start` output.

### Nudge template env vars

Both `deploy-prod.sh` and `deploy-uat.sh` inject the following into `.env` at deploy time:

| Variable | Value |
|---|---|
| `WHATSAPP_INITIATION_NUDGE_042026_TEMPLATE` | `initiation_nudge_042026` |
| `WHATSAPP_RATINGS1_NUDGE_042026_TEMPLATE` | `ratings1_nudge_042026` |
| `WHATSAPP_SALARY_NUDGE_042026_TEMPLATE` | `salary_nudge_042026` |
| `WHATSAPP_COMPLETION_NUDGE_042026_TEMPLATE` | `completion_nudge_042026` |
| `NUDGE_ABANDONMENT_ENABLED` | `false` |
| `NUDGE_UPDATE_IS_LIVE_ENABLED` | `false` |
| `NUDGE_INITIATION_NUDGE_042026_ENABLED` | `true` |
| `NUDGE_RATINGS1_NUDGE_042026_ENABLED` | `true` |
| `NUDGE_SALARY_NUDGE_042026_ENABLED` | `true` |
| `NUDGE_COMPLETION_NUDGE_042026_ENABLED` | `true` |

These are injected by the deploy scripts — do not assume they come from a static `.env` file checked into the repo.

---

## Nikhil's Workflow (Primary)

```
Local changes (via Claude Code)
  → Run pnpm build + pnpm lint (automatic, after every local implementation)
    → Fix all errors and re-run until both pass
      → Stop and report "ready for UAT"   ← CLAUDE CODE STOPS HERE
        → Push to UAT branch on GitHub (only when Nikhil explicitly asks)
          → CI/CD auto-deploys to UAT server
            → Nikhil tests at uat.thestaffroom.in
              → Nikhil merges to main (manually, on GitHub)
                → CI/CD auto-deploys to production
                  → Live at thestaffroom.in
```

**After completing local changes:**
1. Run `pnpm build` in repo root — fix all errors, re-run until 0 errors
2. Run `pnpm lint` in repo root — fix all errors, re-run until 0 errors
3. Run `pnpm build` in `/backend-nest` — fix all errors, re-run until 0 errors
4. Run `pnpm lint` in `/backend-nest` — fix all errors, re-run until 0 errors

When all four pass, stop and report ready. Do NOT push to UAT.

**Ready report — required format when reporting to Nikhil:**

**Fidelity A — tested by Claude Code, result reliable:**
List what was tested and passed (build, lint, grep checks, API responses, DB queries, SSR, Redux state, network requests).

**Fidelity B — proxy used, limitation declared:**
List each proxy test, what it covered, and what it did not cover. Example: "Tested at 360px in Chrome DevTools — covers viewport width, does not replicate WebView keyboard behavior."

**Fidelity C — cannot test, requires Nikhil's manual verification before UAT push:**
List each item with exactly what to check and how. If this section is non-empty, state it prominently so Nikhil can verify before deciding to push.

**Claude Code's role ends at reporting clean build/lint. Nothing beyond that.**

- Do NOT push to UAT unless Nikhil explicitly asks
- Do NOT run `gh pr create` — not to main, not to any branch, unless Nikhil explicitly asks
- Do NOT open, draft, or suggest a PR targeting `main`
- Do NOT merge branches
- Nikhil handles UAT testing and the merge to main himself

**When Nikhil asks to push to UAT — execute in this exact order:**
1. Run `git status` — working tree must be clean. If uncommitted changes exist, stop and commit them first:
   ```bash
   git add <specific files>   # never git add -A or git add .
   git commit -m "descriptive message"
   ```
2. Run `git log --oneline -3` — confirm the latest commit contains the expected changes
3. Only then run `git push origin uat` — nothing else
4. Never use refspecs like `git push origin main:uat` — only `git push origin uat`

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
| `NEXT_PUBLIC_API_BASE_URL` | Production build | `https://api-prod.thestaffroom.in` — baked in at build time, changing requires full rebuild |
| `INTERNAL_BACKEND_URL` | Production (PM2 ecosystem) | `http://localhost:9000` — hardcoded in `ecosystem.production.config.cjs`, takes precedence over `.env` |
| `INTERNAL_BACKEND_URL` | UAT (PM2 ecosystem) | `http://localhost:7000` — hardcoded in `ecosystem.uat.config.cjs`, takes precedence over `.env` |
| `INTERNAL_BACKEND_URL` | Localhost | `http://localhost:8788` — set in root `.env` |
| `GIT_COMMIT_SHA` | Production + UAT deploy | Exported from `git rev-parse HEAD` by deploy scripts. Read by `next.config.ts` `generateBuildId`. Required for deterministic BUILD_ID and post-deploy verification. |
| Nudge template vars | Production + UAT deploy | Injected by deploy scripts — see nudge template table in "How Production Deploy Works" above |

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
- **`INTERNAL_BACKEND_URL` in the PM2 ecosystem config overrides `.env`.** Do not assume `.env` is the authoritative source for this variable on prod or UAT.
- **PM2 on production requires `sudo pm2`.** Never run bare `pm2` commands as `stfrmuser1` on the production droplet — they will target the wrong daemon.
- **The `delete + start` PM2 strategy is intentional.** Do not replace it with `pm2 restart` or `pm2 reload` — those do not reload the ecosystem config and will silently run the old config.
- **`GIT_COMMIT_SHA` must be set before `next build`.** If it is not exported, BUILD_ID is non-deterministic and post-deploy verification will fail.
