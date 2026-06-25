---
status: AWAITING APPROVAL (v2 — updated June 24, 2026)
prepared_by: Claude (Cowork)
date: June 24, 2026
supersedes: previous version of this file
purpose: >
  Research plan to comprehensively expand staffroom-ux-constraints.md —
  universal device/browser/network coverage, research-only methodology
  (no physical device testing), plus a proposed new testing skill.
skills: [product-design, codebase-context]
---

# staffroom — UX Constraints Research Plan (v2)

**Objective:** Produce a constraints document so exhaustive that when Claude Code parses it before every build, the resulting product works correctly and gracefully for every teacher on every device — from the latest iPhone to the cheapest Android smartphone capable of running a browser — on every network from optical fibre to 2G edge, under every physical and environmental condition a teacher in India could encounter.

---

## Part I — Critical Corrections from Tier 1 Clarity Data

Before any planning, Clarity (our own production data — Tier 1, overrides everything) revealed three findings that fundamentally change the scope:

### Finding 1 — iOS is 36% of mobile sessions (not accounted for in any prior constraint)

| OS | Sessions (last 30 days) | Share |
|----|------------------------|-------|
| Android | ~4,100 | ~64% |
| iOS | ~2,295 | ~36% |

The existing constraints document has zero iOS/Safari coverage. iOS uses WebKit, not Chromium. Every CSS/JS constraint derived from Chrome behavior must be re-verified for Safari. This is not an edge case — it is one-third of every session staffroom will ever have.

### Finding 2 — 84.74% of sessions are in-app WebView (not standard browsers)

| Browser | Share |
|---------|-------|
| In-app WebView (blank) | 84.74% |
| ChromeMobile | 12.29% |
| MobileSafari | 2.08% |
| SamsungInternet | 0.81% |
| FirefoxMobile | 0.06% |
| EdgeMobile | 0.02% |

WebView is the product's primary rendering environment. Chrome at 12% is the minority. Every single constraint must be validated against WebView first. The existing Constraint 9 (WebView) is not one constraint among nine — it is the environment for most of the product's life.

The 84.74% WebView breaks down as: Instagram WebView (Android) + Instagram WebView (iOS SFSafariViewController) + WhatsApp WebView (Android) + WhatsApp WebView (iOS). These are not the same. Instagram on Android uses Chromium-based WebView. Instagram on iOS uses SFSafariViewController — which is functionally Safari, bound to WebKit.

### Finding 3 — Samsung Internet is 0.81% in our actual data (not 8.7%)

StatCounter's India figure was for general population. Our users barely use Samsung Internet. It stays in the plan but drops in priority relative to iOS Safari (2.08% + the vast majority of the 84.74% iOS WebView share).

### Finding 4 — Scope boundary: feature phones

Research confirmed the Lava A1 is a feature phone (1.8" TFT, no Android, no browser). Feature phones cannot render staffroom. The research floor is: any device capable of running a standards-compliant mobile browser. The absolute practical floor is:

- **Android floor**: Android 10 Go Edition, 2GB RAM, 5.45" display — represented by devices like itel A23S (₹4,000–₹5,000). These can run Chrome Go.
- **iOS floor**: iPhone SE 1st generation (2016) — 320px CSS width, iOS 12 max, Safari 12.
- **Feature phones (Lava A1, JioPhone KaiOS)**: Explicitly out of scope. staffroom must show a graceful "please open on a smartphone" message. This is a one-line constraint, not a design problem.

---

## Part II — Universal Coverage Philosophy

The prior plan designed for the dominant teacher device profile (Segment 2/3, Redmi/Realme, Android 11-12). That is insufficient.

**The correct approach is: design to the absolute worst-case floor across every dimension. If it works at the floor, it works everywhere above it by definition.**

Every research domain must answer two questions:
1. What does behavior look like at the **worst-case end** of this dimension?
2. What is the specific, testable constraint that guarantees correct behavior at that worst case?

The constraint document then states those worst-case constraints. Claude Code implements to them. Everything above the floor benefits automatically.

**No physical device testing.** Physical testing is replaced by:
1. Exhaustive research from authoritative documentation (derives the correct constraints without needing to observe failures)
2. An automated constraint-validator tool (proposed in Part IV) that Claude Code runs before every push

---

## Part III — Device, Browser, and Network Spectrum

### Full Device Spectrum

| Tier | Representative devices | CSS viewport width | Android/iOS version | RAM | Chrome/Safari version |
|------|----------------------|--------------------|--------------------|----|----------------------|
| Floor — Android | itel A23S, Lava Blaze 1 | 320–360px | Android 10 Go | 2GB | Chrome Go 80–90 |
| Budget — Android | Redmi A4, Samsung Galaxy M04, Realme C35 | 360–393px | Android 12–13 | 3–4GB | Chrome 100–115 |
| Mid — Android | Redmi Note 13, Samsung Galaxy M34 | 393–412px | Android 13–14 | 6–8GB | Chrome 115–125 |
| High — Android | Samsung Galaxy S23, OnePlus 12 | 393–412px | Android 14–15 | 8–12GB | Chrome 125+ |
| Floor — iOS | iPhone SE 1st gen (2016) | 320px | iOS 12 | 2GB | Safari 12 |
| Budget — iOS | iPhone 6s, iPhone 7, iPhone SE 2nd/3rd gen | 375px | iOS 15–17 | 2–3GB | Safari 15–17 |
| Mid — iOS | iPhone 11, 12, 13, 14 | 390px | iOS 16–18 | 4GB | Safari 16–18 |
| High — iOS | iPhone 15 Pro Max | 430px | iOS 18 | 8GB | Safari 18 |

**Key design implication from this table:** The minimum viewport to design for is **320px** (not 360px), because iOS SE 1st gen is the iOS floor and iOS is 36% of sessions. Layouts must not break at 320px even if they are optimized for 360px.

### Full Browser/WebView Spectrum

| Browser | Our share | Engine | Primary concern |
|---------|-----------|--------|-----------------|
| Instagram WebView (Android) | ~40–50% est. | Chromium (lagged) | Chromium version lag, session storage limits |
| Instagram WebView (iOS) | ~25–30% est. | WKWebView / SFSafariViewController | WebKit, strict storage limits, Safari-specific CSS bugs |
| WhatsApp WebView (Android) | ~5–10% est. | Chromium | OTP retrieval blocked (existing constraint) |
| WhatsApp WebView (iOS) | ~5% est. | WKWebView | Same as iOS WebView |
| ChromeMobile Android | 12.29% | Chromium (current) | Fewest issues — this is the "happy path" |
| MobileSafari | 2.08% | WebKit (current) | Safari-specific CSS, `100vh` bug |
| SamsungInternet | 0.81% | Chromium fork | Minor rendering differences |
| FirefoxMobile | 0.06% | Gecko | Exists in data; lowest priority |

### Full Network Spectrum

| Scenario | Typical speed | Who experiences this |
|----------|--------------|----------------------|
| Optical fibre / home WiFi | 100–1000 Mbps | Segment 3 at home |
| School WiFi (4G backhaul) | 5–20 Mbps shared | All teachers during school hours |
| 5G urban | 50–300 Mbps | Metro teachers with new phones |
| 4G LTE urban (uncontested) | 10–30 Mbps | Metro teachers off-peak |
| 4G urban (school hours congestion) | 0.5–2 Mbps effective | All metro teachers 9am–5pm |
| 4G Tier II/III town | 1–5 Mbps | Segment 2 peri-urban |
| 3G | 0.1–1 Mbps | Some rural Tier II/III |
| 2G EDGE | 20–100 Kbps | Remote rural Segment 1 |
| Intermittent (WiFi drops, handover) | Drops to 0 mid-session | Any teacher walking between rooms |
| Data saver mode (Chrome Lite / Android) | Throttled + compressed | Cost-conscious budget phone users |
| Offline | 0 | Form fill interrupted, session kill |

**Design floor:** 2G EDGE (20–100 Kbps). Every page load, API call, and form interaction must function at this speed, even if slowly. "Slowly" must be communicated to the user — not silence.

---

## Part IV — Research Domains (Universal Coverage)

All 12 domains from v1 are retained and expanded. Two new domains are added (iOS/Safari specifics; graceful degradation/progressive enhancement). Physical testing phase is removed. Each domain now specifies: the full spectrum researched, the worst-case constraint derived, and the automated test that Claude Code runs to verify compliance.

---

### Domain A — Device Landscape: Full Spectrum (Priority: HIGH)

**Question:** What are the complete screen dimension, DPI, RAM, and CPU specifications across every tier of device in the spectrum, and what do they collectively mandate as design constraints?

**Sources:**
- GSMArena device database — specs for every device tier listed in the spectrum table above
- 91mobiles.com — India-specific device pricing and availability verification
- Android developer docs — device density buckets (ldpi, mdpi, hdpi, xhdpi), how CSS px maps to physical pixels at each density
- Apple developer docs — viewport sizes for every iPhone model ever sold
- Clarity device breakdown (Tier 1) — verify which density buckets actually appear in our sessions

**What the research produces:**
1. A complete table: device → CSS viewport width × height → display type → RAM → Android/iOS version → browser
2. Minimum supported CSS viewport width: **320px** (iPhone SE 1st gen floor)
3. Minimum supported RAM: **2GB** (Android Go floor) — engineering implication: no memory-heavy JS libraries
4. Touch point size physical specification: at 160dpi (budget LCD), 44×44 CSS px = 44×44 physical px. At 480dpi (AMOLED flagship), 44×44 CSS px = 132×132 physical px. The 44px floor in CSS px is sufficient across all densities because higher-DPI devices have proportionally finer touch precision.
5. Screen guard correction: thick screen guards reduce effective touch sensitivity by ~15–20% — revise minimum to 48×48 CSS px with ≥8px gap between adjacent targets.

**Automated test Claude Code runs:**
```
Puppeteer at viewports: 320px, 360px, 375px, 390px, 393px, 412px, 768px, 1280px
→ Check: no horizontal scroll, no element clipped, no text overflow
→ Check: all interactive elements ≥ 48×48 CSS px
→ Check: gap between adjacent interactive elements ≥ 8px
```

---

### Domain B — iOS / Safari / WKWebView (Priority: CRITICAL — new domain, not in v1)

**This is the largest gap in the existing constraints document. 36% of sessions are iOS. None of the 9 existing constraints mention iOS or Safari.**

**Question:** What Safari/WebKit-specific behaviors and bugs affect staffroom's login flow, OTP form, review form, and school profile pages?

**Sources:**
- MDN Web Docs — Safari compatibility flags on every CSS property and JS API we use
- WebKit bug tracker (bugs.webkit.org) — known open bugs affecting forms, `position: fixed`, viewport height, scroll
- Apple developer documentation — SFSafariViewController behavior (what Instagram on iOS uses), WKWebView capabilities and restrictions
- CSS-Tricks and web.dev — documented Safari-specific bugs (100vh, `position: sticky`, input zoom, `user-select`)
- Can I Use (caniuse.com) — Safari version support filtered to iOS 12–18

**Specific behaviors to research and constrain:**

1. **The 100vh Safari bug:** On mobile Safari, `100vh` includes the browser chrome (address bar), so `height: 100vh` elements overflow and cause scroll. Fix: use `min-height: -webkit-fill-available` as fallback, or CSS `dvh` units (Safari 16+). Must test at iOS 12 (Safari 12) where `dvh` is not supported.

2. **Input zoom on focus:** Safari on iOS auto-zooms when a form input has `font-size < 16px`. This re-sizes the viewport, breaks layout, and is extremely jarring. Fix: all `<input>` elements must have `font-size: 16px` or larger — no exceptions.

3. **Numeric keyboard on iOS:** `type="tel"` shows a phone keyboard. `type="number"` shows a numeric keypad but adds spinner arrows and behaves erratically on iOS (doesn't fire onChange consistently). For OTP digit fields: use `type="text"` with `inputmode="numeric"` and `pattern="[0-9]*"` — this shows the correct numeric keypad on iOS without the bugs of `type="number"`.

4. **Tap delay on iOS (legacy):** iOS Safari historically had a 300ms tap delay on all touch events. This is resolved in modern iOS with `touch-action: manipulation` on all interactive elements. Must be applied globally.

5. **`position: fixed` during keyboard:** When a software keyboard opens on iOS Safari, `position: fixed` elements shift up with the viewport. Our bottom navigation or fixed CTAs will float up over the keyboard. Fix: avoid `position: fixed` on elements that appear during form input, or use `env(safe-area-inset-bottom)`.

6. **`-webkit-overflow-scrolling` and momentum scroll:** iOS adds momentum scroll behavior that can cause content to overscroll. Scrollable containers must handle this correctly.

7. **`user-select: none`:** Some CSS that works on Android will silently fail on iOS for text selection prevention.

8. **WKWebView storage limits (Instagram/WhatsApp on iOS):** WKWebView on iOS has a stricter IndexedDB and localStorage quota than Safari. Storage can be cleared by iOS without warning if device storage is low. Any auth token stored in localStorage will be lost silently. Our HMAC magic token uses URL parameters — safe. Confirm no auth mechanism uses localStorage.

9. **SFSafariViewController (Instagram on iOS):** Instagram on iOS uses SFSafariViewController, which is basically Safari with shared cookies and session storage. This is fundamentally different from Android's Chromium-based WebView. On iOS: OTP retrieval via WhatsApp requires switching apps. SFSafariViewController can preserve sessions when switching apps (unlike Android's WebView which may kill the session). However, the address bar and navigation UI cannot be hidden — different visual experience.

10. **`autocapitalize` on iOS forms:** iOS Safari auto-capitalizes the first letter of every input field by default. School names, city fields, and principal names get unwanted capitalization. Fix: `autocapitalize="off"` on all free-text form fields.

11. **`autocorrect` on iOS forms:** iOS Safari auto-corrects English words to guessed alternatives. School names get corrupted. Fix: `autocorrect="off"` on school name, principal name, and city fields.

12. **`-webkit-appearance` on inputs:** iOS Safari adds default styling (rounded corners, gradients) to form elements. Must reset with `-webkit-appearance: none` to ensure consistent cross-device styling.

13. **Safe area insets (notch/Dynamic Island):** iPhone X and later have safe area insets at the top and bottom. Content placed at the absolute bottom of the screen will be obscured. Fix: use `env(safe-area-inset-bottom)` for bottom-fixed elements.

**Automated test Claude Code runs:**
```
Puppeteer with iPhone SE 1st gen emulation (320×568, iOS Safari UA)
Puppeteer with iPhone 14 emulation (390×844, iOS Safari UA)
→ Check: no horizontal scroll at 320px
→ Check: no input has font-size < 16px
→ Check: all inputs have autocorrect="off" and autocapitalize="off" where text is proper nouns
→ Check: no element uses height: 100vh without dvh/fill-available fallback
→ Check: all interactive elements have touch-action: manipulation
→ Check: safe-area-inset-bottom applied to bottom-fixed elements
```

---

### Domain C — WebView Full Spectrum (Extension of Existing Constraint 9) (Priority: CRITICAL)

**Question:** For each WebView type (Instagram Android, Instagram iOS, WhatsApp Android, WhatsApp iOS, Facebook Android, Facebook iOS), what are the specific Chromium/WebKit version, storage limits, API restrictions, and known breaking behaviors?

**Sources:**
- Chromium release notes and version history
- Instagram engineering documentation on WebView
- Facebook in-app browser documentation  
- MDN WebView compatibility notes
- wicg.io/page-lifecycle spec — WebView state preservation across app switches
- dontkillmyapp.com — OEM-specific WebView behavior
- Our Clarity session recordings (Tier 1) — dead clicks and exits in WebView sessions

**What the research produces:**

For each WebView environment:
1. The specific Chromium/WebKit version floor (as of June 2026)
2. CSS features that fail or behave differently vs. standard Chrome/Safari
3. Storage API behavior (localStorage quota, persistence)
4. Camera/microphone access (blocked in most WebViews)
5. `window.open()` behavior
6. Deep link handling
7. App switching session behavior

**Specific constraint to derive:** The minimum Chromium version that Instagram's Android WebView uses — this becomes our JavaScript and CSS feature floor for the entire product (since it's the most constrained rendering environment used by the most sessions).

**Automated test Claude Code runs:**
```
Puppeteer with custom User-Agent strings matching Instagram Android WebView and iOS SFSafariViewController
→ Run all staffroom screens
→ Check: zero console errors, zero layout failures at 360px (Android) and 375px (iOS)
→ Check: no use of localStorage for auth tokens
→ Check: all external links have visible "Open in browser" fallback instructions
```

---

### Domain D — Android Version & OEM Skin Full Spectrum (Priority: HIGH)

**Question:** From Android 10 (Go Edition) through Android 15, and across MIUI, ColorOS, OneUI, FuntouchOS, and stock Android — what behaviors break multi-step web forms, session state, CSS rendering, and OTP flows?

**Sources:**
- dontkillmyapp.com — every OEM documented (Xiaomi, Samsung, OPPO, vivo, Realme, Itel, Lava, Tecno)
- Android developer docs — battery saver API per version, background process limits per version, activity lifecycle changes between Android 10 and 15
- Chrome release notes — which Chrome version shipped with which Android version (determines minimum CSS/JS features guaranteed available)
- StatCounter Android version market share India — proportion of users on each Android version
- Clarity (Tier 1) — cross-reference with session data

**What the research produces:**

1. **Android version → Chrome version mapping:** Android 10 shipped with Chrome 80 (roughly). Android 15 shipped with Chrome 128. Any CSS/JS feature that shipped after Chrome 80 cannot be used without fallback or verification that it works in Chrome 80.

2. **Per-OEM constraint additions:**
   - MIUI: aggressive session killing, battery optimization override needed — engineering must implement `POST /short-form/save` on every step transition
   - ColorOS (OPPO/Realme): similar to MIUI, slightly less aggressive
   - OneUI (Samsung): less aggressive than MIUI but custom keyboard behavior on Samsung devices
   - FuntouchOS (vivo): custom gesture navigation interferes with swipe-based interactions
   - Stock Android (Pixel, Android One): baseline — no special constraints
   - Android Go: reduced CSS/JS execution budget, Chrome Go has some features disabled

3. **Battery saver mode across versions:** Android 9+ introduces Adaptive Battery which is more aggressive than simple battery saver. Android 12+ Doze mode affects Chrome background tabs even when the app is in foreground on some OEMs.

**Automated test Claude Code runs:**
```
Lighthouse with CPU throttle 4x + Network throttle Slow 3G → simulates battery saver + 3G
→ Check: all animations ≤ 0.6s
→ Check: LCP ≤ 2.5s
→ Check: FID ≤ 100ms
→ Check: CLS ≤ 0.1
```

---

### Domain E — Browser Ecosystem: Every Browser in Production (Priority: HIGH)

**Question:** For every browser that appears in our Clarity data (plus any that could plausibly appear), what are the specific rendering differences that affect staffroom?

**Browser-by-browser research scope:**

| Browser | Research needed |
|---------|----------------|
| ChromeMobile Android | Baseline. Research: version floor, feature support by version. |
| Safari iOS (MobileSafari) | Full Domain B above. |
| SamsungInternet | Samsung's fork of Chromium. Research: version lag vs Chrome, specific CSS differences, Bixby integration, Samsung's custom input behavior. |
| ChromeMobile iOS | Chrome on iOS uses WKWebView (Apple mandates it) — functionally Safari rendering with Chrome UI. Research: confirm identical rendering to Safari, verify which Chrome iOS features differ. |
| FirefoxMobile | Gecko engine — the most different from Chrome. Research: any Gecko-specific CSS/JS behavior that affects our forms, flexbox rendering, input handling. 0.06% share but exists in data. |
| EdgeMobile | Chromium-based. Research: any Edge-specific differences. Negligible at 0.02% but confirm it works without specific accommodation. |
| UC Browser | Server-side compression mode (Turbo). Research: specifically what Turbo mode strips from HTML/CSS/JS. Forms relying on JS event listeners may break. Confirm: does staffroom's form still submit correctly in UC Browser Turbo mode? |
| Opera Mini | Extreme compression mode strips essentially all JS. Research: is the staffroom school listing page readable in Opera Mini even if forms don't work? Graceful degradation only — cannot require Opera Mini to support full form submission. |

**Sources:**
- MDN Web Docs — per-browser compatibility for every CSS property and JS API we use
- caniuse.com — filtered by browser version
- BrowserStack compatibility docs (public documentation, not the testing platform)
- UC Browser developer documentation
- Opera Mini developer documentation
- Samsung Internet developer documentation

**Automated test Claude Code runs:**
```
Puppeteer with UA strings for SamsungInternet, ChromeMobile iOS, FirefoxMobile
→ Check primary screens render without layout failure
→ Check form submission works without JS-stripping (UC Browser degradation check: form must have <noscript> fallback or native HTML form action)
```

---

### Domain F — Network: Full Spectrum Behavior (Priority: HIGH)

**Question:** At every network tier from optical fibre to offline, what does staffroom do, and what must it do?

**Sources:**
- WebPageTest.org public test results — public data on real-world load times at various connection speeds
- Google's Core Web Vitals documentation — LCP, FID, CLS thresholds and what degrades them on slow networks
- Android developer docs — Data Saver mode API, what it restricts in Chrome Lite mode
- Service Worker specification — offline behavior patterns
- TRAI and OpenSignal reports — India-specific network availability by geography and time of day
- Chrome UX Report (CrUX) — field data on real connection speeds for Indian mobile users

**What the research produces:**

A constraint for each network scenario:

| Network scenario | Constraint |
|-----------------|-----------|
| Optical fibre / WiFi | No special constraint. Baseline performance. |
| 4G uncontested | Page loads in < 2s. Core Web Vitals green. |
| 4G congested (school hours) | Same as 3G. Must show loading states. API calls must timeout at 10s and show recoverable error. |
| 3G | LCP ≤ 4s. Skeleton loading mandatory. No auto-play media. |
| 2G | LCP ≤ 8s acceptable. Text content must appear before images. Form must be submittable even if images have not loaded. |
| Intermittent (drop during form fill) | Form state must be persisted server-side before any navigation. Offline indicator shown. On reconnect: retry last API call automatically, once. |
| Data saver (Chrome Lite mode) | No requests blocked in Chrome Lite mode unless they are image decorations. Core form functionality must work with Chrome Lite mode enabled. |
| Offline | Form data entered must persist in memory for at least the current session. If user goes offline mid-form, show "You're offline. Your progress is saved. Complete when connection returns." |

**Automated test Claude Code runs:**
```
Lighthouse with Network throttle: Slow 3G
→ Check: LCP ≤ 4s
→ Check: all images lazy-loaded (no eagerly loaded images above 50KB)
→ Check: total JS bundle ≤ 200KB gzipped
→ Check: form renders and is interactive before all images load (test with images blocked)
```

---

### Domain G — Display Types: Full Spectrum Color & Rendering (Priority: MEDIUM-HIGH)

**Question:** Across every display technology a teacher's phone might have — from low-quality TN LCD to AMOLED to Super Retina XDR — what colors, contrast ratios, and rendering behaviors affect readability and interaction legibility?

**Sources:**
- Android developer docs — color management, display type detection (not always possible), dark mode
- Apple developer docs — display P3 color space (iPhones from iPhone 7+), True Tone
- WCAG 2.1 — contrast ratio requirements (AA: 4.5:1 text, 3:1 large text; AAA: 7:1)
- Material Design 3 color system documentation
- WebKit documentation — color-scheme, prefers-color-scheme media query support by version

**What the research produces:**

1. **AMOLED specific:** Our color palette must be checked against AMOLED's tendency to oversaturate. Any color that reads as "accent" on LCD may appear garish on AMOLED. Pure black (#000000) causes pixel ghosting on AMOLED — use #121212 for dark surfaces. Saturated colors should never be the sole distinguisher between interactive and decorative elements.

2. **Low-quality TN LCD (entry-level budget):** TN displays shift color significantly at off-axis viewing angles. Anything below ~45° viewing angle can invert perceived color. Contrast ratios must be even higher than WCAG minimum to remain legible at these angles.

3. **iPhone display P3:** iPhones from iPhone 7 support wide-gamut P3 color. CSS colors outside sRGB will display more vividly on iPhone than on sRGB-only Android screens. If our palette uses P3-range colors, they will look different across the two platforms. Design and verify colors in sRGB — treat P3 as an enhancement, not a dependency.

4. **Outdoor visibility:** Minimum contrast ratio for outdoor visibility under direct sunlight is approximately 7:1 (WCAG AAA), not 4.5:1. Teachers check their phones outside. All primary text and interactive element labels must meet 7:1 against their backgrounds.

5. **Dark mode / `prefers-color-scheme`:** iOS and Android both support dark mode. If staffroom does not implement dark mode, the OS may force-invert colors in some environments (Samsung One UI dark mode, for example, can apply to WebViews). Either implement proper dark mode, or explicitly set `color-scheme: light` in the `<meta>` tag to prevent forced OS inversion.

6. **Low brightness / projector room:** At screen brightness < 30%, effective contrast ratio drops. Design minimum: 7:1 in sRGB to provide margin at low brightness.

**Automated test Claude Code runs:**
```
Axe-core accessibility audit
→ Check: all text elements meet 4.5:1 contrast ratio (WCAG AA)
→ Check: all UI controls meet 3:1 contrast ratio
→ Manually flag: any element that only uses color to convey state (no shape/icon/text redundancy)
Lighthouse accessibility audit
→ Check: no color-only information patterns
```

---

### Domain H — Physical Screen Conditions (Priority: MEDIUM)

**Question:** How do tempered glass screen guards, cracked screens, screen grime, and direct sunlight change the effective touch and visual parameters, and what does this demand of our design?

**Sources:**
- XDA Forums — documented touch sensitivity reduction with various screen guard types
- Academic usability literature — touch accuracy under physical impediments
- Android developer docs — touch area and touch slop documentation

**What the research produces:**

1. **Screen guard touch reduction:** Cheap non-full-adhesive screen guards reduce effective touch sensitivity by 10–25% and shift the perceived touch point by up to 3–4px. The 44×44pt minimum is not comfortable with a screen guard — 48×48pt becomes the floor, and 8pt gap between adjacent targets is mandatory.

2. **Cracked screens:** Corner cracks create touch dead zones up to 15–20% from the screen edge. No critical interactive element (primary CTA, form submit, OTP digits) should be placed within 20px of any screen edge on either side.

3. **Outdoor glare:** High-contrast UI elements must use filled/solid style rather than outlined/bordered style in primary views — filled buttons are visible under glare; outlined buttons lose their edges.

4. **Dirty screens:** Swipe-to-dismiss and swipe-to-navigate gestures are unreliable on oily screens. Never use a swipe gesture as the primary or only path to a critical action. Always provide a tap alternative.

**Automated test Claude Code runs:**
```
Puppeteer at 360px
→ Check: no interactive element has computed width or height < 48px
→ Check: no interactive element is within 20px of the left or right edge of a 360px viewport
→ Check: all adjacent interactive elements have ≥ 8px gap between their bounding boxes
```

---

### Domain I — Device Performance Degradation: Full Spectrum (Priority: HIGH)

**Question:** From full flagship performance to CPU-throttled battery saver on a 2GB RAM Android Go device with 500MB storage free — what does performance degrade to, and what constraints guarantee the product remains usable throughout?

**Sources:**
- Google Chrome team documentation — Chrome for Android performance on low-end devices
- Android developer docs — `BATTERY_SAVER` mode behavior per OS version, CPU allocation limits
- Lighthouse documentation — the "Simulated throttling" setting corresponds to a Moto G4 on slow 3G (4x CPU, slow 3G network) — this is approximately a 3–4 year old budget Android mid-range on battery saver
- Web.dev Core Web Vitals documentation — what each metric represents on real devices

**What the research produces:**

1. **Animation constraint tightened:** On Android Go with battery saver (CPU at 50%), a 0.6s animation may take 1.2–1.5s actual time. The constraint must be: all animations ≤ 0.6s at 1x CPU speed, and must complete in ≤ 1.5s at 4x CPU throttle. The cleanest solution: honor `prefers-reduced-motion` (skip animations entirely when set) and keep animations under 0.3s (leaving 100% margin for throttling).

2. **JavaScript execution budget:** On a 2GB Android Go device, complex JS operations that take 50ms on Chrome desktop can take 500–800ms. Heavy form validation logic, complex state management, or large component re-renders will cause visible freezes. Engineering constraint: no synchronous JS operation should take >16ms (one frame) on the critical path.

3. **Storage constraint:** Chrome Go disables some caching features when device storage is under 1GB free. This is common on 32GB budget phones after a year of use. The product must work without cache — every page visit is potentially a cold start.

4. **RAM constraint:** Chrome on Android on 2–3GB devices aggressively discards inactive tabs from memory. The product is a tab that gets put in the background when the user switches to WhatsApp. When they return, Chrome may need to fully reload the page. Combined with server-side form save: the page reload must restore form state from the server.

**Automated test Claude Code runs:**
```
Lighthouse with CPU 4x throttle + Slow 3G
→ All Core Web Vitals must pass (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1)
→ Total blocking time (TBT) ≤ 300ms
→ No JavaScript bundle > 200KB gzipped
→ No single JS execution task > 50ms in Lighthouse trace
```

---

### Domain J — Input Variations: Full Spectrum (Priority: HIGH for review form)

**Question:** Across every input method, keyboard type, system language, and font scale setting a teacher might have, what breaks in our forms and what prevents it?

**Sources:**
- Gboard documentation — multi-language input, predictive text, Hindi autocorrect in English-language fields
- Apple developer docs — UITextInputTraits (`autocorrect`, `autocapitalize`, `spellcheck`, `autocomplete`, `inputmode`)
- Android developer docs — `InputType` flags, `EditorInfo`, font scale API
- MDN — HTML input attributes (`autocomplete`, `autocorrect`, `autocapitalize`, `inputmode`, `pattern`)
- iOS Safari documentation — `inputmode` support by version

**What the research produces:**

1. **Hindi/Devanagari keyboard in English-text fields:** `autocorrect="off"` and `autocomplete="off"` on school name, principal name, designation, and city fields. This is a concrete engineering constraint, not a suggestion.

2. **iOS `autocapitalize`:** iOS capitalizes the first letter of every new field by default. Set `autocapitalize="off"` for fields that don't benefit from this (school name already starts with a capital, but mid-field words like "Public School" shouldn't be capitalized by the OS).

3. **OTP input fields (specific):** `type="text"` + `inputmode="numeric"` + `pattern="[0-9]*"` + `autocomplete="one-time-code"` — this combination shows the numeric keyboard on both Android and iOS, enables OTP auto-fill from SMS on both platforms, and avoids the `type="number"` bugs on iOS.

4. **Font scale 1.3x layout:** All body text must use `rem` units. All containers that hold text must not have fixed height in `px` — use `min-height` with `rem` values or `auto`. Test at browser zoom 130% (equivalent to system font scale 1.3x).

5. **Keyboard overlap on 320px iPhone:** On a 320px wide device with a keyboard open, the visible viewport height shrinks to approximately 250–280px. Any form with fields below the keyboard fold must scroll correctly to keep the active field visible. No form field should be placed in a fixed-height scrollable container that clips when keyboard is open.

6. **Voice input:** Users dictating school names get unpunctuated, possibly Romanized Hindi text. Form validation must accept any Unicode alphanumeric string without special character restrictions in free-text fields.

**Automated test Claude Code runs:**
```
Puppeteer at 320px with viewport height 300px (simulates keyboard-open on smallest iPhone)
→ Check: active form field scrolls into view when focused
→ Check: no form field is hidden behind the keyboard area
DOM inspection
→ Check: all text inputs have autocorrect attribute
→ Check: all text inputs have autocapitalize attribute
→ Check: OTP inputs use type="text" + inputmode="numeric" (not type="number")
→ Check: all stylesheets use rem/em for font-size, not px
→ Check: no container uses fixed height in px for text content
```

---

### Domain K — Session Interruptions and State Recovery (Priority: HIGH — engineering constraint)

**Question:** For every interruption scenario (phone call, WhatsApp notification, app switch, screen timeout, MIUI background kill, iOS WKWebView memory purge), what must staffroom do to guarantee no review progress is ever permanently lost?

**Sources:**
- Android developer docs — Activity lifecycle, WebView state persistence, onSaveInstanceState
- Apple developer docs — WKWebView state restoration, UIApplicationDelegate app lifecycle
- dontkillmyapp.com — OEM-specific kill behavior (all OEMs)
- wicg.io/page-lifecycle — Page Lifecycle API (Chrome 68+): `freeze`, `resume`, `pagehide` events
- Web Storage specification — localStorage behavior across WebView reload
- Our Clarity session recordings (Tier 1) — the 34-minute session, WebView dead clicks

**What the research produces:**

A complete state machine for review form persistence:

1. `POST /short-form/save` fires: (a) on every step transition, (b) on `pagehide` event (page backgrounded or closed), (c) on `visibilitychange` event (tab hidden)
2. On page reload or return-to-tab: first API call is GET current save state → pre-fill form to saved point
3. User is never asked "Your progress may be lost" — progress is always already saved
4. Visual confirmation: "Saved" indicator appears within 500ms of each save call completing
5. Server-side save must complete before the step transition animation begins — not in parallel

**Automated test Claude Code runs:**
```
Puppeteer automation:
1. Fill form steps 1–3
2. Navigate away (simulate page hide)
3. Return to form URL
→ Check: form is pre-filled to saved step
→ Check: pagehide event listener exists and fires save
→ Check: visibilitychange event listener exists
DOM inspection
→ Check: form has "saved" state indicator element
```

---

### Domain L — Accessibility: Full WCAG 2.1 AA Compliance (Priority: HIGH)

**Question:** What does full WCAG 2.1 AA compliance require for staffroom, accounting for color blindness (~8% male), presbyopia (35–55 age bracket), low-vision users, and screen readers?

**Sources:**
- WCAG 2.1 specification
- WHO India visual impairment data
- Android developer accessibility docs — TalkBack, font scale
- Apple developer accessibility docs — VoiceOver, Dynamic Type
- axe-core rules documentation — what the automated audit catches and what it misses

**What the research produces:**

1. **Color-only states forbidden:** Error, success, and warning states must always pair color with an icon or text label. Red border alone is not sufficient for a color-blind user.
2. **Minimum font size 16px** for all body text in forms.
3. **Minimum contrast 7:1** for all primary text (AAA, for outdoor visibility).
4. **All interactive elements labeled:** Every `<button>`, `<input>`, and `<a>` must have either visible text or an `aria-label`.
5. **Focus order must be logical:** Tab/focus order must follow reading order.
6. **No information conveyed by placeholder text alone:** Placeholder text disappears on focus — all required-field instructions must be in labels, not placeholders.

**Automated test Claude Code runs:**
```
axe-core full audit on every screen
→ Zero critical violations
→ Zero serious violations
Chrome DevTools color blindness simulation (Protanopia, Deuteranopia, Achromatopsia)
→ All form states (error, success, loading) must be distinguishable
Lighthouse accessibility score ≥ 90
```

---

### Domain M — Progressive Enhancement and Graceful Degradation (Priority: HIGH — new domain)

**Question:** For every scenario where a feature fails — JavaScript disabled, slow CSS rendering, missing font, WebView with restricted APIs, Opera Mini compression — what does the user see, and is it acceptable?

**Sources:**
- MDN — `<noscript>` element, CSS `@supports`, feature detection patterns
- Progressive Enhancement specification
- HTML standard — native form submission without JavaScript
- WebKit documentation — API restrictions in WKWebView

**What the research produces:**

A hierarchy of degradation states for every staffroom screen:

1. **JS disabled / stripped (Opera Mini extreme mode):** School listing page must be readable (server-rendered HTML, CSS only). Form pages should show "Please open this in a modern browser" message via `<noscript>`.

2. **CSS partially failing (old WebView):** All critical information must remain readable if CSS fails for one block. No critical text must be white-on-white or zero-size due to a CSS failure.

3. **Missing font (slow network):** The Google Font or custom font must have a system-font fallback defined. Text must never be invisible during font load (`font-display: swap` or `optional`).

4. **API call failed:** Every API call has an error state that is: (a) shown to the user, (b) recoverable by tapping a "Try again" button, and (c) does not lose any data the user has entered.

5. **Image failed to load:** All images must have `alt` text. Layout must not collapse when an image fails to load — use `aspect-ratio` or `min-height` on image containers.

**Automated test Claude Code runs:**
```
Puppeteer with JavaScript disabled
→ Check: school listing page is readable (contains school names and ratings in HTML)
→ Check: form pages show noscript message
Puppeteer with all images blocked
→ Check: no layout collapse at 360px or 320px
→ Check: alt text present on all images
Puppeteer with custom font blocked
→ Check: text remains readable (system font fallback active)
```

---

## Part V — Proposed New Skill: `ux-constraint-validator`

### The problem this solves

Without physical device testing, the constraints document must be paired with automated verification so Claude Code can self-check compliance before every push. The proposed skill runs a full constraint audit using only free, open-source tools available in the bash sandbox — no BrowserStack, no physical devices required.

### What it does

When invoked, the skill:

1. Takes a target URL (local dev server, staging URL, or production URL)
2. Runs automated checks covering every measurable constraint in `staffroom-ux-constraints.md`
3. Produces a pass/fail report with specific violations and line-level recommendations
4. Is invocable by Claude Code as a pre-push check: "run constraint validator before pushing to UAT"

### Tool stack (all free, all run in bash sandbox)

| Tool | What it checks | Install |
|------|---------------|---------|
| `@lhci/cli` (Lighthouse CI) | Performance, LCP, FID, CLS, TBT, accessibility score, bundle size, image optimization | `npm install -g @lhci/cli` |
| `axe-core` via `axe-cli` | Full WCAG 2.1 AA accessibility audit: contrast, labels, ARIA, focus order | `npm install -g axe-cli` |
| `puppeteer` (headless Chrome) | Layout at 320/360/375/390/412/768/1280px, touch target sizes, tap gaps, element overflow, font sizes, HTML attribute presence | `npm install puppeteer` |
| Custom Node.js script | CSS audit: rem vs px, autocorrect/autocapitalize attributes, noscript elements, image alt text, font-display value, `prefers-reduced-motion` media query existence, `touch-action: manipulation` on interactive elements | Checked into the skill directory |

### Checks performed

**Layout integrity:**
- No horizontal scroll at 320px, 360px, 375px, 390px
- No element clipped or overflowing its container at any tested viewport
- No element with `height: 100vh` without `dvh`/`-webkit-fill-available` fallback
- Bottom-fixed elements use `env(safe-area-inset-bottom)`

**Touch targets:**
- All interactive elements: computed width ≥ 48px AND computed height ≥ 48px
- All adjacent interactive elements: ≥ 8px gap between bounding boxes
- No interactive element within 20px of left or right viewport edge at 360px

**iOS/Safari compliance:**
- All `<input>` elements: `font-size` ≥ 16px (prevents iOS zoom-on-focus)
- All `<input>` elements have `touch-action: manipulation` (removes 300ms tap delay)
- OTP inputs: `type="text"` + `inputmode="numeric"` (not `type="number"`)
- No `height: 100vh` without fallback
- `<meta name="color-scheme" content="light">` present (prevents forced dark mode inversion)

**Forms:**
- All free-text, school name, principal name, city fields: `autocorrect="off"` and `autocapitalize="off"`
- All form fields: `autocomplete` attribute set appropriately
- OTP inputs: `autocomplete="one-time-code"`
- No form field uses `placeholder` as the only label — all fields have a visible `<label>` or `aria-label`

**Typography:**
- All font sizes in `rem` or `em` (zero `px` font-sizes in component stylesheets)
- Body text ≥ 16px (1rem)
- All `<img>` have non-empty `alt` attribute
- Custom fonts have `font-display: swap` or `font-display: optional`

**Performance (Lighthouse with Slow 3G + 4x CPU throttle):**
- LCP ≤ 4s (Slow 3G)
- TBT ≤ 300ms
- CLS ≤ 0.1
- Total JS bundle ≤ 200KB gzipped
- All images lazy-loaded (no eager image > 50KB above fold)

**Accessibility:**
- axe-core: zero critical violations, zero serious violations
- Lighthouse accessibility ≥ 90

**Progressive enhancement:**
- `<noscript>` present on form pages
- All images have `alt` text
- No CSS that makes text invisible if a single CSS rule fails (color: white on default background)

### Skill location

`claude.os/skills/ux-constraint-validator/SKILL.md`

### When Claude Code uses it

The skill is invoked as part of the standard pre-UAT checklist. In the engineering safety rules in CLAUDE.md, the build check sequence becomes:

```
pnpm build && pnpm lint (root) → pnpm build && pnpm lint (backend-nest) → run ux-constraint-validator
→ All three must pass before pushing to UAT
```

### What it cannot catch (must remain in manual/design review)

- MIUI/OEM session killing behavior (architectural, not detectable by automated audit)
- The subjective experience of color on AMOLED vs. LCD (requires visual review by a human)
- Behavior in actual Instagram WebView (Puppeteer UA spoofing approximates it, does not replicate it fully)
- Network interruption recovery (requires manual simulation)

These are documented as "manual review required" items in the constraints document with specific test procedures for Nikhil to run on a real phone when needed.

---

## Part VI — Research Execution Sequence (Research-Only)

**No physical device testing phase. Research alone produces the constraints.**

**Phase 1 — Tier 1 data extraction (1 day):**
1. Clarity: pull full device/browser/OS breakdown by session count → establishes which device tiers actually appear in production
2. Clarity: pull session recordings filtered by iOS + WebView → identify any iOS-specific dead clicks or exits not yet documented
3. Neon DB: verify `POST /short-form/save` is firing on every step transition (not just on complete)

**Phase 2 — Desk research by domain (3–4 days):**
Execute domains A–M in the following priority order:
1. Domain B (iOS/Safari) — largest gap, 36% of sessions, zero existing coverage
2. Domain C (WebView full spectrum) — 84.74% of sessions, extends existing Constraint 9
3. Domain J (iOS input: autocorrect, font-size 16px, OTP inputmode) — high failure cost on review form
4. Domain A (device spectrum table) — foundation for all other constraints
5. Domain D (Android OEM skins) — MIUI session kill is direct threat to completion rate
6. Domain K (session interruptions) — engineering constraint, verify server-side save architecture
7. Domain F (network full spectrum) — verify existing 2G constraint and add new scenarios
8. Domain E (browser ecosystem) — verify remaining browsers, UC Browser Turbo mode
9. Domain G (display/color) — run color palette through contrast checker
10. Domain H (physical screen) — derive revised touch target floor
11. Domain I (device performance) — confirm animation and JS execution budgets
12. Domain L (accessibility) — run axe-core audit on current production
13. Domain M (progressive enhancement) — define degradation states

**Phase 3 — Constraint synthesis (1 day):**
Write each new/updated constraint entry in the format of the existing `staffroom-ux-constraints.md`. Each entry: name, specific measurable value(s), source(s), UX design implication(s), engineering implication(s) if any, automated test criterion.

**Phase 4 — Skill build (1 day):**
Build `ux-constraint-validator` skill: Node.js script + Puppeteer + axe-core + Lighthouse CI. Test against current production staffroom to baseline which constraints already pass and which are new violations.

**Total: approximately 6–7 days.**

---

## Part VII — Output

Two deliverables:

1. **Updated `knowledge/staffroom-ux-constraints.md`** — revised and expanded, 8–15 new or updated constraint entries. iOS and WebView sections become first-class sections, not footnotes. Constraint summary table updated.

2. **New skill: `claude.os/skills/ux-constraint-validator/`** — automated constraint checker. From the moment it is built, Claude Code runs it before every UAT push, and every future build is automatically verified against the full constraint set.

---

## Approval Request

This plan is ready. Approving it starts the research immediately. No physical devices or BrowserStack required.

One question before starting: **on the `ux-constraint-validator` skill** — do you want this built as part of this research exercise (adds ~1 day to the effort but gives you a permanent automated checker), or should I build the constraints document first and propose the skill separately afterward?

---

*Plan evolution: v1 initial draft → v2 post self-critique → v3 post joint Engineering + Product Design council review → v4 post staffroom context overlay + cross-validation → v5 (this version) post Clarity Tier 1 data analysis (iOS = 36%, WebView = 84.74%), universal scope correction, iOS/Safari domain added as first-class, feature phone scope boundary defined, physical testing removed and replaced by automated testing skill proposal.*
