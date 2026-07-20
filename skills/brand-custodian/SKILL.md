---
name: brand-custodian
version: 1.6
description: >
  Use for any staffroom content requiring brand voice enforcement, language
  review, or output checked against brand rules. Triggers: 'brand check',
  'does this sound on-brand', 'review for brand', 'staffroom tone',
  'red flag check', 'is this language okay', 'align this to brand',
  'align to staffroom brand', 'write email from staffroom', 'write WhatsApp
  message for staffroom', or any copy representing staffroom publicly —
  product UI, teacher/school communication, investor/partner decks, emails,
  internal docs. Not for social media scripts (use content-strategy) or
  design asset creation (use visual-asset-creation).

triggers:
  - "brand check"
  - "review for brand"
  - "does this sound on-brand"
  - "staffroom tone"
  - "red flag check"
  - "is this language okay"
  - "align this to brand"
  - "align to staffroom brand"
  - "write email from staffroom"
  - "write WhatsApp message for staffroom"
  - "on-brand"

uses_references:
  - references/brand-narrative.md
  - references/visual-identity.md
  - references/output-playbook.md
  - knowledge/staffroom-strategic-narrative.md  # load only for investor/partner output type (section 4 of output-playbook)

related_skills:
  - content-strategy
  - visual-asset-creation

live_references:
  - label: Brand Guidelines (PDF)
    path: claude.os/assets/brand-guidelines.pdf
    tool: read_file
  - label: Strategic Narrative (investor/partner context)
    path: claude.os/knowledge/staffroom-strategic-narrative.md
    tool: read_file
    when: "Load only when output type is investor/partner materials (pitch decks, one-pagers, partner proposals). Data caution: traction figures and projections may be outdated — verify all claims against staffroom-product-metrics.md and live sources before including in any deliverable."
---

# brand-custodian

## Purpose

Ensures all staffroom output — product UI copy, teacher and school
communications, investor/partner decks, emails, presentations, and external
outreach — consistently reflects staffroom's brand voice, language rules,
and values. Single checkpoint before any brand-facing content is delivered.

## When to Load This Skill

- Writing or reviewing product UI copy: buttons, labels, empty states, error
  messages, onboarding flows
- Drafting teacher-facing communication: WhatsApp messages, emails, review
  prompts, in-app guidance
- Drafting school-facing communication: outreach emails, recognition messages,
  school response guidelines
- Writing investor or partner-facing materials: pitch decks, one-pagers,
  meeting follow-ups, partnership proposals
- Writing internal documents that will represent staffroom externally
- Reviewing existing copy for brand alignment: "does this sound on-brand?"
- Creating or reviewing presentations and decks under the staffroom brand
- Any output where the question is: "is this language okay for staffroom?"

## When NOT to Load This Skill

- Instagram reel scripts or YouTube video scripts → use content-strategy
- Visual asset creation or design briefs → use visual-asset-creation
- Code review, product architecture, or feature decisions

## Key Rules

1. **staffroom is always lowercase** — never StaffRoom, Staffroom, or
   STAFFROOM, anywhere, including mid-sentence and in document titles
2. **Canonical CTA is "Write a review"** — not "Share an experience";
   "Write your review" is acceptable as a personalised variant
3. **Voice stance: celebrate excellence, invite improvement — never accuse**
   — staffroom never takes sides between teachers and schools publicly
4. **Evidence-backed only** — never make claims not verified by data; no
   unverified superlatives; this applies equally in investor/partner materials
5. **No public naming/shaming** — never call out a specific school negatively
   in any public-facing or partner-facing output
6. **Teacher voice**: warm, constructive, empowering. **Institution voice**:
   collaborative, credible, respectful. Keep the two voices distinct
7. **Verification language**: "Real teacher review" — not "Approved
   review", "Certified", or "Endorsed"
8. **Recognition language**: "recognised for building supportive staffrooms"
   — not "Top school" or "Best school" unless supported by review volume and data
9. **No corporate or jargon-heavy tone** — avoid "leverage", "synergy",
   "ecosystem partner", "at scale", "unlock" in brand-facing copy
10. Before writing or reviewing: read references/brand-narrative.md (voice,
    personality, tagline) and references/output-playbook.md (channel-specific
    do/don'ts)

## Workflow

1. Read `references/brand-narrative.md` — voice system, personality, tagline,
   core promise
2. Read `references/output-playbook.md` — navigate directly to the section
   matching the output type. Sections: **1** Product UI copy, **2** Teacher-
   facing communication, **3** School-facing communication, **4** Investor/
   partner materials, **5** Social media spotlights, **6** Community management,
   **7** Email and WhatsApp broadcasts, **8** Internal docs with external reach,
   **9** Before/After common violations, **10** Moderation rules.
   **If output type is section 4 (investor/partner materials):** also read
   `knowledge/staffroom-strategic-narrative.md` for pitch framing, market
   data, and competitive context. Data caution: figures in that file may be
   outdated — verify all claims against `knowledge/staffroom-product-metrics.md`
   and live sources before including in any deliverable.
3. **Read `references/visual-identity.md`** — mandatory whenever the output
   involves any visual element: email headers, deck slides, in-app UI,
   asset descriptions, or any copy that will appear alongside a visual.
   Never recall brand colours or typography from memory.
4. Write or review the output against all Key Rules above
5. Run the Red Flags checklist before delivering
6. If reviewing existing content: annotate each violation with the rule it
   breaks and provide a corrected version inline
7. Before delivering: if the original objective of the document (inform an
   investor, onboard a teacher, convert a school) is no longer met due to
   brand-required edits, explicitly flag this — explain what was changed,
   why, and what alternative approach would achieve both the objective and
   brand compliance

## Output Requirements

- **Fresh content**: write to brand from the start; flag any areas where the
  brief conflicts with brand rules before writing
- **Review / corrections**: annotate specific violations (e.g., "Red flag:
  accusatory language → [corrected version]") — do not silently rewrite
  without showing what changed and why
- Before delivering, ask: does this read as a warm, credible, Indian education
  platform — or does it sound generic, corporate, or adversarial?

## Red Flags — Review Before Delivering

- [ ] "staffroom" capitalised anywhere (StaffRoom, Staffroom, STAFFROOM)
- [ ] "Share an experience" or "Share your experience" used instead of "Write a review"
- [ ] Accusatory or inflammatory language toward a school or teacher
- [ ] Any public naming/shaming of a specific school
- [ ] Platform appearing to take sides between teacher and school
- [ ] Overpromising impact ("staffroom will fix education")
- [ ] Excessive praise without data ("the best", "top-rated", "unmatched")
- [ ] Tick/check symbol used to imply staffroom has "certified" or "approved"
  a school
- [ ] Jargon-heavy or corporate-sounding language
- [ ] Emotional manipulation — guilt-tripping, sensationalism, unverified
  testimonials
- [ ] Unverified claims stated as fact — including in investor/partner decks
- [ ] Verification language that implies judgment ("your school passed" /
  "your school failed")
