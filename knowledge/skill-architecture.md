---
last_updated: Jul 2026 (17 Jul — see Known Inaccuracies additions below)
maintained_by: Nikhil Nadiger
purpose: >
  Structural standards for staffroom's claude.os skill ecosystem.
  Read this before creating any new skill, knowledge doc, or updating CLAUDE.md.
---

# staffroom — Skill Architecture

---

## The Three Content Layers

Every piece of content in claude.os belongs to one of three layers:

| Layer | File | Loaded | Contains |
|---|---|---|---|
| Always-on context | CLAUDE.md | Every session | Behavioral rules, safety trip-wires, compact orientation facts |
| On-demand tasks | skills/*/SKILL.md | When triggered | Task instructions, workflow, routing to reference files |
| On-demand data | knowledge/*.md + skills/*/references/*.md | When read | Performance data, templates, specs, research |

**The core rule: CLAUDE.md = rules + orientation. Never data.**

---

## What Goes Where

### CLAUDE.md — keep it lean

**Include:**
- Behavioral rules: how Claude must communicate (tone, ask before assuming,
  push back, never add scope)
- Safety trip-wires: rules whose violation causes product harm (legacy code,
  wrong API routes, build failures) — these must ALWAYS be in context
- Compact orientation: what staffroom is, target users, stage, current priorities
- Structural implications of data (e.g. "90% mobile → mobile-first") — not
  the raw numbers

**Do not include:**
- Metrics and counts that go stale (sign-ups, sessions, review counts) → knowledge docs
- Detailed tech stack topology (ports, PM2, nginx config) → codebase-context skill
- Deployment workflow details → codebase-context skill
- Task instructions → skills

### skills/ — task-specific instructions

Each skill maps to a **user intent**, not a content domain.

SKILL.md structure:
- YAML frontmatter: name, version, description (triggers), uses_references,
  related_skills, live_references
- Purpose: what the skill does and when NOT to use it
- Key Rules: non-negotiable rules, prominent at the top
- Workflow: step-by-step, referencing which files to read when
- Output format

### knowledge/ — distilled research and platform data

Platform-wide, multi-skill reference data. Loaded on demand — not always in context.

Current knowledge docs:
- staffroom-teacher-insights.md — user research findings
- staffroom-content-performance.md — YouTube, Instagram, Meta Ads data
- staffroom-product-metrics.md — platform counts, Clarity analytics
- staffroom-competitive-landscape.md — competitor analysis
- staffroom-ux-constraints.md — non-negotiable UX floors for all design/frontend work
- staffroom-user-journey.md — screen-by-screen user journey: all screens, user types, entry points, error states, system behaviors, known limitations. Verified from production codebase. Update workflow: trigger "update user journey" with product-context skill → follows product-context/references/user-journey-update.md
- refresh-protocol.md — step-by-step protocol for full claude.os refresh (analytics, metrics, content, schema, API). Excludes competitor landscape, LinkedIn, and user-journey (those have separate protocols).
- skill-architecture.md — this file

Skill reference docs (in skills/*/references/):
- product-context/references/neon-schema.md — Neon PostgreSQL schema: active tables, materialized views, enum types, legacy tables
- product-context/references/d1-schema.md — Cloudflare D1 schema: active tables, dual-database tables, cross-DB relationships
- product-context/references/data-flow.md — six primary product flows (search, review, auth, nudge, etc.)
- product-context/references/api-inventory.md — all NestJS API endpoints and contracts
- codebase-context/references/stack-topology.md — infra: frontend, NestJS, hosting, DB overview
- engineering-review/references/architecture-patterns.md — NestJS patterns, DB conventions, auth patterns
- visual-asset-creation/references/pptx-assets.md — PowerPoint path: python-pptx setup, all asset types, colour/font spec, export instructions
- (+ brand-custodian/references/, content-strategy/references/ — see those skills for routing)

---

## The 9-Skill Ecosystem

staffroom's claude.os has 9 skills across four clusters:

| Cluster | Skill | Primary intent |
|---|---|---|
| Brand | brand-custodian | Brand voice, rules, what staffroom sounds/looks like |
| Brand | visual-asset-creation | Create PowerPoint/Gemini visual assets |
| Brand | content-strategy | Plan and script content (YouTube, Instagram, WhatsApp) |
| Engineering | codebase-context | Implement or debug code in the staffroom codebase |
| Engineering | engineering-review | Review PRs, architecture decisions, ADRs |
| Product | product-context | Understand how features, flows, and APIs work |
| Product | product-design | UI/UX design decisions, screen design, critique |
| Strategy | advisory-councils | Expert council deliberation on strategic decisions |
| Marketing | meta-ad-creation | Run a Meta Ads campaign via 4-gate sequential process |

**related_skills must be bidirectional.** If skill A lists skill B in related_skills,
skill B must list skill A. Verify this on every new skill or update.

---

## Floor vs. Ceiling Model (Product Design)

The product-design skill uses a two-layer model that applies more broadly:

**Floor (non-negotiable):** `staffroom-ux-constraints.md` defines hard limits
derived from production data. These apply to every design and frontend task,
regardless of scope. Violating them is always wrong.

**Ceiling (aspirational):** `design-process.md` defines the full design workflow.
Use it when there is time for thorough design work.

Apply this model whenever "minimum viable" vs "ideal" is in tension: always
meet the floor unconditionally; reach for the ceiling when scope allows.

---

## File Length Thresholds

| File type | Target | Flag if above |
|---|---|---|
| SKILL.md | <200 lines | 300 lines |
| Reference file | <250 lines | 350 lines |
| Knowledge doc | No hard limit | Must be distilled, not raw data |
| Minimum file size | 40+ lines | Below this, overhead > benefit |

---

## When to Split vs. Navigate

**Split a reference file into sub-files when:**
- A single task uses <40% of the file's content
- The sub-files would each be >40 lines
- Tasks that use each sub-file are independent (user only needs one at a time)
- Path-based splits are better than type-based splits (3 creation-path files
  beats 9 asset-type files)

**Add explicit navigation instead of splitting when:**
- Tasks are sequential (you'd load all sub-files anyway)
- The file covers multiple output types with shared rules
- Sub-files would be <40 lines each
- Pattern: update SKILL.md workflow to specify "navigate to section X" with
  a section index listed

**Never split:**
- SKILL.md itself — it is the routing layer
- Files where all tasks need all the content

---

## Routing Pattern

SKILL.md is the routing layer only — rules + workflow + pointers. Reference
files carry the detail.

Standard pattern:
```
skills/skill-name/
├── SKILL.md          — routing + non-negotiable rules (target <200 lines)
└── references/
    ├── domain-a.md   — loaded only for domain-a tasks
    ├── domain-b.md   — loaded only for domain-b tasks
    └── domain-c.md   — loaded only for domain-c tasks
```

SKILL.md decision table maps task type → which reference file to read.
Claude reads only the relevant reference file, not all of them.

---

## Safety Trip-Wire Rule

Any rule whose violation could cause product harm must appear in **two places**:

1. In the relevant skill's SKILL.md — prominently, near the top of Key Rules
2. In CLAUDE.md — as a one-line trip-wire, always in context

Examples of safety trip-wires:
- Do not call legacy CF workers (codebase-context + CLAUDE.md)
- Always use getApiBaseUrl(), never hardcode /api/ paths (codebase-context + CLAUDE.md)
- Always read visual-identity.md before any brand colour usage (visual-asset-creation + brand-custodian)
- pnpm build + lint must pass before any PR (codebase-context + CLAUDE.md)

---

## File Governance

### Staleness Detection

All reference files and knowledge docs should carry:
- `last_updated` in YAML frontmatter (month + year)
- `staleness_note` for files with data that expires (metrics, analytics, performance data)

A file without a `last_updated` date should be treated as potentially stale.

### Update Triggers

| Event | Files to update |
|---|---|
| New analytics data (Clarity, Neon) | staffroom-product-metrics.md, staffroom-ux-constraints.md — see refresh-protocol.md for full procedure |
| New content published | staffroom-content-performance.md — see refresh-protocol.md |
| Codebase architecture change | stack-topology.md, deployment-guide.md, api-inventory.md, d1-schema.md — see refresh-protocol.md |
| Codebase behavior change (new screen, flow change, error change, feature removed) | staffroom-user-journey.md — trigger "update user journey" with product-context skill (separate from refresh-protocol) |
| New competitor action | staffroom-competitive-landscape.md — trigger separately, NOT part of refresh-protocol |
| New teacher research | staffroom-teacher-insights.md |
| New skill created | CLAUDE.md (Assets & References), skill-architecture.md (ecosystem table) |
| Full claude.os refresh needed | Follow refresh-protocol.md — covers analytics, metrics, content, schema, API. Excludes competitor landscape, LinkedIn, user-journey. |

### Update Proposal Process

When a file needs updating:
1. State which file, which section, and what the correct value is.
2. Confirm the source (e.g. "Clarity dashboard, Mar 2026").
3. Make only the targeted change — do not rewrite surrounding sections.
4. Update `last_updated` in frontmatter.

### Known Inaccuracies (Track Here)

Files with documented inaccuracies that have been corrected in the live
skill system but may still appear in other locations:

| File | Inaccuracy | Correct value | Status |
|---|---|---|---|
| codebase-context/references/stack-topology.md | ORM listed as TypeORM | DB client is raw `pg` Pool with parameterised SQL — NOT TypeORM | Fixed in Task 4 |
| codebase-context/references/stack-topology.md | D1 listed as "CF Workers only (legacy)" | D1 used by multiple NestJS modules (teacher-counts, nudges, tracking, places, short-form, admin) | Fixed in Task 5 |
| engineering-review/references/architecture-patterns.md | PostgresService shown returning `result.rows[0]` | Service unwraps to `T[]`; correct pattern is `rows[0]` not `result.rows[0]` | Fixed in Task 5 |
| engineering-review/references/architecture-patterns.md | D1 described as teacher_counts only | D1 used by 10+ NestJS modules — see db-schema.md | Fixed in Task 5 |
| engineering-review/references/code-review-checklist.md | PostgresService returns `{ rows: T[] }` — access via `.rows` | Returns `T[]` directly; correct pattern is `rows[0]` not `result.rows[0]` | Fixed in Task 6 |
| engineering-review/references/code-review-checklist.md | Stale annotation saying stack-topology.md still lists TypeORM | stack-topology.md was already corrected; annotation removed | Fixed in Task 6 |
| engineering-review/references/code-review-checklist.md | D1 described as teacher_counts module only; "no new modules should touch D1" | D1 used by 10+ NestJS modules — updated to reflect actual architecture | Fixed in Task 6 |
| knowledge/staffroom-product-metrics.md | Query guidance used wrong table names: `reviews` and `users` | Correct tables: `stepper_form_data` (reviews), `"User"` (sign-ups, PascalCase + quoted) | Fixed in Task 6 |
| CLAUDE.md | Duplicate Chrome instruction in "Tool Access Notes" section | Already covered in MCP Tool Safety Rules section — Tool Access Notes section removed | Fixed in Task 6 |
| visual-asset-creation/SKILL.md | Figma MCP paths (two-step and standalone) documented as active creation paths | Figma MCP is read-only — all asset creation routes to PowerPoint (python-pptx). SKILL.md updated to v1.3. | Fixed in Task 7 |
| visual-asset-creation/references/gemini-assets.md | "3–5 words max in Gemini / add longer text via Figma MCP" | Illustration-only mode for PPTX two-step; Gemini standalone is valid final path when no text needed | Fixed in Task 7 |
| visual-asset-creation/references/asset-creation-guide.md | All Figma MCP entries in creation path table | Replaced with PowerPoint path entries; PowerPoint section added | Fixed in Task 7 |
| visual-asset-creation/references/figma-assets.md | File presented as active Figma MCP creation workflow | Figma MCP is read-only — file repurposed as layout spec reference; all creation redirects to pptx-assets.md | Fixed in Task 7 |
| visual-asset-creation/references/real-image-assets.md | "Use Figma MCP to place image in branded layout" | Replaced with "Build a PPTX with image as full-bleed background" | Fixed in Task 7 |
| CLAUDE.md | Figma MCP described as "read access only — do not write without approval" | Clarified: Figma MCP is read-only entirely; no creation possible; asset creation uses pptx-assets.md | Fixed in Task 7 |
| product-design/references/component-standards.md | Colour Application section listed non-existent colours (Staffroom Orange #FF5A1F, Light Sand #FFF8F3, Deep Charcoal #1A1A1A, Warm Grey #6B6B6B) contradicting visual-identity.md | Replaced with correct brand palette (#043630, #004D43, #E6D7B6, #F1FEF8, #D0FF71) and semantic UI colours from visual-identity.md | Fixed in Task 8 |
| engineering-review/references/code-review-checklist.md | `users` listed as active Neon table for auth + profile | Active Neon auth table is `"User"` (PascalCase, quoted, Prisma-originated). `users` is a D1 table (legacy phone store). | Fixed in Task 8 |
| content-strategy/references/content-pillars.md | Pillar 3 guidance referenced `reviews` table for Neon query | `reviews` does not exist. Correct table is `stepper_form_data`. | Fixed in Task 8 |
| product-context/references/db-schema.md | `searches` table missing from Section 1 Active Neon Tables | `searches` is an active Neon table used by search.service.ts — added to Section 1 | Fixed in Task 8 |
| visual-asset-creation/SKILL.md | Key Rule 1 said "before writing any prompt or building any Figma asset" | v1.3 replaced Figma with PPTX but this line was not updated — now reads "any PPTX" | Fixed in Task 8 |
| knowledge/staffroom-ux-constraints.md | "Staffroom's user base" — capitalised | Brand rule violation — changed to "staffroom's" | Fixed in Task 8 |
| knowledge/skill-architecture.md | "The 7-Skill Ecosystem" — count wrong | Table updated to 8 skills across 4 clusters | Fixed in Task 8 |
| knowledge/staffroom-teacher-insights.md | 30.7% completion rate appeared to contradict the 40% figure in product-metrics.md and ux-constraints.md | Added clarifying note: D1 measures all form-start attempts (broader denominator); Neon measures completions among submitted reviews | Fixed in Task 8 |
| CLAUDE.md + knowledge/staffroom-competitive-landscape.md | Market size stated as "4 million teachers / 340,000+ private schools" | UDISE+ 2023-24 (primary source): ~3.7M (37.3 lakh) teachers, ~330,000 (3.31 lakh) private unaided schools. Updated in both files Jul 2026. | Fixed Jul 2026 |
| knowledge/staffroom-journey.md | "50L teachers / 4L schools" (market size), "34yrs" teacher age, "2500+ sign-ups", "₹30 CAC", "~20% review rate" | All outdated/wrong. Market size: see UDISE+ 2023-24 figures above. Teacher age: 32yrs (TISS SOTTTER 2023). Other figures: see staffroom-product-metrics.md. Prominent data-freshness warning added to file. | Fixed Jul 2026 |
| knowledge/staffroom-strategic-narrative.md | "~50L teachers and 4L+ private schools" (market size overstated) | UDISE+ 2023-24: ~3.7M teachers, ~330K private unaided schools. Data-freshness warning updated with specific inaccurate figures. | Fixed Jul 2026 |
| knowledge/skill-architecture.md | "The 9-Skill Ecosystem" in header (body already said 10 skills) | Updated header to "The 10-Skill Ecosystem" to match body; later reduced to 9 skills after a skill was removed. | Fixed Jul 2026 |
| product-context/references/api-inventory.md | Auth module documented as `/auth/send-otp`, `/auth/verify`, `/auth/me` | All wrong. Correct: `/whatsapp/send-otp`, `/whatsapp/verify-otp`, `/whatsapp/update-profile`. No `/auth/me` endpoint — session verified via `GET /user/context`. Admin auth only is at `/admin/login`. | Fixed Apr 2026 |
| product-context/references/api-inventory.md | 10+ modules entirely missing from the inventory | Added: WhatsApp Auth, User, Saved Schools, Places, Teacher Counts, Top Rated, Tracking, Insights, Referral, Nudge redirect. Expanded Admin routes. | Fixed Apr 2026 |
| product-context/references/data-flow.md | Flow 3 step 4: "stepper_form_approval records created with 5 boolean approval fields — Approval is admin-reviewed" | stepper_form_approval exists in schema but is NEVER written to by any code. No moderation pipeline is implemented. | Fixed Apr 2026 |
| product-context/references/data-flow.md | Flow 4 auth endpoints: `/auth/send-otp`, `/auth/verify`, `GET /auth/me` | All wrong — see api-inventory.md fix above. Also updated login exit count: 606 → 662. | Fixed Apr 2026 |
| product-context/references/data-flow.md | Flow 5 nudge: "POST /nudge → nudge.service.ts → sends WhatsApp message directly" | Completely wrong. Nudges are queue-based: event → D1 queue table INSERT → cron triggers `POST /admin/cron/trigger` every 5 min → nudge-process.service.ts reads queue → nudge-send.service.ts dispatches. | Fixed Apr 2026 |
| product-context/references/d1-schema.md | 4 D1 tables entirely undocumented: nudge_template_configs, place_location_cache, whatsapp_nudge_templates, referrals | Added all 4 with full PRAGMA schemas. Also documented full schema for place_city_cache and top_rated_cache (Section 3). | Fixed Apr 2026 |
| codebase-context/references/stack-topology.md | Framework versions listed as "Next.js 16" and "React 19" (no patch versions) | Updated to Next.js 16.1.6 and React 19.2.3. Added note: @nestjs/typeorm is in package.json but 0 usages in source — ghost dependency. | Fixed Apr 2026 |
| knowledge/staffroom-product-metrics.md | All Mar 2026 figures outdated (2,905 sign-ups, 635 submitted, 255 full_complete, 15 schools with 3+ reviews, Bengaluru 44%) | Updated to Apr 2026: 824 submitted, 521 live, 329 full_complete, Bengaluru ~31%. Flagged 15→6 schools discrepancy for Nikhil to verify. | Fixed Apr 2026 |
| knowledge/staffroom-ux-constraints.md | Mar 2026 figures throughout; no recording-based behavioural evidence | Updated to Apr 2026 figures. Added recording-confirmed patterns for login drop-off (WebView/dead click), school page dead clicks (non-interactive elements that look clickable), and review form Back/Next button junction. | Fixed Apr 2026 |
| knowledge/staffroom-content-performance.md | Mar 2026 data; 261 videos, 133K views, 7,563 hours; Bengaluru 44% | Updated to Apr 2026: 260 videos, 242,089 views (3,807 hours — different time window, noted). IG: 1,072,202 total views, 12,086 shares (full Jan–Dec 2025). City concentration note updated. | Fixed Apr 2026 |
| knowledge/staffroom-user-journey.md | v1.7 header (24 Jun 2026) undercounted: review form documented as 6 steps / 2 mid-flow reveals / 5 Career Insight cards; "share your experience" terminology throughout; insight-card taps documented as direct-navigate | Full refresh to v2.0 (17 Jul 2026): 7-step form / 5 reveals (A–E), 9 Career Insight cards (F–I added), "Write a review" terminology app-wide, insight-card taps now open a state-appropriate popup, Section 8 tracking expanded (Clarity instrumentation), cache-eviction and rate-limiting notes added | Fixed Jul 2026 |
| skills/product-context/references/neon-schema.md | "5 career insight cards" in unlock-states table, no naming-drift note | Updated to 9 cards (F–I added); added note that `s1_complete`/`s2_step2_complete` labels still refer to pre-25-Jun step numbering | Fixed Jul 2026 |
| skills/product-context/references/api-inventory.md | `/wa/dlv` (WhatsApp delivery webhook) undocumented; entire `admin/apply` route block (12 endpoints) missing despite other admin modules being comprehensively listed | Added both | Fixed Jul 2026 |
| skills/codebase-context/references/deployment-guide.md | `/api/admin/health` documented as a meaningful CI gate; no mention it was a stub that always returned 200 until 9 Jul 2026; new pre-build Postgres-container test gate undocumented | Added both notes | Fixed Jul 2026 |
| skills/codebase-context/references/stack-topology.md | Postgres pool sizing undocumented | Added `max: 50, connectionTimeoutMillis: 5000` (set 28 Jun 2026) | Fixed Jul 2026 |
| knowledge/staffroom-product-metrics.md | "Salary & Work Experience" funnel stage marked "not queried" with no warning that pre-6-Jul admin-dashboard figures for this stage were inflated by a since-fixed bug (`totalWorkExperience` defaulting to 0 counted as "answered") | Queried live via `POSTGRES_CONNECTION_STRING` in `backend-nest/.env` (17 Jul 2026) — full Review Funnel table refreshed, all 7 stages now have real Jul 17 counts, not just the top two. Warning about pre-fix inflated figures retained. | Fixed Jul 2026 |
| skills/product-design/references/component-standards.md | Empty-state example copy used retired "share your experience" phrasing | Updated to "write a review" terminology | Fixed Jul 2026 |

---

## Checklist: Before Creating a New Skill

- [ ] What is the user intent this skill serves? (one clear intent per skill)
- [ ] What % of SKILL.md content is relevant to any single request? If <60%, plan a reference file split
- [ ] Does any content belong in CLAUDE.md instead? (safety trip-wires, structural implications)
- [ ] Does any content belong in a knowledge doc instead? (metrics, research, platform data)
- [ ] Are there safety trip-wires that need to live in BOTH the skill and CLAUDE.md?
- [ ] Is the SKILL.md description specific enough to trigger reliably? (use skill-creator for description optimisation)
- [ ] Cross-references: do related skills point to this one?
- [ ] Update Assets & References section in CLAUDE.md if needed
