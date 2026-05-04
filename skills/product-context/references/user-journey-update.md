---
last_updated: April 2026
maintained_by: Nikhil Nadiger
purpose: >
  Workflow for updating knowledge/staffroom-user-journey.md to reflect the
  current production codebase. Triggered by "update user journey" or
  "refresh user journey". Do not run unless explicitly triggered.
---

# User Journey Update Workflow

## Purpose

`knowledge/staffroom-user-journey.md` is a verified, codebase-derived reference.
It must stay in sync with the production codebase. Run this workflow when
Nikhil asks to update or refresh the user journey document.

## Pre-flight

1. Note the current version number and "Codebase last verified" date in
   the document header — these will be updated at the end.
2. Confirm the codebase path: `/mnt/GitHub/staffroom-v2`
3. Read `knowledge/staffroom-user-journey.md` in full before starting.

---

## Section Map — What to Read per Section

Each section of the document maps to specific codebase files. Read only
the files relevant to sections that may have changed, or read all for
a full update.

### Section 1 — User Types
**Files to check:**
- `backend-nest/src/auth/` — auth service, OTP logic, session handling
- `backend-nest/src/user/` — user lookup, account linking (old → new OTP system)
- Check: 7-day session window, profile completeness check, old-account linking logic

### Section 2 — Entry Points
**Files to check:**
- `pages/login.tsx` or equivalent — WebView detection logic, banner conditions
- `pages/referral.tsx` — referral redirect logic
- `pages/nudge/go.ts` or equivalent — nudge click handler
- `backend-nest/src/tracking/` — session landing recording
- Check: which browsers trigger WebView banner, referral code handling,
  nudge click recording, sitemap for SEO entry points

### Screen 1 — Landing Page (`/`)
**Files to check:**
- `pages/index.tsx` — landing page component
- School list query / ranking logic (backend)
- Check: auth redirect behavior (now client-side via useEffect, not server-side),
  homepage section structure (linear sections replaced the old tab layout),
  search bar behavior, Top Schools ranking logic, sticky navbar

### Screen 2 — Login Page (`/login`)
**Files to check:**
- `pages/login.tsx` (or auth page component)
- `backend-nest/src/auth/auth.service.ts` — OTP send, verify, rate limits
- Check: OTP send flow, rate limits (5 per 5 min), 5-minute expiry,
  profile step conditions, Meta CompleteRegistration event, referral
  code handling during sign-up, error message copy

### Screen 3 — Home Page (`/home`)
**Files to check:**
- `pages/home.tsx` — home page component
- Check: auth guard behavior (`/home` has no auth guard as of May 2026 — `hideAuthOverlay={true}`),
  Career Insights section unlock states, bottom nav items, hamburger menu options

### Screen 4 — School Profile (`/school/[slug]`)
**Files to check:**
- `pages/school/[...slug].tsx` or equivalent
- `backend-nest/src/schools/` — school lookup cascade, teacher count logic
- `backend-nest/src/reviews/` — review fetch, salary range computation
- Check: school URL cascade (Place ID → internal ID → Google Places),
  review display (no approval gate), salary range groupings,
  teacher count lookup (UDISE dataset), CTA states (3 states),
  insight card states (4 states), share recording

### Screen 5 — Share Experience / Review Form (`/share-experience`)
**Files to check:**
- `pages/share-experience.tsx` or stepper form component
- `backend-nest/src/stepper/` or review submission service
- Check: gate question options, step sequence, auto-save behavior,
  completion state labels (s0_only / s1_complete / s2_step2_complete / full_complete),
  Reveal A and Reveal B cards, SalaryContextCard trigger,
  immediate live publish (no approval gate), badge award logic

### Screen 6 — Profile Page (`/profile`)
**Files to check:**
- `pages/profile.tsx` — profile page component
- `backend-nest/src/user/` — user data, saved schools, badge status
- Check: avatar badge display, "Member since" placeholder behavior,
  referral stats fields, saved schools display, review card states
  (Complete / In Progress / Not live), insight card states (3 states)

### Screen 7 — Referral Redirect (`/referral`)
**Files to check:**
- `pages/referral.tsx` — redirect logic
- Check: code validation rules (4–32 chars, alphanumeric),
  redirect destinations, session storage of code, referrer count increment

### Section 5 — Career Insights
**Files to check:**
- Career insights component(s) — wherever the 5 cards are rendered
- `backend-nest/src/insights/` or equivalent
- Check: card titles and metrics, unlock progression logic,
  platform data recompute frequency, multi-school switcher,
  Contributor's Voice badge timing and double-award protection

### Section 6 — Nudge System
**Files to check:**
- `backend-nest/src/nudge/` — nudge service, queue tables, processors
- D1 schema for nudge queue tables
- Check: which nudge types are active (have queue processors) vs. stale,
  exact trigger conditions per nudge type, 5-minute cron cadence,
  nudge link handler (`/nudge/go`) recording behavior

### Section 7 — Unreachable Features
**Files to check:**
- `pages/` — scan all page files for existence
- Navigation components — confirm which pages are linked from nav
- Sitemap config — confirm which pages are included
- Check: `/whatsapp-verification`, `/about`, `/blogs`, `/dashboard` — still unreachable? Any new orphans?
- Note: `nearby` tab and `/secondhome` were removed as of May 2026 — do not expect them in the pages directory

### Section 8 — System Behaviors & Known Limitations
**Files to check:**
- WebView detection logic (check user agent strings detected)
- Session management — cookie + localStorage + app memory handling,
  sign-out behavior (client-only vs. server token invalidation)
- External analytics: Microsoft Clarity, Meta Pixel, Google Ads, Umami —
  confirm all still active in production config

### Section 9 — Error Reference
**Files to check:**
- Auth error messages in backend auth service and frontend
- School profile error messages
- Review form error / silent-failure behavior
- Check all error message strings match what is shown to users

---

## Update Rules

1. **Read before writing.** Confirm a change exists in the codebase before
   updating the document. Do not infer from context — verify from code.
2. **Update only changed sections.** Do not rewrite sections that haven't changed.
3. **Preserve the document's plain-language style.** No technical jargon,
   no code references visible to the reader. The document is written for a
   product/user lens, not an engineering lens.
4. **Tables stay as tables.** Do not convert table content to prose.
5. **Update the document header on completion:**
   - Increment version: minor bump (e.g., 1.1 → 1.2) for partial updates,
     major bump (e.g., 1.x → 2.0) only if more than 30% of content changed
   - Update `Codebase last verified` to today's date (format: DD Month YYYY)
   - Update `Built from` if branch or repo name has changed

## After Updating

- Report to Nikhil: which sections were changed and what changed in each
- Note any new known limitations or gaps discovered during the review
- If any section could not be verified (file not found, logic unclear):
  flag it explicitly — do not leave stale content without noting the gap
