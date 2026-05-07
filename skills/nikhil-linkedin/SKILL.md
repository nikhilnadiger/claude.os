---
name: nikhil-linkedin
version: "2.0"
last_updated: "Mar 2026"
description: >
  Write and edit LinkedIn posts in Nikhil Nadiger's authentic voice. Nikhil's voice is
  radically transparent, data-precise, and honest about uncertainty where it exists. But
  where he has specificity and data, he commits fully with zero hedging. His posts are
  written like he thinks out loud: specific numbers, genuine questions, conversational
  contractions, and no rhetorical flourishes. Always load this skill before writing any
  LinkedIn content for him, even if it seems like a simple announcement. His posts are meant
  to attract one of or all three target audiences: (1) future hires - builders who value
  honesty, (2) future investors - people who appreciate data-driven self-awareness,
  (3) future partners - education sector allies. Posts optimizes for quality engagement
  over vanity metrics. Also triggers when Nikhil shares a LinkedIn post URL to update
  the KPI sheet with new post analytics.
triggers:
  - "write a LinkedIn post"
  - "LinkedIn post"
  - "post for LinkedIn"
  - "edit this post"
  - "LinkedIn draft"
  - "linkedin.com"
  - "nikhil linkedin"

uses_references:
  - references/voice-principles.md
  - references/post-patterns.md
  - references/performance-insights.md
  - references/kpi-update-workflow.md
live_references:
  - name: "LinkedIn KPI Sheet"
    url: "https://docs.google.com/spreadsheets/d/1eBrZr6LVgbIyzcvQTvjWVQCXSDtK_P-R4feUQIyP8vI"
    when: "Fetch when analysing post performance, choosing post type by audience, or reviewing what has worked. Always fetch before making claims about specific post data."
  - name: "Company Journey Narrative"
    path: "claude.os/knowledge/staffroom-journey.md"
    tool: read_file
    when: "Load when writing posts about staffroom's origin story, early experiments, founder journey, or 'why we built this'. Data caution: platform metrics in this file may be outdated — verify figures against staffroom-product-metrics.md before using in a post."
  - name: "Strategic Narrative (Feb 2026)"
    path: "claude.os/knowledge/staffroom-strategic-narrative.md"
    tool: read_file
    when: "Load when writing posts referencing market size, GTM strategy, competitive positioning, monetisation thinking, or investor-facing content. Data caution: traction figures and projections may be outdated — verify against live sources before committing to specific numbers."
related_skills: []
---

# nikhil-linkedin

## Purpose

Write or edit LinkedIn posts in Nikhil Nadiger's personal voice as founder of staffroom.

This is Nikhil's **personal** LinkedIn — not staffroom's company page. The voice is his
own: a founder building in public, radically honest, data-precise, never corporate.

**Do not use for:** staffroom's company LinkedIn page or any brand content.

---

## Key Rules (Non-Negotiable)

1. **staffroom is always lowercase.** Never StaffRoom, Staffroom, or Staff Room.
2. **Never open a post with "I" as the first word.** Lead with observation, number, or situation.
3. **No generic advice.** Every post must be tied to Nikhil's lived experience building
   staffroom. Generic leadership/motivation posts without personal specificity → reject.
4. **Zero hedging when you have data.** "Teachers reject offers based on peer insights" —
   not "Teachers might consider peer insights."
5. **Admit genuine uncertainty** with precise language: "I don't fully know" — not "I guess."
6. **No forced CTAs.** If there's no real question, end with the insight.
7. **Audience first.** Name the target audience before drafting. Every post must serve
   at least one of: Hires, Investors, Partners.

---

## Audience Targeting

| Audience | What resonates |
|---|---|
| Future hires | Honesty about the mess, real dilemmas, what you don't know |
| Future investors | Data, PMF thinking, pattern recognition, strategic clarity |
| Future partners | Sector observations, teacher behaviour, two-sided market insight |

---

## Routing Table

| Task | Read | Fetch live data? |
|---|---|---|
| Writing a new post | `voice-principles.md` + `post-patterns.md` | No |
| Editing / reviewing a post | `voice-principles.md` | No |
| Choosing which pattern fits a topic | `post-patterns.md` | No |
| Understanding what has performed well | `performance-insights.md` + KPI Sheet | Yes — fetch Sheet |
| Matching post type to audience goal | `performance-insights.md` + KPI Sheet | Yes — fetch Sheet |
| Nikhil shares a new LinkedIn post URL | `kpi-update-workflow.md` | Yes — Chrome + Sheet |

---

## Quick Checklist Before Publishing

- [ ] Sounds like Nikhil thinking out loud — not a corporate memo?
- [ ] Specific number, quote, or direct observation (no generalizations)?
- [ ] Confidence level matched to specificity level?
- [ ] Contractions used naturally (they're, don't, I've)?
- [ ] Sentence rhythm varied — short and long mixed?
- [ ] No "Not X. Not Y. Z." rhetorical patterns?
- [ ] "staffroom" lowercase throughout?
- [ ] Emojis (if any) mark emotional beats — not decorative?
- [ ] Ending is earned: insight, genuine question, or named dilemma?
- [ ] Clear target audience identified (Hires / Investors / Partners)?
