---
source: distilled from brand-guidelines.pdf, SKILL.md key rules, and live product review
last-updated: 2026-03-29
skills: [brand-custodian]
update-frequency: When channel strategy, canonical language, or output rules change
---

# staffroom — Output Playbook

Channel-specific rules for all staffroom-branded output. Load this alongside
`brand-narrative.md` before writing or reviewing any content.

---

## 1. Product UI Copy

Applies to: buttons, labels, empty states, error messages, onboarding flows,
tooltips, navigation items, confirmation dialogs.

### Canonical Language

| Context | Use | Do not use |
|---|---|---|
| Primary CTA (generic) | Share an experience | Write a review, Leave a review, Add a review |
| Primary CTA (personalised) | Share your experience | Write your review |
| Verification badge | Verified teacher experience | Approved review, Certified, Endorsed |
| Recognition label | Recognised for building supportive staffrooms | Top school, Best school, #1 school |
| School score label | [score] based on [n] teacher experience(s) | Rating, Stars, Score out of 5 |
| Community prompt | Join [n] teachers who have shared their experience | Join [n] reviewers |

### Semantic Colour Usage in UI

| State | Hex | Apply to |
|---|---|---|
| Success | #3D9970 | Confirmation messages, submitted states, check icons |
| Error | #C04B3A | Validation errors, required field warnings, failure alerts |
| Loading / WIP | #E8D485 | Skeleton screens, pending badges, in-progress indicators |
| Neutral / Disabled | #9E9E96 | Disabled buttons, placeholder text, secondary metadata |

### Empty States

Write empty states that invite action — not that signal failure.

- Default: explain what the section will show, and why it is currently empty.
- Include a single CTA where appropriate.
- Do not use language that implies the teacher or school has "failed" to provide something.

**Live copy (accepted, marginally divergent):** "Unlock this insight" — this phrase is in
production and accepted as-is. It departs slightly from the grounded/no-promises brand tone
but is not a red flag. Do not replace it in reviews of existing UI unless a full empty state
audit is requested.

### Tone for UI Copy

- Short, plain, mobile-first.
- Active voice. No passive constructions.
- Warm but not chatty — avoid filler ("Oops!", "Uh oh!", "Yay!").
- Never use ellipsis (...) to imply suspense or loading.

---

## 2. Teacher-Facing Communication

Applies to: WhatsApp messages, email campaigns, in-app nudges, review prompts,
onboarding copy, push notifications.

### Voice

Teacher Voice — warm, constructive, empowering. The teacher should feel respected
and informed, never pressured or guilt-tripped.

### Rules

- Lead with what the teacher gains — not what staffroom needs from them.
- CTA: "Share an experience" (generic) or "Share your experience" (personalised).
- Never frame it as "we need your review" or "help us grow" — this is about their
  experience and their community.
- Anonymity assurance should be clear but factual — say "your name is never shared
  with the school" not "100% anonymous" (which could imply no data is ever stored).
- WhatsApp messages: keep under 160 characters per message block where possible.
  Conversational, not transactional. No ALL CAPS. No excessive punctuation.
- Never send more than one message per week to the same teacher without a trigger
  event (they just signed up, they just submitted a review, etc.).

### What to Avoid

- Guilt-tripping: "You haven't shared yet — teachers are waiting for you."
- Urgency manufactured from nothing: "Last chance to share!"
- Over-promising outcomes: "Your review will change how schools treat teachers."

---

## 3. School-Facing Communication

Applies to: outreach emails, partnership proposals, recognition messages,
school dashboard copy, response guidelines.

### Voice

Institution Voice — collaborative, credible, respectful. The school should feel
invited to participate, not accused or interrogated.

### Rules

- Open with recognition of what the school is already doing — then invite them
  to strengthen it with transparency.
- Never reference a specific negative review in outreach. Do not say "a teacher
  said X" in any communication that goes to a school from staffroom.
- Recognition language: "recognised for building supportive staffrooms" — not
  "top-rated", "best school", or "award-winning" unless backed by sufficient
  review volume and data.
- Verification: explain the process clearly. Do not use language that implies
  the school "passed" or "failed" a test.
- Partnership proposals: evidence-backed only. No unverified market size claims,
  no projected numbers without a stated basis.

### What to Avoid

- Accusatory or shame-based framing: "Teachers are saying X about your school."
- One-sided framing: "Teachers deserve better." (Public; fine internally.)
- Overselling outcomes: "staffroom will transform your school culture."

---

## 4. Investor and Partner-Facing Materials

Applies to: pitch decks, one-pagers, meeting follow-ups, partnership proposals,
investor updates.

### Rules

- All claims must be data-backed. State the source and date for all numbers used.
- No unverified superlatives: "India's fastest-growing", "the only platform",
  "unmatched coverage" — unless supported by cited data.
- The Glassdoor/Tripadvisor analogy is appropriate here — use it to establish
  the model quickly, then distinguish staffroom's positioning.
- staffroom's moat framing: review density + trust brand + first-mover advantage
  in key cities — not tech (which is replicable in 3–6 months).
- Avoid corporate jargon: "leverage", "synergy", "ecosystem partner", "at scale",
  "unlock", "robust", "seamless".
- staffroom is always lowercase — including in deck titles, slide headers, and
  footnotes.
- Use `ppt-template.pptx` for all decks. Do not freestyle fonts, colours, or
  slide structure outside the template.

### What to Avoid

- Projections stated as facts: "We will reach 1 million teachers by 2027."
- Metrics without context: state both numerator and denominator where relevant
  (e.g., "255 complete reviews out of 635 submitted" — not just "635 reviews").
- Claiming PMF before the threshold is met (≥70% searches yield ≥3 reviews
  in 7 cities).

---

## 5. Social Media — Teacher/School Spotlight Posts

Applies to: Instagram posts, LinkedIn posts (staffroom page), story copy.

### Rules

- Tone: celebration-first, not complaint-first. Highlight what's working.
- Teacher spotlights: use first name only (or anonymised if the teacher has
  not consented to named attribution). Never share identifying details without
  consent.
- School spotlights: only feature schools with sufficient review volume to
  support the claim being made. State the number of experiences.
- Use the Tripadvisor framing — discovery, not grievance.
- No naming/shaming. No "worst schools" content. No negative school rankings.
- Use social templates from `assets/social/` — do not freestyle visual formats.

### What to Avoid

- Clickbait that uses teacher distress: "Why teachers are running away from
  this school."
- Unverified quotes attributed to unnamed teachers.
- Promotional-sounding copy: "The best platform for teachers. Period."

---

## 6. Community Management

Applies to: WhatsApp community replies, Instagram comment responses, DM replies.

### Rules

- Never take sides publicly between a teacher and a school.
- If a specific school is named negatively in a comment: do not engage with
  the specifics; redirect to staffroom's review process.
- Respond to grievances with empathy — acknowledge the feeling, do not
  validate or dispute the claim.
- Do not make promises about outcomes: "We will ensure this school is
  investigated" is not something staffroom can or should say.
- Flag repeat or escalated complaints to Nikhil — do not handle autonomously.

### Template Responses

**When a teacher names a school negatively:**
> "We hear you — your experience matters. The best way to make it count is to
> share it on staffroom, where it becomes part of a verified, trusted record
> that others can learn from."

**When a school contacts with a complaint about a review:**
> "All experiences on staffroom are submitted by verified teachers and reviewed
> against our community guidelines. We take concerns seriously — please write
> to [support email] with details and we will review."

---

## 7. Email and WhatsApp Broadcasts

Applies to: mass teacher outreach, campaign announcements, feature launches,
community updates.

### Rules

- Subject lines (email): specific, factual, low hype. Under 50 characters.
  Avoid: "You won't believe this...", "Important update!!!", "Last chance".
- Opening line: lead with value to the reader. Not "We are excited to
  announce...".
- One main message per broadcast. Do not combine multiple asks.
- CTA: one per message. Clear, specific. "Share an experience" or
  "Explore schools in [city]" — not "Click here".
- WhatsApp: shorter than email. One idea, one CTA, conversational register.
  Under 200 words total.
- staffroom is always lowercase in subject lines, body copy, and signatures.

---

## 8. Internal Documents with External Reach

Applies to: documents that may be shared with investors, partners, advisors, or
press. Not for internal-only working documents.

**Approved templates:**

| Format | File | Use for |
|---|---|---|
| Presentation | `assets/ppt-template.pptx` | All decks shared externally |
| Formal letter | `assets/letterhead.pdf` | Formal correspondence only |

All brand voice and language rules from sections 1–7 apply to these documents.

---

## 9. Before/After Rewrites — Common Violations

### Red flag: "Write a review"
**Before:** "Write a review for your school"
**After:** "Share an experience about your school"

### Red flag: capitalised staffroom
**Before:** "Welcome to StaffRoom"
**After:** "Welcome to staffroom"

### Red flag: accusatory school framing
**Before:** "Schools are not paying teachers fairly — we expose the truth."
**After:** "Real teacher insights help you find workplaces where you're valued."

### Red flag: unverified superlative
**Before:** "India's most trusted school review platform"
**After:** "India's first teacher-powered platform for real insights into school workplaces"

### Red flag: overpromising
**Before:** "staffroom will transform how schools treat teachers."
**After:** "Real teacher insights that help schools strengthen trust — and help teachers make informed choices."

### Red flag: jargon
**Before:** "We leverage teacher-generated insights to unlock school ecosystem transparency at scale."
**After:** "Real teacher experiences, helping great teachers find great schools."

---

## 10. Moderation Rules

For content moderation decisions on submitted reviews — not for external communications.

- A review may be hidden if it violates community guidelines (targeted harassment,
  personal identification of individual staff, unverifiable specific claims,
  discriminatory content).
- A review must never be hidden purely because it is negative about a school.
- All moderation decisions should be explainable with reference to a specific
  guideline — not "it felt wrong".
- Never tell a teacher their review was "rejected" or "failed" — use "We were
  unable to publish this experience" with reference to the guideline it violated.
- Schools cannot request removal of reviews unless they violate community guidelines.
  This is non-negotiable — it is the basis of staffroom's trust model.
