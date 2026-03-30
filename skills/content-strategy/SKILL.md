---
name: content-strategy
version: 1.0
description: >
  Use for all staffroom content creation and planning: Instagram Reels,
  YouTube Shorts, YouTube long-form, LinkedIn posts (staffroom page),
  WhatsApp broadcast content, and content calendar planning. Triggers:
  'write a script', 'create content', 'reel idea', 'YouTube video',
  'content plan', 'what should we post', 'script for Instagram',
  'content calendar', 'IR script', 'episode idea', 'what content should
  we make'. Not for brand voice review of non-content outputs
  (use brand-custodian), Nikhil's personal LinkedIn (use nikhil-linkedin),
  or visual asset creation (use visual-asset-creation).

triggers:
  - "write a script"
  - "create content"
  - "reel idea"
  - "YouTube video"
  - "content plan"
  - "what should we post"
  - "script for Instagram"
  - "content calendar"
  - "IR script"
  - "episode idea"
  - "what content should we make"
  - "write me a reel"
  - "script idea"

uses_references:
  - references/content-pillars.md
  - references/script-style-guide.md
  - references/channel-specs.md

related_skills:
  - brand-custodian
  - visual-asset-creation

live_references:
  - label: Scripts Archive IR32–IR55 + Episodes E1–E16 (Google Drive folder)
    url: https://drive.google.com/drive/folders/1uc7NJ2P4I176XixSIQXTxv1xM-_fFmFY
  - label: Scripts Archive IR56–IR86 (multi-tab Google Doc)
    url: https://docs.google.com/document/d/1QiorYOxbX2-COZ7F_uiDekIzbH2yvLVfwDqYFYkNRRc/edit
  - label: Teacher Insights (user research)
    path: claude.os/knowledge/staffroom-teacher-insights.md
    tool: read_file
  - label: Content Performance Data
    path: claude.os/knowledge/staffroom-content-performance.md
    tool: read_file
---

# content-strategy

## Purpose

Plans and produces all staffroom content: scripts for Instagram Reels
and YouTube (Shorts and long-form), content calendar recommendations,
and WhatsApp broadcast content. All content is grounded in performance
data — what has actually worked — and in the 5 data-derived content
pillars. No hypothetical frameworks.

## When to Load This Skill

- Writing a new Instagram Reel or YouTube Short script (IR format)
- Writing a YouTube long-form episode outline or script
- Planning a content calendar for a week, month, or campaign
- Deciding which pillar or topic to cover next
- Adapting a script across channels (e.g., Reel script → WhatsApp copy)
- Reviewing whether a content idea fits staffroom's proven formula
- Generating hook variations for a given topic

## When NOT to Load This Skill

- Brand voice review of emails, product UI, or investor materials → use brand-custodian
- Nikhil's personal LinkedIn posts → use nikhil-linkedin (separate skill, not part of this workflow)
- Creating visual assets, thumbnails, or design briefs → use visual-asset-creation
- Product decisions, engineering, or growth strategy

## Key Rules

1. **Read source reference files before writing** — before producing any
   script or content plan, read the relevant knowledge docs
   (`knowledge/staffroom-content-performance.md` for performance data,
   `knowledge/staffroom-teacher-insights.md` for audience insights). Never
   recall data points, statistics, or audience descriptions from memory.
2. **All content must map to one of the 5 pillars** — if it doesn't fit,
   question whether it should be made
3. **Hook first, always** — the first 2–3 seconds determine completion;
   use only proven hook types (Authority, Data, Validation)
4. **Specific beats generic** — "₹22,000/month for 8 years" beats
   "teachers are underpaid"; real numbers, named contexts, actual quotes
5. **staffroom is always lowercase** — in all scripts, captions, CTAs
6. **Hinglish is a tool, not a gimmick** — use it where it sharpens
   authenticity; do not force it
7. **Never take sides between teachers and schools** — staffroom
   surfaces reality; it does not accuse, vilify, or sensationalise
8. **CTA default is "Share an experience"** — not "write a review"
9. **Before writing a script**: read references/script-style-guide.md
   for the confirmed IR format and hook formulas
10. **Before choosing a topic**: read references/content-pillars.md
    to select the right pillar and validate topic-pillar fit
11. **Before specifying channel format**: read references/channel-specs.md

## Workflow

### For a single script (IR / Reel / Short)

1. Read `references/content-pillars.md` — confirm pillar, audience
   segment, and topic-data fit
2. Read `references/script-style-guide.md` — select hook type, load
   the IR format template and beat structure
3. Research the topic before writing: gather cited data, real examples,
   named organisations, and anecdotes relevant to the topic. If platform
   review data is needed, query Neon DB or ask Nikhil to provide a CSV
   export. If the topic requires external facts, use web search to find
   credible, India-specific sources. Never invent data — if a fact cannot
   be sourced, flag [ADDITIONAL INPUT NEEDED: describe what is missing] rather
   than fabricate. Scripts with open flags must not be published until all
   flags are resolved — either by Nikhil providing the information or by
   removing the claim.
4. Draft the script in the confirmed format:
   - Title (punchy, searchable)
   - Description (YouTube/Instagram caption with data + CTA + follow)
   - Script table: Section | Hear (voice) | See (visual)
   - Sources list
5. Run the content checklist before delivering (see below)

### For a content calendar

1. Read all three reference files
2. Confirm time period, active channels, and any campaign context
3. Distribute topics across the 5 pillars — no pillar should dominate
   more than 40% of a calendar
4. For each planned piece: name the topic, pillar, hook type, and
   channel format
5. Flag any pieces that require live platform data (query timing)

### For channel adaptation

1. Read `references/channel-specs.md` for the target channel's rules
2. Identify what changes between channels: length, caption format,
   Hinglish level, CTA
3. Do not simply copy-paste — adapt structure for platform behaviour

## Content Checklist — Before Delivering

- [ ] Maps to a named pillar
- [ ] Hook type is one of the three proven types (Authority, Data, Validation)
- [ ] Opening line works as a standalone hook in the first 2–3 seconds
- [ ] At least one specific data point or named real-world example
- [ ] **All facts, data, statistics, and claims are verified against source material**
      — no invented numbers; if a fact was researched, the source is noted in the
      Sources section; if uncertain, mark [ADDITIONAL INPUT NEEDED: describe what
      is missing]; scripts with open flags must not be published until resolved
- [ ] staffroom lowercase throughout
- [ ] No side-taking between teacher and school
- [ ] CTA present and uses approved language ("Share an experience")
- [ ] Format matches channel spec (duration, caption length, hashtags)
- [ ] If Hinglish used: natural, not forced

## Output Format

All scripts delivered in the confirmed IR format:

```
**Title:** [title]
**Description:** [caption with data bullets + CTA + follow @thestaffroomdotin (Instagram) / @thestaffroom-in (YouTube)]

**Script:**
| Section | Hear (voice) | See (visual) |
| :--- | :--- | :--- |
| Hook | [voice direction] | [visual direction] |
| Body | [voice] | [visual] |
| Closure | [voice + CTA] | [staffroom logo] |

**Sources:** [URLs or data references]
```
