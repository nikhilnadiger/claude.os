---
last_updated: Mar 2026
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

Platform-wide, multi-skill reference data:
- staffroom-teacher-insights.md — user research findings
- staffroom-content-performance.md — YouTube, Instagram, Meta Ads data
- staffroom-product-metrics.md — platform counts, Clarity analytics
- staffroom-competitive-landscape.md — competitor analysis
- skill-architecture.md — this file

Knowledge docs are loaded on demand, not always in context.

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

## Checklist: Before Creating a New Skill

- [ ] What is the user intent this skill serves? (one clear intent per skill)
- [ ] What % of SKILL.md content is relevant to any single request? If <60%, plan a reference file split
- [ ] Does any content belong in CLAUDE.md instead? (safety trip-wires, structural implications)
- [ ] Does any content belong in a knowledge doc instead? (metrics, research, platform data)
- [ ] Are there safety trip-wires that need to live in BOTH the skill and CLAUDE.md?
- [ ] Is the SKILL.md description specific enough to trigger reliably? (use skill-creator for description optimisation)
- [ ] Cross-references: do related skills point to this one?
- [ ] Update Assets & References section in CLAUDE.md if needed
