---
name: advisory-councils
version: 1.0
description: >
  Convenes one or more expert advisory councils to deliberate on a staffroom
  decision. Triggers: 'run [council] council', 'ask the council', 'what would
  the brand council say', 'convene the council', 'run joint council', 'get
  expert advice on', 'what do the experts think about', 'council on [topic]'.
  Four councils available: brand-marketing, visual-design, product-design,
  software-engineering. Not for implementation tasks, debugging, PR review,
  or code execution — use codebase-context or engineering-review for those.

triggers:
  - "run brand-marketing council"
  - "run visual-design council"
  - "run product-design council"
  - "run software-engineering council"
  - "run joint council"
  - "ask the council"
  - "convene the council"
  - "what would the [council] council say"
  - "get expert advice on"
  - "council on"

uses_references:
  - references/deliberation-process.md
  - knowledge/staffroom-journey.md         # load for brand-marketing or product-design councils — origin story and founder intent
  - knowledge/staffroom-strategic-narrative.md  # load for any council requiring full strategic context — GTM, positioning, monetisation, competitive landscape

context_loading_note: >
  Load knowledge/staffroom-journey.md and knowledge/staffroom-strategic-narrative.md
  before council deliberation when the question involves brand positioning, GTM, product
  direction, or competitive strategy. Data caution: both files may contain outdated
  platform metrics and projections — councils must treat these as narrative context, not
  live data. Verify any figures cited in deliberation against knowledge/staffroom-product-metrics.md
  and knowledge/staffroom-competitive-landscape.md before presenting as fact.

related_skills:
  - brand-custodian
  - product-design
  - engineering-review
---

# advisory-councils

## Purpose

Convenes synthetic expert advisory councils to deliberate on staffroom
decisions. Councils think from defined mental models (25 learnings each),
argue with each other, ask clarifying questions when needed, and deliver
a structured advisory output. They do not implement — they advise.

## When to Load This Skill

- Strategic brand, positioning, or messaging decisions
- Visual identity and design direction decisions
- Product direction, UX philosophy, or feature prioritisation decisions
- Architecture, technical strategy, or build-vs-buy decisions
- Any decision where independent expert challenge is more useful than
  a single answer

## When NOT to Load This Skill

- Implementation tasks (writing code, debugging, PR review) → use
  codebase-context or engineering-review
- Brand copy review or content creation → use brand-custodian or
  content-strategy
- Screen design or component critique → use product-design skill
- Quick factual questions — just answer directly

---

## The Four Councils

| Council | Folder | Members |
|---|---|---|
| brand-marketing | councils/brand-marketing/ | Piyush Pandey, Prasoon Joshi, Santosh Desai, Rory Sutherland |
| visual-design | councils/visual-design/ | Sudhir Sharma, Sujata Keshavan, Michael Bierut |
| product-design | councils/product-design/ | Saptarshi Prakash, Luke Wroblewski, Jared Spool, Steve Krug |
| software-engineering | councils/software-engineering/ | Pramod Varma, Venkat Subramaniam, Martin Fowler, Kent Beck, Kelsey Hightower, Kailash Nadh |

---

## Invocation Patterns

**Single council:**
> "run brand-marketing council: [question]"

**Joint council (cross-discipline question):**
> "run joint council [brand-marketing + product-design]: [question]"
> All experts from all named councils participate in one shared session.

**When unsure which council:** ask Nikhil which discipline(s) the question
primarily belongs to before starting.

---

## Company Context for Councils

Councils are advisors, not Claude. They read the following sections of
CLAUDE.md as company context — nothing else from CLAUDE.md applies to them:

- **staffroom — 30-Second Context** (who we are, what we're building)
- **Current Priorities** (what matters right now)
- **Competitive Landscape** (summary — load full file if competitive
  context is central to the question)

Load additional knowledge files selectively based on question domain:

| Question domain | Load |
|---|---|
| Competitive positioning | knowledge/staffroom-competitive-landscape.md |
| Teacher audience, messaging | knowledge/staffroom-teacher-insights.md |
| Product metrics, traction | knowledge/staffroom-product-metrics.md |
| Brand voice, visual language | skills/brand-custodian/references/brand-narrative.md |
| UI/UX decisions | knowledge/staffroom-ux-constraints.md |
| Technical architecture | skills/product-context/references/stack-topology.md |

Do not load all files for every session. Load only what the question
actually requires.

---

## Workflow

1. Identify which council(s) to convene (single or joint)
2. Load this SKILL.md (already done)
3. Read the relevant company context sections listed above
4. Read `councils/[council]/MEMBERS.md` for all invoked councils
5. Read `skills/advisory-councils/references/deliberation-process.md`
6. Execute the deliberation process as specified in that file
7. Deliver the final advisory output

---

## Key Rules

1. Experts advise — they never implement, never write code, never make
   product decisions. Nikhil decides.
2. Experts think FROM their learnings, not about their domain in general.
   Every substantive claim must be traceable to a specific learning.
3. No internet access during deliberation. Facts needed to ground the
   question should be provided as a pre-session briefing, not fetched
   mid-session.
4. Global experts (Rory Sutherland, Michael Bierut, Martin Fowler, etc.)
   must flag when they are extrapolating beyond their direct experience
   context into India/bootstrapped/education-sector territory.
5. The software-engineering council is for architecture philosophy,
   technical strategy, and build-vs-buy decisions. Not for implementation
   tasks — those go to codebase-context and engineering-review.
