---
skills: [product-design]
last_updated: Mar 2026
source: staffroom design principles + product context
---

# Design Process

## Principle: Functional Completeness First

Before any work on visual polish, animation, delight, or brand expression,
the design must function correctly for the user's goal. In priority order:

1. **Functional** — the user can complete their task
2. **Usable** — the task is completable without confusion or error
3. **Accessible** — the task is completable under staffroom's constraint set
   (mobile, 2G, budget Android — see `staffroom-ux-constraints.md`)
4. **Brand-aligned** — voice, colour, typography consistent with brand
5. **Delightful** — motion, micro-interactions, polish

Never work on layer 4 or 5 before layers 1–3 are solid.

---

## Design Phases

### Phase 1: Define

Before opening Figma or sketching:

- **Who is using this?** Identify the teacher segment (Government low-income/rural,
  Private low-income, Private aspirational/experienced — see
  `staffroom-teacher-insights.md`). Most traffic is urban, educated,
  smartphone-literate but Android-primary. Never design for iOS as the default.
- **What is the job-to-be-done?** One sentence: "When [situation], the teacher
  wants to [goal], so they can [outcome]."
- **What does success look like?** Define the metric before designing.
  For example: reduced login page exits (currently 606), improved review
  completion rate (currently ~40%).
- **What are the constraints?** Load `staffroom-ux-constraints.md`.
  Confirm all hard floors before starting.

### Phase 2: Map the Flow

Sketch the user journey at the task level, not the screen level:

1. Entry point — how does the teacher arrive at this flow?
2. Steps — what decisions or actions must they take?
3. Exit — what does completion look like? What does abandonment look like?
4. Error states — what happens if something goes wrong?

Keep flows to the minimum number of steps. Every additional step is a
drop-off risk. Current review completion is 40% — mid-form drop-off is
the primary loss point.

### Phase 3: Structure

Define information architecture before visual design:

- What information must be on this screen?
- What is the hierarchy? (Primary content → secondary → tertiary)
- What actions are available? What is the primary CTA?
- What is the empty state? What is the loading state? What is the error state?

Do not skip empty/loading/error states. They are part of the design.

### Phase 4: Design

Mobile-first. Start at 360px width (minimum Android viewport in production
traffic). Do not design at 390px (iPhone default) or wider first.

**Layout principles:**
- Single-column on mobile. Avoid side-by-side content unless the content
  is inherently comparative.
- Critical actions in the bottom two-thirds of the screen (thumb reach zone
  on a phone held in one hand).
- Sticky CTAs for multi-step flows — teacher should never need to scroll
  to find what to tap next.
- Cards over tables — tables don't work at 360px.

**Typography:**
- Minimum 16px body text (14px acceptable for secondary/metadata only).
- High contrast — WCAG AA minimum (4.5:1 for body text, 3:1 for large text).
- Avoid all-caps for body content. Acceptable for labels only.

**Inputs:**
- 44×44pt minimum touch target — non-negotiable.
- Full-width inputs on mobile — do not split a form row into two fields.
- Show keyboard type on input focus (`inputMode="tel"` for phone, `"numeric"`
  for numbers).
- Auto-advance OTP fields where possible (reduces login friction).

### Phase 5: Validate

Before treating a design as complete:

- [ ] Does it work at 360px width?
- [ ] Can a teacher on a 3-4 year old Android phone (Redmi, Realme, Samsung
      M-series) use this without jarring lag?
- [ ] Are all touch targets ≥44×44pt?
- [ ] Is all text ≥16px body / ≥14px secondary?
- [ ] Does every state exist? (Empty, loading, error, success)
- [ ] Does the flow have the minimum number of steps?
- [ ] Have you tested the critical path on a real device or Chrome DevTools
      360px mobile emulation?
- [ ] If animation is present: duration ≤0.6s, no animation that blocks
      interaction?
- [ ] Does any image load eagerly? (It shouldn't — lazy-load all images)

---

## Figma Conventions

- Work in the staffroom Figma file (link in `references.md`)
- Frame size: 390px (iPhone 14 Pro default) is acceptable in Figma as long
  as designs are verified at 360px before handoff
- Use Auto Layout for all components — avoids fixed-position bugs on
  different screen heights
- Component variants for: default, hover/active, loading, error, empty, disabled
- Spacing scale: 4px base unit. Use multiples of 4 (4, 8, 12, 16, 24, 32, 48)
- Colours from `brand-custodian/references/visual-identity.md` palette only

---

## Handoff to Engineering

When a design is ready for implementation:

1. Confirm all states are in Figma (default, loading, error, empty, success)
2. Annotate interaction details not obvious from static frames:
   - Tap area sizes where non-obvious
   - Animation specs (type, duration, easing)
   - Scroll behaviour (sticky elements, scroll depth)
3. Note any deviation from standard components (see `component-standards.md`)
4. Flag any new API data requirements — coordinate with product-context/
   engineering-review before handoff
5. Specify responsive breakpoints if the design has a tablet/desktop view
   (rare — most staffroom screens are mobile-only)
