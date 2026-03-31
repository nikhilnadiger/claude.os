---
last_updated: Mar 2026 (31)
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
- skill-architecture.md — this file

Skill reference docs (in skills/*/references/):
- product-context/references/db-schema.md — full DB schema: all Neon + D1 tables, columns, active/legacy status
- product-context/references/data-flow.md — six primary product flows (search, review, auth, nudge, etc.)
- product-context/references/api-inventory.md — all NestJS API endpoints and contracts
- codebase-context/references/stack-topology.md — infra: frontend, NestJS, hosting, DB overview
- engineering-review/references/architecture-patterns.md — NestJS patterns, DB conventions, auth patterns
- visual-asset-creation/references/pptx-assets.md — PowerPoint path: python-pptx setup, all asset types, colour/font spec, export instructions
- (+ brand-custodian/references/, content-strategy/references/ — see those skills for routing)

---

## The 7-Skill Ecosystem

staffroom's claude.os has 7 skills in two clusters plus one cross-cutting skill:

| Cluster | Skill | Primary intent |
|---|---|---|
| Brand | brand-custodian | Brand voice, rules, what staffroom sounds/looks like |
| Brand | visual-asset-creation | Create PowerPoint/Gemini visual assets |
| Brand | content-strategy | Plan and script content (YouTube, Instagram, WhatsApp) |
| Engineering | codebase-context | Implement or debug code in the staffroom codebase |
| Engineering | engineering-review | Review PRs, architecture decisions, ADRs |
| Product | product-context | Understand how features, flows, and APIs work |
| Product | product-design | UI/UX design decisions, screen design, critique |

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
| New analytics data (Clarity, Neon) | staffroom-product-metrics.md, staffroom-ux-constraints.md |
| New content published | staffroom-content-performance.md |
| Codebase architecture change | stack-topology.md, deployment-guide.md |
| New competitor action | staffroom-competitive-landscape.md |
| New teacher research | staffroom-teacher-insights.md |
| New skill created | CLAUDE.md (Assets & References), skill-architecture.md (ecosystem table) |

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
