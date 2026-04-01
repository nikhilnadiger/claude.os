---
skills: [product-design]
last_updated: Mar 2026
source: staffroom product + codebase patterns (verified Mar 2026)
---

# Component Standards

Patterns confirmed in the staffroom codebase. Use these as the default
choice before proposing anything new. Introducing a new component type
requires justification — the codebase and the user base both benefit from
consistency.

---

## Navigation

**Bottom navigation bar** — primary nav on mobile. Do not use a hamburger
menu as the primary navigation pattern; it adds a tap that erodes
discoverability.

- 3–5 items maximum
- Icon + label (icon alone fails for new users)
- Active state must be visually unambiguous (colour + weight, not just colour)
- Touch targets: full bar height × tab width, minimum 44pt tall

**Back navigation** — system back (Android) must always work correctly.
Do not intercept back navigation without a strong reason. If you do intercept
(e.g., confirm before discarding a form), test it explicitly.

---

## Forms

Multi-step review submission uses two confirmed form components:

- `GroupedStepperForm` — grouped question flow
- `SectionWiseShortForm` — section-by-section flow

Both in `pages/share-experience.tsx`.

**Form design rules:**

- One primary action per screen/step
- Show progress indicator on multi-step flows (teacher needs to know how
  much is left — mid-form drop-off is the primary completion problem)
- Save progress on each step (`POST /short-form/save`) — teachers may lose
  connection or switch apps mid-form
- Full-width inputs — do not place two inputs side by side on mobile
- Labels above inputs, not inside (placeholder text disappears on focus —
  not accessible)
- Inline validation — show errors immediately on blur, not on submit
- Required fields: mark clearly; prefer minimal required fields to reduce
  drop-off
- Keyboard types: `inputMode="tel"` for phone, `"numeric"` for numbers,
  `"email"` for email

**OTP input:**

- 4 or 6 digit OTP fields: auto-advance between digits
- Paste support: detect paste event and fill all fields
- Resend OTP: show after 30s countdown, not immediately
- Do not hide OTP field as password — teacher needs to see what they typed

---

## Cards

Primary content unit for school profiles, search results, top-rated lists.

- Full-width on mobile (no side-by-side cards at 360px)
- Tap target covers the entire card
- Consistent structure: school name (large, prominent), location, key metric
- Aggregate scores: show as a number + label, not just a star rating
  (stars alone don't convey what's being rated — salary? management? culture?)
- Do not truncate school names — Indian school names are long and teachers
  know their school's full name

---

## Search

School search on `/home`:

- Autofocus on search input where UX context allows (reduces one tap)
- Debounce input before sending `POST /search/resolve` — do not fire on
  every keystroke
- Show loading state while fetching results
- Empty state for no results: helpful, not a dead end (suggest alternate
  spelling, offer to add a school)
- Recent searches: display if the teacher is authenticated and has past searches
- Results show: school name, location, score summary — enough to identify
  the school without tapping in

---

## School Profile

Page: `/school/[slug]`

- School name and location: above the fold
- Aggregate scores: visible without scrolling on mobile
- Teacher count: show with context ("X teachers in [area]") — not a raw number
- Experiences (reviews): paginated, most recent first
- Each experience: category label + content, anonymised, no teacher identifier
- Loading state: skeleton screens (not spinner) — better perceived performance
  on slow connections
- Error state: school not found → clear message, suggest search

---

## Animations

staffroom's user base skews budget Android. Animation must not create
lag or perceived jank.

| Rule | Value |
|---|---|
| Maximum duration | 0.6s |
| Library | framer-motion, `m.*` pattern (lazy-loaded) |
| Import pattern | `import { m } from 'framer-motion'` — NOT `motion.*` |
| Wrap with | `<AnimatePresence>` for enter/exit |
| Never | Auto-play video, parallax, continuous looping animations |
| Prefer | Fade + translate (simple, low GPU cost) over scale/blur |

`motion.div` loads the full framer-motion bundle eagerly. `m.div` is
lazy-loaded. On low-end devices, the difference is measurable. Always
use `m.*`.

---

## Loading States

- **Skeleton screens** over spinners for content-heavy pages (school profile,
  search results) — better perceived performance
- **Inline spinner** for single-action loading (form submit, OTP verify)
- **Progress bar** for file upload (if applicable)
- Never block the entire screen with a loading overlay unless the operation
  is truly blocking and cannot be backgrounded

---

## Error States

Three types:

1. **Inline field error** — form validation. Show immediately on blur.
   Red colour + error message below the field. Do not use red border alone
   (colour-blind accessibility).
2. **Toast / snackbar** — for transient errors (API call failed, network
   error). Auto-dismiss after 4–5s. Bottom of screen on mobile.
3. **Full-page error** — for fatal states (page not found, critical API
   failure). Show a meaningful message + a clear recovery action (go home,
   try again). Never show a raw error code or stack trace to teachers.

---

## Empty States

Every list, feed, or data view needs an empty state. It must:

- Explain why it's empty (in plain language)
- Tell the teacher what to do next (CTA where appropriate)
- Not be a dead end

Examples:
- Search with no results: "We couldn't find [school name]. Check the spelling
  or add this school."
- No reviews yet: "Be the first to share your experience at this school."
- No searches yet: show the search bar prominently, maybe a top-rated list
  as a starting point

---

## Typography Hierarchy

| Element | Size | Weight | Notes |
|---|---|---|---|
| Page title / H1 | 24px | Semibold | One per page |
| Section heading / H2 | 18–20px | Semibold | |
| Card title / H3 | 16–18px | Medium | |
| Body text | 16px | Regular | Minimum for readable body copy |
| Secondary / metadata | 14px | Regular | Location, date, labels |
| Caption | 12px | Regular | Use sparingly — may be unreadable on small screens |

Do not go below 12px for any visible text. Do not use 12px for critical
information.

---

## Colour Application

Full palette and semantic colour definitions in
`brand-custodian/references/visual-identity.md`. Always read from that source
— never recall hex values from memory.

### Brand Colours — UI Application

| Colour | Hex | UI Application |
|---|---|---|
| Deep Forest Green | #043630 | Primary CTA background, active nav indicator, branded headers |
| Dark Teal | #004D43 | Secondary backgrounds, depth on dark surfaces |
| Warm Cream | #E6D7B6 | Warm card backgrounds, highlighted sections |
| Soft Mint | #F1FEF8 | Default page/surface background, near-white areas |
| Lime Accent | #D0FF71 | Accent highlights, emphasis on dark backgrounds |

**Text on light surfaces (Soft Mint / Warm Cream):** Use Deep Forest Green
(#043630) — confirm 4.5:1 contrast against the specific background.
**Text on dark surfaces (Forest Green / Dark Teal):** Use Soft Mint (#F1FEF8)
or Warm Cream (#E6D7B6).

### Semantic Colours — State Usage (UI only)

These are for product UI states only — never in marketing assets or social
content. Source: `brand-custodian/references/visual-identity.md`.

| State | Hex | Apply to |
|---|---|---|
| Success | #3D9970 | Confirmation messages, submitted states, check icons |
| Error | #C04B3A | Validation errors, required field warnings, failure alerts |
| Loading / WIP | #E8D485 | Skeleton screens, pending badges, in-progress indicators |
| Neutral / Disabled | #9E9E96 | Disabled buttons, placeholder text, secondary metadata |

**Error states:** Never use Deep Forest Green (#043630) for error states — it
is the primary brand colour and its use for errors creates ambiguity.

### Codebase Divergence Note

The frontend currently renders `#214838` in some places where `#043630` is
canonical. This is a known divergence. Do not introduce `#214838` in new
design output — always use `#043630`. Flag for correction in the next design
system pass.

Contrast requirement: WCAG AA — 4.5:1 for body text, 3:1 for large text
(24px+ or 18.67px bold+).
