---
skills: [product-design, codebase-context]
last_updated: June 2026
source: >
  Microsoft Clarity analytics (Jun 2026, last 30 days May 25–Jun 24) +
  Clarity session recordings (Apr 2026) + Apple WebKit documentation +
  Google Web Fundamentals + MDN Web Docs + dontkillmyapp.com +
  WCAG 2.1 specification + Android developer documentation +
  OpenSignal India Mobile Network Experience Report 2024 +
  IDC India Smartphone Quarterly Tracker Q1 2026 +
  Counterpoint Research India Mobile Trends 2025
staleness_note: >
  Clarity data refreshed Jun 24 2026. Session recordings still Apr 2026 —
  behavioural observations are stable even if counts changed. Device market
  share data from IDC/Counterpoint Q1 2026. iOS/Safari bugs from WebKit
  tracker — verified against Safari 15–18 release notes.
---

# staffroom — UX Constraints

These are non-negotiable floors for all design and frontend engineering
work. They are derived from real production data, not assumptions.
Any design or implementation that violates them is wrong by definition.

---

## The Constraint Set

### 1. Mobile-First — No Exceptions

- **97.7% of sessions are on mobile** (Clarity, Jun 2026, 6,649 of 6,805
  sessions) — up from 95.6% in May, 90% in Apr.
- **iOS is 36% of mobile sessions** — not a minority. Constraints must be
  met for both Android (Chrome/WebView) and iOS (Safari/WKWebView).
- The **minimum supported CSS viewport width is 320px** (iPhone SE 1st gen,
  iPhone 5/5s/5c — still in production use among teachers in 2026).
  Design is optimised for 360px (Android floor) but must not break at 320px.
- Do not design at 390px (iPhone default) or desktop and adapt down.
- Desktop is a secondary view; mobile is the primary experience.
- Do not assume a physical keyboard exists. Every interaction must be
  completable with a touchscreen alone.

### 2. Minimum Touch Target: 48×48pt

- Every tappable element must be at least **48×48 logical pixels** (CSS px).
- This includes buttons, links, icons, list items, cards, form controls.
- **Gap between adjacent interactive elements: minimum 8px.** This prevents
  accidental activation of the wrong target (confirmed: Back/Next button
  dead-click at their gap, Apr 2026 recordings).
- **No interactive element within 20px of the left or right screen edge**
  at the 360px viewport. Screen guard films reduce touch sensitivity at
  edges; cracked screens create dead zones near cracks that statistically
  cluster near edges and corners.
- Test in Chrome DevTools at 360px, not on desktop.
- The most common failure mode: icon-only buttons sized to the icon (~24px).
- **Revised up from 44pt**: XDA Forums and dontkillmyapp.com community data
  confirm that budget screen guards (Redmi, Realme) and oleophobic coating
  wear require a larger safe tap area than Apple's HIG 44pt floor.
- **Recording-confirmed:** Users tap non-interactive elements — "(X+ years
  exp.)" badges, "Have you worked here recently?" text, designation labels —
  expecting them to be tappable. If it looks interactive, it must be. If it
  is informational, its visual design must not invite tapping.

### 3. Device Baseline: Full Spectrum

staffroom runs on every Android and iOS device a private school teacher
in India owns. Design at the constraint floor; everything above benefits
automatically.

**Android floor (worst-case capable Android):**
- Device: itel A23S / Lava Blaze 1 (360px CSS width)
- RAM: 2GB with Android Go
- CPU: 1.4GHz quad-core; 4× CPU throttle under battery saver
- Android version: Android 10 Go (API 29)
- Browser: Chrome 80–90 (WebView version frozen on Android Go)
- GPU: no hardware compositor — avoid `filter: blur()`, `backdrop-filter`,
  multi-layer `box-shadow`, and heavy CSS gradients on scroll

**iOS floor (worst-case capable iOS):**
- Device: iPhone SE 1st gen (2016) — 320px CSS width, 2GB RAM
- iOS version: iOS 12 (last supported iOS for SE 1st gen)
- Browser: Safari 12 (WebKit)
- Many modern CSS features unavailable — see Constraint 10 for specifics

**Dominant production profiles (Clarity Jun 2026):**
- vivo (23%) — FuntouchOS/OriginOS; aggressive background kill
- Samsung (14%) — Galaxy M-series; OneUI; Samsung Internet 0.81% sessions
- OPPO/Realme (13%) — ColorOS; aggressive battery management
- Redmi/Xiaomi (leading brand) — MIUI; highest background-app kill rate

**OEM skin behaviours that affect staffroom:**
- MIUI (Xiaomi/Redmi): kills background tabs; page may be fully reloaded on
  app-switch back. State must be saved server-side (see Constraint 12).
- ColorOS (OPPO/Realme): similar background kill; also overrides system font.
- OneUI (Samsung): more conservative; generally safe.
- FuntouchOS (vivo): battery optimiser may suspend background JS timers.
- Source: dontkillmyapp.com, verified Jun 2026.

**Engineering implications:**
- No `backdrop-filter`, `filter: blur()` — jank on Chrome 80 and GPU-less
  devices.
- No JS-heavy interactions on the main thread.
- No large hero images loaded eagerly — lazy-load everything below the fold.
- No `position: sticky` with `z-index` stacking on Android 10 — known
  compositor bug in Chrome 80.
- `will-change: transform` only on actively animating elements; remove after
  animation completes. Overuse degrades compositing memory on 2GB devices.

### 4. Animation Budget: ≤0.6 Seconds

- All animations must complete in **0.6s or less**.
- Longer animations feel broken on slower devices and block perceived
  completion of the action.
- **CSS transitions only** — never JS-based `setInterval` or `requestAnimationFrame`
  loops. CSS transitions run on the compositor thread and are not degraded by
  the 4× CPU throttle in battery-saver mode. JS animation loops are.
- `prefers-reduced-motion: reduce` is **mandatory** — when set, skip all
  animations entirely (no 0.6s compromise; zero duration).
- framer-motion: use `m.*` pattern only (lazy-loaded). Never `motion.*`
  (eager). Always pair with `useReducedMotion()` check.
- No looping or continuous animations in the main UI. Exception: skeleton
  shimmer while loading is acceptable.
- No animations that prevent interaction. A teacher must always be able to
  tap past an animation.

### 5. Network: 2G to Offline

- **Minimum network assumption: 2G / EDGE (~120 kbps effective throughput).**
- 40–50% of India's private school teacher population is in Tier II/III
  cities and peri-urban areas where 4G is inconsistent (OpenSignal 2024).
- Even Delhi/NCR users (44.1% of sessions) hit 2G-equivalent speeds on
  school Wi-Fi during working hours — the entire school is on one router.
- **Data saver mode**: Android Chrome and Samsung Internet enable data saver
  by default on budget devices. Images are compressed server-side by Google.
  Do not assume image fidelity. Do not rely on high-res images for UI logic.
- **Intermittent connectivity**: Teachers submit form steps from school
  corridors where signal cuts out mid-flow. Each form step must save
  independently before the user advances (see Constraint 12).
- **Offline**: App need not be fully offline-capable, but it must not lose
  filled form data if connectivity drops momentarily and then recovers.
  The error state for a failed API call must be recoverable (retry, not
  forced restart).

Engineering implications:
- Lazy-load all images. Show skeleton/placeholder while loading.
- Do not auto-play video.
- Show loading state immediately on any API call. Do not assume instant
  response.
- **Total JS bundle: ≤200KB gzipped** for the initial page load.
- `getServerSideProps` renders server-side for initial load — use this;
  subsequent navigations are client-side.
- Implement `stale-while-revalidate` for read-heavy pages (school profiles).
- API timeout: set explicit 10s timeout on all client fetch calls; show
  error state with retry CTA — never hang silently.

### 6. Geography: Delhi/NCR First, Bengaluru Second

- **Delhi/NCR is 44.1% of all sessions** (Clarity, Jun 2026) — New Delhi
  (24.8%) + Delhi (10.3%) + Gurugram (4.4%) + Noida (2.7%) + Faridabad (2%).
  This is a structural shift, not a spike.
- Bengaluru is 19.6% of sessions (Jun 2026).
- NCR teacher profile: Hindi-comfortable, private school, mid-range schools.
- City-agnostic features are increasingly important as the platform scales.
- Hindi text rendering must be correct at all font sizes. Do not size text
  assuming Latin characters only — Hindi glyphs at small sizes on TN LCD
  panels (common in budget devices) lose legibility fast.
- When designing inputs that accept school names or city names: assume mixed
  Hindi/English input. Do not force Latin only.

### 7. Login Page: Drop-Off Significantly Reduced by Magic Token

- **Jun 2026: 145 login exits** (down from 552 in May, 662 in Apr). The 74%
  drop is primarily structural: HMAC magic token (deployed Jun 22 2026)
  silently authenticates users arriving via nudge links without requiring OTP.
- Login page remains a friction point for users not arriving via nudge links
  (paid ads, organic, direct).
- Any change to authentication UX must reduce friction, not add it.
- OTP flow must be: phone number → OTP → done. Maximum 2 screens.
- OTP UX requirements:
  - Auto-advance between digit fields on input
  - Paste support (for OTP received via SMS/WhatsApp)
  - Resend option after 30s countdown
  - Digits visible (not masked)
  - Numeric keyboard auto-opens on focus
  - **iOS: use `type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code"`**
    — NOT `type="number"` (iOS spins a scroll wheel instead of numpad).
    The `autocomplete="one-time-code"` attribute enables iOS to auto-suggest
    OTPs from SMS. This is required — see Constraint 11.
- Do not add "create an account" flow. Teachers authenticate directly with
  phone number — no password, no email required.

**Recording-confirmed patterns (Apr 2026 — still applies to non-nudge traffic):**
- Dead click near "Join the staffroom!" heading — users tap static text
  expecting it to be interactive.
- WebView users (Instagram/WhatsApp) arrive at OTP screen but cannot switch
  to WhatsApp to retrieve the code without losing the session.
- Pure bounces from Meta paid ads — teachers see login as a wall.

### 8. Review Completion: Mid-Form Drop-Off (Improving)

- **Jun 2026: 1,473 submitted, 727 fully complete (49.4% completion rate)**
  — up from 40% in Apr 2026.
- Live review rate: 1,033 of 1,473 = 70.1%.
- Drop-off still happens mid-form between "live" and "full completion".
- Implications for form design:
  - Show progress indicator throughout the multi-step form.
  - Save progress on every step server-side (`POST /short-form/save`).
  - Minimum required fields — every optional field is a potential drop-off.
  - Each step: one clear question or section, not a wall of inputs.
  - All form fields must meet Constraint 11 (input requirements) and
    Constraint 12 (session state persistence).
- **Recording-confirmed (Apr 2026):** One real user completed the entire
  flow from a Meta paid ad. Experienced one dead click at the Back/Next
  button junction (tapped between buttons). Buttons must have ≥8px gap
  or be visually distinct enough that each tap area is unambiguous.

### 9. WebView / In-App Browser

**84.74% of staffroom sessions are in a WebView** (Clarity blank-browser,
Jun 2026) — the dominant runtime, not an edge case. Instagram is 60.4% of
traffic source. WebView splits into two fundamentally different engines:

**Android WebView (Instagram, WhatsApp on Android):**
- Engine: Chromium-based, but **version is frozen to the Android WebView
  system component version** — typically 2–4 major versions behind
  stable Chrome.
- On Android 10 Go devices: WebView may be as old as Chrome 80.
- Missing APIs vs current Chrome: Payment Request API, Web Bluetooth,
  Web USB, Web Share (unreliable), Custom Tabs (not available inside WebView).
- `window.open()` and `_blank` targets are silently blocked.
- `_system` targets may be silently blocked — the button does nothing.
- WhatsApp deep links (`wa.me/...`) may not launch the WhatsApp app.
  A user in Instagram WebView who triggers a WhatsApp OTP cannot switch
  apps without losing the session.

**iOS WebView (Instagram, WhatsApp on iOS):**
- Engine: **SFSafariViewController / WKWebView** — this is full WebKit,
  identical to Safari. NOT Chromium.
- Shares Safari's cookie jar with the host app — so Instagram iOS users
  are more likely to be authenticated across sessions than Android users.
- All Safari bugs and constraints in Constraint 10 apply here.
- `window.open()` blocked entirely in WKWebView without a user gesture.
- localStorage and sessionStorage are available but may be purged by iOS
  under memory pressure — never rely on them for critical state.

**Recording-confirmed:**
- Multiple sessions: teacher arrives from Instagram, reaches OTP screen,
  dead-clicks around OTP input, exits. Root cause: cannot retrieve OTP
  from within WebView. Better copy alone does not fix this — the WebView
  navigation problem is the root cause.
- One 34-minute session: highly motivated user switches apps and returns.
  High intent overcomes friction, but this is the exception.

**Design rule — always assume WebView:**
Any feature involving OTP delivery, external app links, deep links, or
`_system` targets must work correctly for a user trapped in a WebView.
The non-WebView case is a bonus, not the baseline.

**Specific engineering consequences:**
- OTP error copy must guide the user out of the WebView first ("Tap ··· →
  Open in Chrome/Safari"), not assume the OTP was received.
- External link CTAs must always show fallback instruction — visible by
  default, not only on error. Never hide it behind an error state.
- Test any auth or link flow by manually entering the URL inside Instagram
  or WhatsApp. Chrome DevTools is not a valid proxy.
- `navigator.share()` and Payment Request API: check availability before
  calling. Do not assume they work.

### 10. iOS / Safari / WKWebView

iOS is 36% of staffroom mobile sessions. Safari/WebKit is the engine for
every iOS browser (Chrome iOS, Firefox iOS, Edge iOS all use WKWebView
internally). Every Safari bug is a bug for 36% of users.

**Bug 1 — 100vh is wrong on iOS Safari:**
`height: 100vh` includes the browser chrome (address bar + bottom bar) on
iOS, so the "full screen" element overflows and a scrollbar appears.
Fix: use `-webkit-fill-available` as a fallback and `dvh` as progressive
enhancement:
```css
height: 100vh; /* fallback for browsers without fill-available */
height: -webkit-fill-available; /* iOS Safari 12+ */
height: 100dvh; /* Safari 15.4+, Chrome 108+ — preferred if available */
```
Note: `dvh` is NOT supported on iOS < 15.4 or Chrome < 108. Both fallbacks
are mandatory.

**Bug 2 — Inputs < 16px trigger viewport zoom:**
Safari on iOS automatically zooms the viewport when a user focuses any
`<input>`, `<select>`, or `<textarea>` whose computed `font-size` is below
16px. This zoom is disorienting and breaks layout.
Fix: all form controls must have `font-size: 16px` or larger. Use
`font-size: max(16px, 1rem)` to respect user font-scale while meeting the
floor.
Never use `user-scalable=no` in the viewport meta tag as a workaround —
it breaks accessibility.

**Bug 3 — Autocorrect mangles proper nouns:**
Safari iOS autocorrect aggressively replaces school names, Indian city names,
and proper nouns. "Springdales" becomes "Springdale's"; "Vasant Vihar"
becomes "Vasant" then autocorrects.
Fix: on any field accepting school names, designations, or Indian proper
nouns: `autocorrect="off" autocapitalize="words"`.
Do NOT use `autocapitalize="off"` for name fields — teachers prefer
auto-capitalisation of first letters. Use `autocorrect="off"` only.

**Bug 4 — OTP inputs: `type="number"` is wrong on iOS:**
`<input type="number">` renders a scroll wheel (the iOS number spinner) on
iOS Safari, not a numpad. Teachers cannot efficiently enter an OTP.
Fix: `<input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code">`.
This renders the numpad AND enables iOS's native OTP autofill from SMS.

**Bug 5 — 300ms tap delay (pre-iOS 13 devices):**
Safari on iOS < 13 delays all tap events by 300ms to detect double-tap-to-zoom.
On older iPhones (SE 1st gen, iPhone 6/7) this makes the app feel sluggish.
Fix: add `touch-action: manipulation` on all interactive elements (or on
`body` to inherit everywhere). Supported in Safari since iOS 9.3.
```css
body { touch-action: manipulation; }
```

**Bug 6 — `position: fixed` shifts when keyboard opens:**
On iOS, when a keyboard opens, `position: fixed` elements do not stay
fixed — they scroll with the content. This breaks fixed bottom action bars.
Fix: for bottom action bars in forms, avoid `position: fixed`. Use
`position: sticky; bottom: 0` inside a scroll container, or restructure
the layout so the button is naturally at the bottom of the form step.

**Bug 7 — Safe area insets (notch / home bar):**
iPhone X and later have a notch/Dynamic Island at top and a home indicator
bar at bottom. Content placed in these areas is invisible or untappable.
Fix: use `env(safe-area-inset-*)` variables:
```css
padding-bottom: env(safe-area-inset-bottom);
padding-top: env(safe-area-inset-top);
```
Requires `<meta name="viewport" content="... viewport-fit=cover">` to
activate. Without this, the browser adds default padding and
`env()` is not needed — but with `viewport-fit=cover`, it is mandatory.

**Bug 8 — WKWebView localStorage purge:**
iOS purges WKWebView storage (localStorage, sessionStorage, IndexedDB)
when the system is under memory pressure. On a 2GB iPhone SE 1st gen with
multiple apps open, this can happen mid-session.
Fix: never rely on client-side storage for critical state. All form
progress must be persisted to the server (see Constraint 12).

**Bug 9 — SFSafariViewController cookie isolation:**
Instagram iOS uses SFSafariViewController for web links. This shares the
same cookie jar as Safari — unlike Android WebView which is isolated.
Consequence: an iOS user may already be authenticated (they logged in via
Safari previously) even if it's their first Instagram click. Do not
assume unauthenticated state just because the user arrived from Instagram.

**Bug 10 — -webkit-overflow-scrolling removed in iOS 13:**
`-webkit-overflow-scrolling: touch` was the legacy way to enable momentum
scrolling on scroll containers. It was removed in iOS 13 and causes errors
in Safari's strict mode.
Fix: remove all instances of `-webkit-overflow-scrolling: touch`.
Modern iOS uses native momentum scrolling by default via `overflow: auto`.

**Bug 11 — `<select>` renders as native iOS picker:**
`<select>` elements always render as the iOS native bottom-sheet picker.
Custom-styled dropdowns using `<select>` cannot be styled beyond basic
appearance.
Fix: if a custom dropdown look is required, use a `<button>` with a
`role="listbox"` ARIA pattern — do not attempt to style a raw `<select>`.

**Bug 12 — Display P3 wide-gamut on iPhone 12+:**
iPhone 12 and later use a Display P3 colour gamut, which is wider than
sRGB. Images and colours rendered in sRGB look slightly desaturated on
these screens compared to an Android phone showing the same design.
Consequence: brand colours defined in sRGB may look different than intended.
Fix: specify brand colours in design tokens using P3 equivalents where
available; accept that sRGB is the safe baseline for cross-device
consistency. Do not design with highly saturated colours that depend on
P3 to look correct.

**Bug 13 — `autocomplete="off"` ignored by Safari:**
Safari ignores `autocomplete="off"` on password managers and credential
fields. Do not use this attribute to suppress autofill on phone number
fields — it will not work on iOS.
Fix: if suppressing autofill is necessary (unusual), use a
non-standard `name` attribute that is not recognised by password managers.
In practice, for staffroom, autofill on phone number is desirable — do not
fight it.

### 11. Form Input Requirements

Form inputs directly determine whether a teacher can submit a review.
These are the exact HTML attributes required for every form control.

**All `<input>` and `<textarea>` elements:**
- `font-size: 16px` minimum (computed, not just declared) — iOS zoom
  prevention (Constraint 10, Bug 2).
- `touch-action: manipulation` — removes 300ms tap delay on pre-iOS 13
  and old Android devices.

**Phone number field:**
- `type="tel"` — triggers numeric keypad on both iOS and Android.
- `inputmode="numeric"` — reinforces keypad on Android.
- `autocomplete="tel"` — enables browser/OS autofill with saved phone
  numbers.

**OTP / verification code fields:**
- `type="text"` — NOT `type="number"` (iOS spinner problem).
- `inputmode="numeric"` — numpad on both platforms.
- `pattern="[0-9]*"` — HTML5 validation.
- `autocomplete="one-time-code"` — enables iOS SMS OTP autofill.
- `maxlength="1"` per digit field (if individual fields) — triggers
  auto-advance logic.

**School name and institution name fields:**
- `autocorrect="off"` — prevents Safari from mangling proper nouns.
- `autocapitalize="words"` — auto-capitalises first letter of each word.
- `spellcheck="false"` — prevents red underlines on legitimate school names.

**City and location fields:**
- `autocorrect="off"` — prevents autocorrect on Indian city names.
- `autocapitalize="words"`.

**Designation / role fields:**
- `autocorrect="off"`.
- `autocapitalize="words"`.

**Free-text review / feedback fields:**
- `autocorrect="on"` — desirable here; teachers want spellcheck.
- `autocapitalize="sentences"`.
- Set an explicit `rows` attribute (do not let the browser decide height).

**All fonts in forms:**
- Use `rem` units, never `px`. This allows the device system font-scale
  setting to apply (common among teachers with presbyopia, 35–55 age range).
  A user with 1.3× font scale must not see truncated labels or broken layout.
- Test form layouts at 1.3× system font scale in Chrome DevTools.

**Labels vs placeholders:**
- Every input must have a visible `<label>` — not just a placeholder.
- Placeholders disappear on focus, abandoning the teacher mid-input.
- Use placeholder for hint/example text only, never as the sole label.

**Numeric keyboards:**
- Verify the correct keyboard type opens on both iOS and Android using
  Chrome DevTools device emulation at 375px (iOS) and 360px (Android).

### 12. Session State Persistence

**Background:**
A teacher filling a review form is interrupted constantly — students
walk in, WhatsApp notification arrives, the phone screen times out.
On MIUI/ColorOS devices, the browser tab may be killed entirely when
the teacher returns from another app. State must survive all of this.

**Rule: no critical state lives only on the client.**
`localStorage`, `sessionStorage`, and in-memory React state are all
volatile. They are cleared by:
- iOS memory pressure (WKWebView — see Constraint 10, Bug 8).
- Android OEM background app kill (MIUI, ColorOS).
- Browser tab crash or refresh.
- User manually refreshing the page.

**Required server-side persistence:**
- `POST /short-form/save` must be called after **every form step**
  before the user can advance. Do not save only on final submit.
- On page load, the server must return the current saved state and
  the React form must initialise from it — not from empty state.
  A teacher who leaves mid-form and returns must resume, not restart.
- The save endpoint must be idempotent — multiple saves of the same
  step with the same data must not create duplicate records.

**Browser lifecycle events:**
- Listen to `pagehide` (fires when the page is about to be unloaded,
  including on tab kill on iOS) and `visibilitychange` (fires when the
  tab is backgrounded). On either event, trigger a final save with the
  current form state.
- Note: `beforeunload` is unreliable on mobile Safari and Android Chrome.
  Do not rely on it. `pagehide` and `visibilitychange` are the correct events.
- Use `navigator.sendBeacon()` in `pagehide` handlers — it is guaranteed
  to fire even when the page is being torn down, unlike `fetch()`.

**Anti-patterns:**
- Do not use `localStorage` as the primary persistence layer.
- Do not restore form state only from URL params — URLs may be lost on
  WebView navigation.
- Do not assume form state is preserved across app switches on Android
  MIUI/ColorOS devices.

### 13. Display, Color and Contrast

**Display types in the teacher device pool:**

| Display Type | Devices | Behaviour |
|---|---|---|
| AMOLED/OLED | Redmi Note, Samsung M series | True black (#000) renders as off pixels; use #0A0A0A for "black" backgrounds to avoid halation at edges |
| TN LCD | itel, Lava, low-end vivo | Narrow colour gamut; low viewing-angle shift; colours washed out in sunlight |
| IPS LCD | Mid-range OPPO, Realme | Good colour; slight sunlight washout |
| Display P3 OLED | iPhone 12+ | Wider colour gamut; brand colours appear more saturated |

**Contrast requirements:**

- **Primary text: minimum 7:1 contrast ratio against background** (WCAG 2.1
  AAA). Not 4.5:1 (AA). Reason: teachers use phones outdoors and in bright
  school corridors where screen brightness cannot compensate for low contrast.
  At 4.5:1, text becomes illegible in direct sunlight. At 7:1, it remains
  legible in most outdoor conditions.
- Secondary/helper text: minimum 4.5:1 (WCAG AA).
- Interactive element boundaries (borders, icons): minimum 3:1 against
  adjacent background.
- Verify contrast ratios at both 100% brightness (OLED) and simulated
  outdoor brightness (darken background 30% to simulate sun washout).

**Dark mode:**
- **Do not implement automatic dark mode switching** until explicitly
  designed for. Set `<meta name="color-scheme" content="light">` and
  `color-scheme: light only` in CSS `:root` to prevent browsers from
  auto-inverting any colours. Unintended dark mode creates unreadable
  interfaces on devices where the OS dark mode is on.
- This is a ship-now rule. Dark mode can be a deliberate future feature.

**State communication:**
- **Never communicate state using colour alone.** Always pair colour with
  icon, text, or pattern (required for red-green colour blindness, which
  affects ~8% of males). Example: an error state cannot be communicated
  only by turning a field border red. Pair with an error icon and an
  error message.
- Required/optional field distinction: do not use red asterisk only. Add
  "(required)" text or show an explicit "optional" label.

**Font rendering on TN LCD:**
- TN LCD panels at small sizes + high PPI make thin font weights (<400)
  hard to read. Use font-weight 400 minimum for body text; 600+ for labels.
- Avoid font-weight 100/200/300 at any size. Budget TN panels smear them.

**AMOLED burn-in avoidance:**
- Do not use full-width pure white (#FFFFFF) backgrounds — harsh on AMOLED
  in dark rooms and contributes to burn-in on older panels.
- Use #FAFAFA or #F5F5F5 for page background on all devices. This also
  helps avoid the harsh white-flash on page load.

### 14. Accessibility Baseline

**Target users with accessibility needs:**
- **Presbyopia (age-related long-sight):** Affects the majority of teachers
  aged 40–55. System font scale is often set to 1.2–1.3×. All text must
  use `rem` units so it scales (see Constraint 11). Minimum body text: 1rem
  (renders at 16px at default scale; 20.8px at 1.3× scale — acceptable).
- **Red-green colour blindness:** ~8% of males. Never use colour as the
  only differentiator for interactive state. Always pair with shape,
  icon, or text.
- **Screen readers (VoiceOver on iOS, TalkBack on Android):** All interactive
  elements must have accessible names. Icon-only buttons must have
  `aria-label`. Custom interactive components (non-`<button>` elements
  used as buttons) must have `role="button"` and handle keyboard events.

**WCAG 2.1 AA required, AAA recommended for primary text:**
- Text contrast: 7:1 (AAA — outdoor legibility, see Constraint 13).
- Non-text contrast (UI components, icons): 3:1 (AA).
- Focus indicators: must be visible. Do not remove `outline` without
  providing an equally visible custom focus ring.
- No keyboard traps. Every interactive element must be reachable and
  operable without a mouse.

**Specific requirements:**
- All images must have `alt` text. Decorative images: `alt=""`.
- All form inputs must have a programmatically associated `<label>`.
  Use `htmlFor`/`for` attribute, not just visual proximity.
- Error messages must be associated with the input using `aria-describedby`.
- Loading spinners: `aria-live="polite"` region must announce when loading
  completes.
- Don't use placeholder text as a label (placeholders have ~50% contrast
  against input background at 4.5:1, which fails AA for most colour
  schemes, and they disappear on focus).

**Hindi text rendering:**
- Do not set `font-size` below 14px for Devanagari script — the vowel
  diacritics (matras) become unreadable at 12px on TN LCD displays.
- Use a web font that includes full Devanagari coverage. Verify the font
  loads by checking a Hindi character at 12px in Chrome DevTools.

### 15. Progressive Enhancement and Graceful Degradation

**Design floor principle:** if it works at worst case (2G, 2GB RAM, Android
Go, Chrome 80, no WebGL, system font fallback), it works everywhere.
Features that require a newer environment must degrade gracefully, not break.

**JavaScript disabled or blocked:**
- UC Browser Turbo mode and some enterprise proxies may strip or block
  certain JS. The page must render meaningful static content without JS.
- Server-rendered HTML (via `getServerSideProps`) must be fully legible
  without JS. Skeleton screens that depend on JS to render actual content
  are acceptable — but they must fall back to SSR content, not a blank page.
- Forms: the submit button must work as a native `<button type="submit">`
  that triggers a full-page POST, not just a JS `onClick`. JS-enhanced
  submit (async) is the progressive enhancement layer.

**CSS failure:**
- If the CSS file fails to load (CDN timeout), the page must be legible as
  unstyled HTML. Use semantic HTML elements (`<nav>`, `<main>`, `<header>`,
  `<button>`, `<label>`). Do not rely purely on CSS classes to convey
  structure.

**Missing web fonts:**
- Declare a full font stack. Example: `font-family: 'Inter', -apple-system,
  BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`.
  If the custom font fails to load, the UI must still be readable with
  the system fallback. Do not set `font-display: block` — use
  `font-display: swap` to show system font immediately while custom font loads.

**Images:**
- All images must have `alt` text (for screen readers and failed load state).
- Always reserve space for images with explicit `width` and `height`
  attributes (or `aspect-ratio` in CSS). No layout shift when image loads.
- Show a low-resolution placeholder (solid colour or blur-hash) while
  the image loads. Never show a broken image icon.

**API failure:**
- Every API call must have an explicit error state in the UI. No silent
  failures. No spinner that runs forever.
- On timeout or error: show a specific, actionable message. "Something went
  wrong. Tap to retry." is the minimum. Never show raw error codes to teachers.
- Form submissions that fail: do not clear the form. The teacher's input
  must survive the failed submission so they can retry.

**Feature detection (not browser detection):**
- Never use `navigator.userAgent` sniffing to decide feature support.
  It is fragile and consistently wrong for Indian OEM browsers.
  Use feature detection: `if ('share' in navigator) { ... }`.
- Exception: detecting Instagram WebView is legitimate because it is
  done to work around a known WebView limitation, not to detect a browser.
  Use: `const isInstagramWebView = /Instagram/.test(navigator.userAgent)`.

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
| Mobile sessions | 97.7% | Clarity, Jun 2026 |
| iOS sessions | ~36% of mobile | Clarity, Jun 2026 |
| Minimum viewport (iOS) | 320px | iPhone SE 1st gen (iOS floor) |
| Minimum viewport (Android) | 360px | Budget Android floor |
| Design-optimised viewport | 360px | Dominant Android production width |
| Touch target minimum | 48×48pt | XDA/dontkillmyapp + screen guard data |
| Adjacent target gap | 8px | Recording: Back/Next dead-click |
| Edge exclusion zone | 20px from left/right edge | Cracked screen + screen guard dead zones |
| Animation maximum | 0.6s CSS transitions | Device performance baseline |
| prefers-reduced-motion | Skip animations entirely | Mandatory |
| Network baseline | 2G / EDGE (~120 kbps) | OpenSignal 2024 India |
| JS bundle (initial load) | ≤200KB gzipped | 2G load time budget |
| API timeout | 10 seconds | 2G + school Wi-Fi congestion |
| Input font-size minimum | 16px | iOS zoom prevention |
| Font units | rem only (never px) | User font-scale support |
| Text contrast (primary) | 7:1 minimum (AAA) | Outdoor legibility |
| Text contrast (secondary) | 4.5:1 minimum (AA) | WCAG 2.1 |
| Dark mode auto-switching | Disabled (`color-scheme: light`) | No designed dark theme yet |
| OTP input type | type="text" inputmode="numeric" | iOS spinner bug |
| OTP autocomplete | autocomplete="one-time-code" | iOS SMS autofill |
| Form state persistence | Server-side after every step | MIUI/ColorOS background kill |
| 100vh usage | Forbidden without -webkit-fill-available fallback | iOS Safari 100vh bug |
| Primary city | Delhi/NCR (44.1%) | Clarity, Jun 2026 |
| Login exits | 145 | Clarity, Jun 2026 |
| WebView share | 84.74% of sessions | Clarity, Jun 2026 |
| Review full completion | 49.4% | Neon DB, Jun 2026 |
