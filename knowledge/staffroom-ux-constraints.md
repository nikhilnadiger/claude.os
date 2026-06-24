---
skills: [product-design, codebase-context]
last_updated: June 2026
source: Microsoft Clarity analytics (Jun 2026, last 30 days May 25–Jun 24) + Clarity session recordings (Apr 2026) + product context
staleness_note: Device/session data refreshed Jun 24 2026. Session recordings still from Apr 2026 — behavioral observations are stable even if counts changed.
---

# staffroom — UX Constraints

These are non-negotiable floors for all design and frontend engineering
work. They are derived from real production data, not assumptions.
Any design or implementation that violates them is wrong by definition.

---

## The Constraint Set

### 1. Mobile-First — No Exceptions

- **97.7% of sessions are on mobile** (Clarity, Jun 2026, 6,649 of 6,805 sessions) — up from 95.6% in May, 90% in Apr
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
- **Confirmed from recordings:** Users tap non-interactive school page elements
  — "(X+ years exp.)" badges, "Have you worked here recently?" text, designation
  labels — expecting them to be tappable. If an element looks interactive, it
  must be interactive. If it is purely informational, its visual design must
  not invite tapping.

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
- Even Bengaluru users (~31% of sessions) hit 2G-equivalent speeds on congested
  networks during school hours
- Implications:
  - Lazy-load all images. Use placeholder/skeleton while loading.
  - Do not auto-play video.
  - API calls: show loading state immediately. Do not assume instant response.
  - Bundle size: every KB matters. Avoid unnecessary npm packages.
  - `getServerSideProps` renders server-side for initial load — this helps;
    subsequent navigations are client-side.

### 6. Geography: Delhi/NCR First, Bengaluru Second

- **Delhi/NCR is 44.1% of all sessions** (Clarity, Jun 2026) — New Delhi (24.8%) + Delhi (10.3%) + Gurugram (4.4%) + Noida (2.7%) + Faridabad (2%). This is a structural shift, not a spike.
- Bengaluru is 19.6% of sessions (Jun 2026) — down from 31% in Apr 2026. Still the #2 city.
- When designing features involving city/location context, NCR is now the primary test case.
- Teacher profile in NCR: Hindi-comfortable, private school teachers at mid-range schools (DPS, Delhi International, Suncity etc).
- City-agnostic features are increasingly important as reviews and traffic are now meaningfully multi-city.

### 7. Login Page: Drop-Off Significantly Reduced by Magic Token

- **Jun 2026: 145 login exits** (down from 552 in May, 662 in Apr). The 74% drop is primarily structural: HMAC magic token (deployed Jun 22 2026) silently authenticates users arriving via nudge links without requiring the OTP flow — they bypass the login page entirely.
- Login page is still a friction point for users not arriving via nudge links (paid ads, organic, direct).
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

**Recording-confirmed patterns at login drop-off (Apr 2026 — still applies to non-nudge traffic):**
- Dead click near "Join the staffroom!" heading before OTP form loads — users
  tap static text expecting it to be interactive
- WebView users (Instagram/WhatsApp in-app browser) arrive at OTP screen but
  cannot switch to WhatsApp to retrieve the code without losing the session
- Pure bounces from Meta paid ads — teachers see the login requirement as a wall

### 8. Review Completion: Mid-Form Drop-Off (Improving)

- **Jun 2026: 1,473 submitted, 727 fully complete (49.4% full completion rate)** — up from 40% in Apr 2026.
- Live review rate: 1,033 of 1,473 = 70.1% (workedRecently + overallExperience present).
- Full completion of those who are live: 70.4%.
- Drop-off still happens mid-form between "live" and "full completion". Mid-stage data (Benefits, Expenses, Ease of working) not re-queried — specific stage with highest drop-off unknown.
- Implications for form design:
  - Show progress indicator throughout the multi-step form
  - Save progress on every step (`POST /short-form/save`)
  - Minimum required fields — every optional field is a potential drop-off
  - Each step: one clear question or section, not a wall of inputs
- **Recording-confirmed (Apr 2026):** One real user successfully completed the entire review
  flow from a Meta paid ad. Experienced one dead click at the "Back/Next" button
  junction (tapped between the buttons). The buttons must have a gap or be
  visually distinct enough that the tap target for each is unambiguous.

### 9. WebView / In-App Browser

A significant share of staffroom traffic enters via Instagram Ads or WhatsApp
links (nudges, referrals). These users are in a WebView — Instagram's or
WhatsApp's in-app browser — not real Chrome. WebView behaviour differs from
the full browser in ways that directly affect auth, OTP, and external links.

**What changes in a WebView:**
- WhatsApp deep links (e.g., `wa.me/...`) may not open the WhatsApp app.
  A user in Instagram WebView who triggers a WhatsApp OTP cannot switch to
  WhatsApp to retrieve it without losing the session.
- `_system` targets and `window.open(..., '_system')` calls may be silently
  blocked — the button does nothing, no error is shown to the user.
- External app-switching is unreliable; users may not know how to open the
  page in real Chrome.

**Recording-confirmed:** Multiple login drop-off sessions show teachers arriving
from Instagram/WhatsApp, reaching the OTP screen, clicking in the blank area
around the OTP input (dead click), and exiting. The dead click is a symptom —
the root cause is they cannot retrieve the OTP from within the WebView.
One highly engaged user (34-minute session) did successfully switch apps and
return — high intent overcomes friction for motivated users.

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
| Mobile sessions | ~90% | Clarity, Apr 2026 |
| Minimum viewport | 360px | Lowest Android width in production |
| Touch target minimum | 44×44pt | Apple HIG / Google Material |
| Animation maximum | 0.6s | Device performance baseline |
| Network baseline | 2G / slow 3G | Tier II/III India + congested urban |
| Primary city | Bengaluru (~31% of sessions, down from 44%) | Clarity, Apr 2026 |
| Login page exits | 662 | Clarity, Apr 2026 |
| Review completion | ~40% (336/838 submitted) | Neon DB, Apr 2026 |
