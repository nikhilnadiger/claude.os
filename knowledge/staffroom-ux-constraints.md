---
skills: [product-design, codebase-context]
last_updated: Mar 2026
source: Microsoft Clarity analytics (Mar 2026) + product context
staleness_note: Device/session data refreshes monthly — verify against live Clarity before major design decisions
---

# staffroom — UX Constraints

These are non-negotiable floors for all design and frontend engineering
work. They are derived from real production data, not assumptions.
Any design or implementation that violates them is wrong by definition.

---

## The Constraint Set

### 1. Mobile-First — No Exceptions

- **90% of sessions are on mobile** (Clarity, Mar 2026)
- Design at 360px width first. 360px is the minimum Android viewport in
  production traffic.
- Do not design at 390px (iPhone default) or desktop and adapt down.
- Desktop is a secondary view; mobile is the primary experience.

### 2. Minimum Touch Target: 44×44pt

- Every tappable element must be at least 44×44 logical pixels (pt).
- This includes buttons, links, icons, list items, cards.
- Test in Chrome DevTools at 360px, not just on desktop.
- The most common failure mode: icon-only buttons sized to the icon (~24px),
  not to a safe tap area.

### 3. Device Baseline: Budget Android

staffroom's user base is Indian private school teachers. The dominant
device profile:

- Redmi, Realme, Samsung Galaxy M-series — 3–5 year old mid-range Android
- 3–4GB RAM, octa-core but not flagship performance
- Chrome on Android, not Safari
- Screen size: 5.5–6.5 inches, 360–412px logical width
- Battery-saver mode common on older devices (reduces CPU allocation)

Design and engineering implications:
- No heavy CSS effects: complex box-shadows, backdrop-filter (blur), gradients
  on scroll → these cause jank on mid-range devices
- No JS-heavy interactions that block the main thread
- No large hero images that load eagerly — lazy-load all images

### 4. Animation Budget: ≤0.6 seconds

- All animations must complete in 0.6s or less.
- Longer animations feel broken on slower devices; they also block perceived
  completion of the action.
- framer-motion `m.*` pattern only (lazy-loaded). Never `motion.*` (eager).
- No looping or continuous animations in the main UI (acceptable: skeleton
  shimmer while loading).
- No animations that prevent interaction (a teacher should always be able
  to tap past an animation).

### 5. Network: 2G-Capable

- Minimum network assumption: 2G / slow 3G
- 40–50% of India's private school teacher population is in Tier II/III cities
  and peri-urban areas where 4G is inconsistent
- Even Bengaluru users (44% of sessions) hit 2G-equivalent speeds on congested
  networks during school hours
- Implications:
  - Lazy-load all images. Use placeholder/skeleton while loading.
  - Do not auto-play video.
  - API calls: show loading state immediately. Do not assume instant response.
  - Bundle size: every KB matters. Avoid unnecessary npm packages.
  - `getServerSideProps` renders server-side for initial load — this helps;
    subsequent navigations are client-side.

### 6. Geography: Bengaluru First

- 44% of all sessions come from Bengaluru (Clarity, Mar 2026).
- Primary city for content, GTM, and product focus.
- When designing features that involve city/location context, Bengaluru is
  the primary test case.
- Teacher profile: English-comfortable, aspirational segment dominant.

### 7. Login Page: Highest Drop-Off

- 606 exits from the login page (Mar 2026) — primary conversion problem.
- Any change to authentication UX must reduce friction, not add it.
- OTP flow must be: phone number → OTP → done. Maximum 2 screens.
- OTP UX requirements:
  - Auto-advance between digit fields
  - Paste support (for OTP received via SMS/WhatsApp)
  - Resend option after 30s countdown
  - Digits visible (not masked)
  - Numeric keyboard auto-opens on focus
- Do not add "create an account" flow. Teachers authenticate directly with
  phone number — no password, no email required.

### 8. Review Completion: Mid-Form Drop-Off

- 635 reviews submitted, 255 fully complete (~40% completion rate).
- Drop-off is mid-form — the form is too long or hits a friction point.
- Implications for form design:
  - Show progress indicator throughout the multi-step form
  - Save progress on every step (`POST /short-form/save`)
  - Minimum required fields — every optional field is a potential drop-off
  - Each step: one clear question or section, not a wall of inputs

### 9. WebView / In-App Browser

A significant share of staffroom traffic enters via Instagram Ads or WhatsApp
links (nudges, referrals). These users are in a WebView — Instagram's or
WhatsApp's in-app browser — not real Chrome. WebView behavior differs from
the full browser in ways that directly affect auth, OTP, and external links.

**What changes in a WebView:**
- WhatsApp deep links (e.g., `wa.me/...`) may not open the WhatsApp app.
  A user in Instagram WebView who triggers a WhatsApp OTP cannot switch to
  WhatsApp to retrieve it without losing the session.
- `_system` targets and `window.open(..., '_system')` calls may be silently
  blocked — the button does nothing, no error is shown to the user.
- External app-switching is unreliable; users may not know how to open the
  page in real Chrome.

**Design implication — always assume WebView:**
Any feature involving OTP delivery, external app links, deep links, or
`_system` targets must work correctly for a user trapped in a WebView.
The non-WebView case is a bonus, not the baseline.

**Specific consequences:**
- OTP error copy must not assume the OTP was received. The user may not
  have seen it at all. Copy must guide them out of the WebView first.
- A fix to error copy is NOT independent from a fix to WebView handling.
  If the WebView issue is unresolved, better copy alone will not fix the
  user experience.
- External link CTAs must show a visible fallback instruction when
  `_system` is blocked (e.g., "Tap ··· → Open in [Chrome/Safari]").
  This instruction must always be visible, not only on error.
- Test any auth or link flow by manually entering the page URL inside
  Instagram or WhatsApp — real Chrome behaviour is not a valid proxy.

---

## Constraint Application Protocol

When a proposed design or implementation would violate a constraint:

1. **Stop.** Do not proceed with the violation.
2. **Flag it explicitly**: state which constraint is violated and where.
3. **Offer Option A first**: a solution that stays within all constraints.
4. **If Option B (constraint-adjacent) is genuinely necessary**: present it
   with clear pros, cons, and risks. Wait for Nikhil's explicit approval
   before proceeding.

"It looks better" or "it's a small violation" is not sufficient justification.
Constraints exist because of real production data, not aesthetic preference.

---

## Constraint Summary Table

| Constraint | Value | Source |
|---|---|---|
| Mobile sessions | 90% | Clarity, Mar 2026 |
| Minimum viewport | 360px | Lowest Android width in production |
| Touch target minimum | 44×44pt | Apple HIG / Google Material |
| Animation maximum | 0.6s | Device performance baseline |
| Network baseline | 2G / slow 3G | Tier II/III India + congested urban |
| Primary city | Bengaluru (44% of sessions) | Clarity, Mar 2026 |
| Login page exits | 606 | Clarity, Mar 2026 |
| Review completion | ~40% (255/635) | Neon DB, Mar 2026 |
