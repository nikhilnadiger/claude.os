# staffroom — Claude Working Memory

> Last updated: 28-03-2026
> Maintained by: Nikhil Nadiger

---

## Who I Am

Nikhil Nadiger — co-founder, staffroom. I make all product, engineering, content, finance and strategy decisions. My working style: direct, evidence-based, no fluff. I prefer Claude to be brief, honest, precise and not a yes-man. I prefer Claude to ask questions to seek clarity instead of assuming and where relevant state assumptions before providing response.

---

## staffroom — 30-Second Context

India's first teacher-powered platform for real insights into school workplaces.

Teachers leave experiences of schools (salary, culture, management, ease of working, facilities etc). Schools earn trust through verified teacher feedback and attract top talent i.e., teachers.

Think: Glassdoor with Tripadvisor positioning. Functionally it is Glassdoor (workplace reviews, specific to schools) but the brand positioning is Tripadvisor — positive, discovery-oriented. Teachers visit to find great workplaces, not to rant. Schools partner to build reputation and attract top teachers. Both sides should want to be on it.

Stage: Early-stage, bootstrapped. ₹30 per sign up on Meta Ads.
Community: 12k+ (WhatsApp + Instagram + YouTube). Sign-ups: 2,905 (as of Mar 2026).
Reviews: 635 submitted across 555 unique schools. Only 15 schools have 3+ reviews — the PMF threshold. 255 reviews are fully complete. 133 districts covered. Bengaluru is the leading district by volume.
Revenue model: a work in progress — active pilots with education businesses and schools.

---

## Tech Stack

Frontend: Next.js 16, React 19, Tailwind v4, Redux Toolkit
Backend: NestJS 11 (TypeORM, Passport/JWT, pg) — runs on DO production droplet (strm-app-prd) as PM2 process under stfrmuser1. Port 9000. In production, accessed via api-prod.thestaffroom.in (nginx). On localhost/UAT, accessed via Next.js catch-all proxy at /api/[...path] → INTERNAL_BACKEND_URL.
Backend (Legacy — still deployed, NOT used by current app): Two Cloudflare Workers still live but no longer called by the active codebase:
  - school-review worker (school-review.thestaffroom2024.workers.dev): original legacy backend from separate repo (school-reviewer-forked). ~59 req/24h likely from its own internal cron jobs. 1k subrequests/24h all returning 4xx — its cron calls a dead Azure endpoint (orailap.azurewebsites.net). Zero references to this worker in the current frontend, NestJS, or any active code. Safe to disable. Do NOT add new code that calls this worker.
  - backend worker (api.thestaffroom.in): ~28 req/24h from unknown sources (old cached clients or crawlers), NOT from the main app. Corresponds to backend-deprecated/ in repo. Do NOT add new code that calls this worker.
Hosting: Digital Ocean Droplets — production (strm-app-prd, BLR1): Next.js :3000 + NestJS :9000, managed by PM2 under stfrmuser1. UAT (ubuntu-s-1vcpu-2gb-blr1-01, BLR1): Next.js :5000 + NestJS :7000, exposed at uat-api.thestaffroom.in via nginx.
nginx (production): thestaffroom.in → :3000 (Next.js), api-prod.thestaffroom.in → :9000 (NestJS)
Database: Neon PostgreSQL (primary, used by NestJS) + Cloudflare D1 (secondary, used by CF Workers)

Key rules:
- New features go into backend-nest. Do not touch backend-deprecated/ — it is the old CF Worker, replaced by NestJS, but still deployed and receiving legacy traffic.
- PROJECT_REFERENCE.md in the repo is outdated — it describes an old dual-CF-Worker architecture that no longer applies. Ignore it.
- Production client-side API routing: NEXT_PUBLIC_API_BASE_URL=https://api-prod.thestaffroom.in (NestJS). This is baked into the Next.js build at build time.
- The catch-all proxy at pages/api/[...path].ts (INTERNAL_BACKEND_URL) is only active on localhost and UAT — not in production. Never use hardcoded /api/... paths for server-side calls; always use getApiBaseUrl() from lib/api-base.ts.

Repo: /mnt/GitHub/staffroom-v2

---

## Deployment Process

Nikhil's workflow: code changes made locally via Claude Code → pushed to UAT branch on GitHub → CI/CD pipeline auto-deploys to UAT server → tested at uat.thestaffroom.in → merged to main branch → CI/CD pipeline auto-deploys to production → live at thestaffroom.in.

Developer's (Krishnan/Nilangshu) workflow: unknown — confirm with them before advising on deployment steps.

---

## Code Quality Rules

BEFORE creating any PR, always run both of the following in sequence.
Run in BOTH repo root AND /backend-nest:

1. pnpm build       # must succeed with 0 errors
2. pnpm lint        # must succeed with 0 errors

If either fails: fix all errors before pushing. Never push a failing build. If errors are complex, flag them to me — do not silently skip.

WHEN planning for code fixes or improvements:
1. Avoid edits to proxy list, config, ports, environment variables, routing logic etc.
2. Consider and avoid risks to existing workflow, product functionality and efficiency.

If no other way to fix the issue or build the feature, explicitly ask me for approval along with potential risks and mitigation.

WHEN investigating a bug or issue, go through the workflow one step at a time to confirm inputs and outputs are working as expected.

---

## Product Insights (Clarity — last 30 days)

Traffic: 2,351 sessions, 1,682 users. Avg session: 2.87 pages, 138s. Bounce rate: 56%.

Device: 90% mobile (2,122), 9% desktop (220), 1% tablet. Every UI/UX decision must be mobile-first.

Geography: Bengaluru 44% (1,030 sessions), then Mumbai (172), Chennai (109), Pune (108), Delhi (107), Hyderabad (99), Kolkata (88). All India. Bengaluru is the natural first city to saturate.

Key funnel: Homepage → Login → /home → Share Experience. Login is the second-biggest exit page (606 exits) — significant drop-off there.

School pages: Only 20–37 sessions each. Discovery/search is the bottleneck, not school page quality.

UX friction: 18.8% of sessions have dead clicks (443/2,351) — users tapping things that aren't interactive. Primarily a mobile issue.

Channel attribution: Only 394/2,351 sessions have UTM data (Direct 222, Organic 131, Social 41). ~1,957 sessions are untracked — almost certainly Instagram Ads traffic without UTMs.

Note: Clarity is installed on staging and UAT too — ~100 sessions in the data are from non-production environments and slightly inflate numbers.

---

## Current Priorities

1. Saturate 1-2 cities in India with >70% searches leading user to school with at least 3 experiences

GTM strategy is city-by-city. Full PMF definition: ≥70% searches yield ≥3 reviews in 7 cities (top 7 by private school teacher density). 1-2 cities is the current step toward that goal.

Current baseline (Mar 2026): 15 schools nationwide have 3+ reviews. 1,408 total searches logged, 108 users searched 3+ times. The gap to the goal is large — the bottleneck is review volume per school, not number of schools covered.

---

## Active Features / Projects

---

## Key People

- Nikhil Nadiger: co-founder, all decisions
- Nilangshu: engineering consultant
- Krishnan: developer working under Nilangshu

---

## Communication Defaults

- Be brief. No preamble. No summaries unless asked.
- Be honest — push back if something is wrong.
- When in doubt about scope or unable to complete a task, ask one clear question.
- Never add features or scope not explicitly requested.
- For code: always show what changed and why.

---

## Assets & References

Brand assets (logos, templates, social media, ratings UI) are in: assets/
URL references (Google Docs, Figma, social channels, content scripts) are in: references.md

---

## Tool Access Notes

Chrome (Claude in Chrome): Before attempting any browser automation, always ask Nikhil to open Chrome in the nikhilnadiger@gmail.com profile first. Do not attempt to connect until confirmed.

---

## Always Remember

- staffroom is always written lowercase. Never 'StaffRoom' or 'Staffroom'.
- This is a bootstrap company. Zero/low cost solutions are preferred.
- Target users: Indian teachers in private schools and their school principals and owners.
- Do not make claims that are not verified by data.
- LinkedIn: Nikhil has a personal LinkedIn (active, with a configured skill for posting). staffroom has a LinkedIn page that is not currently used.
- Content: Instagram and YouTube content is paused as of now.
- Pitch deck (Feb 2026) is in assets/pitch-deck-feb-2026.pptx. Note: content may be outdated.
     