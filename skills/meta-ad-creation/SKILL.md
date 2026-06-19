---
name: meta-ad-creation
version: 1.0
description: >
  Use when Nikhil wants to create a new Meta Ads campaign from scratch or
  iterate on an existing one. Triggers: "create a Meta ad", "run a new
  campaign", "let's do a new ad campaign", "I want to run ads for X", "build
  a campaign brief", "iterate on the last campaign", "new ad", "ad campaign
  for", "Meta ads for". Covers the full end-to-end process: self-briefing
  sweep → Gate 0 (Creative Strategy Brief) → Gate 1 (Creative Routes) →
  Gate 2 (Scripts) → Gate 3 (Production Briefs) → Gate 4 (Meta Ads Setup
  Brief). The brand-marketing council does all creative work. Claude assembles
  data and produces the Meta setup brief only. Not for content strategy (use
  content-strategy skill) or visual asset creation (use visual-asset-creation
  skill).

uses_references:
  - references/gate-framework.md
  - references/production-brief-formats.md
  - references/meta-ads-setup.md

related_skills:
  - advisory-councils
  - visual-asset-creation
  - content-strategy
  - brand-custodian
---

# meta-ad-creation

## Purpose

Runs a full Meta Ads campaign creation process via 4 strictly sequential
gates. Works for any campaign objective, any audience, any product feature.
Does not impose creative direction — the council derives that from the brief.

Works in two modes:
- **Fresh** — new campaign territory, no prior performance data
- **Iteration** — building on a prior campaign's learnings and CPR data

Not for organic content scripting → use content-strategy. Not for standalone
visual asset creation → use visual-asset-creation.

---

## Role Table

| Who | Does What | Does NOT Do |
|---|---|---|
| Brand-Marketing Council | All creative output at Gates 0–3 (Brief, Routes, Scripts, Production Briefs) | Set up ads, pull data, make product decisions |
| Claude | Runs self-briefing sweep before Gate 0. Assembles pre-session briefing package before each gate. Relays Nikhil's feedback to council. Produces Gate 4 Meta Ads Setup Brief. | Produce creative of any kind |
| Nikhil | Reviews and approves (or gives written feedback) at every gate | Open the next gate without explicitly approving the prior gate in writing |

---

## Mode Detection

Claude executes this check at invocation, before anything else:

**Check:** Is there prior campaign data in context or accessible files?
- Meta Ads campaign exports, prior CPR benchmarks, or prior production briefs
  exist AND Nikhil's invocation references an existing campaign
  → **Iteration Mode**
- No prior campaign data exists, OR Nikhil explicitly says this is new
  territory → **Fresh Mode**

**Iteration Mode:** Gate 0 brief is pre-seeded with what worked and what
failed from the prior campaign. The council sees this as context — it does
not constrain their creative direction, but they are not briefed blind.

**Fresh Mode:** Gate 0 starts from the assembled brief alone. No prior
creative assumptions imported.

---

## Self-Briefing Sweep

Mandatory. Claude runs this before presenting anything to Nikhil. Claude
assembles a draft input set by pulling from the sources below, then presents
it to Nikhil as a structured block with the message:

> "Here is what I found. Correct anything before I open Gate 0."

Gate 0 does not open until Nikhil confirms or edits the assembled inputs.

| Input | Where Claude Looks |
|---|---|
| Campaign objective | CLAUDE.md current priorities; prior campaign context; what the product is currently asking users to do |
| Target audience | knowledge/staffroom-teacher-insights.md; geographic focus in CLAUDE.md |
| Budget range | Prior Meta Ads spend patterns; CLAUDE.md bootstrapped constraint |
| Production formats available | Prior production briefs; formats actually executed in prior campaigns |
| Nikhil on camera | Prior production briefs |
| Prior CPR benchmarks | Meta Ads exports if available; knowledge/staffroom-content-performance.md |
| Strongest current platform insight | Live Neon query — run it; do not use cached data |
| Current product state | Live codebase review; CLAUDE.md; what the product actually delivers to a user who clicks an ad right now |

---

## Gate Sequence Summary

Full spec for each gate: `references/gate-framework.md`

| Gate | Produced By | Nikhil's Action |
|---|---|---|
| Gate 0 — Creative Strategy Brief | Brand-Marketing Council | Approve in writing or give feedback |
| Gate 1 — Creative Routes | Brand-Marketing Council | Select which routes to develop; written direction required |
| Gate 2 — Scripts | Brand-Marketing Council | Approve each script individually |
| Gate 3 — Production Briefs | Brand-Marketing Council | Approve each brief; approved briefs go to production |
| Gate 4 — Meta Ads Setup Brief | Claude | Approve before any ad goes live |

**Gates are strictly sequential.** No gate opens without written approval of the prior gate. No parallel work.

---

## Key Rules

1. **Strictly sequential.** No gate opens without written approval of the prior gate. No parallel work.
2. **The council produces all creative.** Claude never writes hooks, routes, scripts, or production briefs.
3. **The self-briefing sweep is mandatory before Gate 0.** No session opens on assumed or stale data.
4. **Nikhil confirms or edits the assembled inputs before the council is briefed.**
5. **For each gate, Claude loads the full pre-session briefing package into council context before any expert speaks.** The council does not start cold.
6. **When Nikhil gives feedback on a gate output, Claude relays it to the council in full** — no filtering, no editorialising.
7. **Gate 4 (Meta Ads Setup Brief) is produced by Claude, not the council.**
