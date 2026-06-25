---
name: ux-constraint-validator
version: 1.0
description: >
  Automated pre-UAT check that validates all 15 staffroom UX constraints
  against a running URL. Triggers: 'validate constraints', 'run ux validation',
  'check ux constraints', 'validate the build', 'pre-UAT check', 'run the
  validator', 'check touch targets', 'check accessibility'. Run after
  `pnpm build && pnpm lint` and before any UAT session. Not a replacement
  for Clarity session review or human design critique.

triggers:
  - "validate constraints"
  - "run ux validation"
  - "check ux constraints"
  - "validate the build"
  - "pre-UAT check"
  - "run the validator"
  - "check touch targets"
  - "run constraint check"
  - "accessibility check"
  - "before UAT"
  - "before QA"

related_skills:
  - product-design
  - engineering-review
  - codebase-context

live_references:
  - label: UX Constraints (the spec this validator enforces)
    path: knowledge/staffroom-ux-constraints.md
---

# ux-constraint-validator

## Purpose

Runs an automated headless-browser check of a staffroom page or flow against
the 15 UX constraints in `knowledge/staffroom-ux-constraints.md`. Produces a
structured pass/fail report per viewport, per constraint. Surfaces violations
before a human UAT session so the UAT session focuses on edge cases and
qualitative assessment, not catching obvious mechanical failures.

**What it checks (automated):**
- Layout integrity (no horizontal overflow) at 320px, 360px, 375px, 390px,
  412px, 768px, 1280px
- Touch target size (≥48×48px) for all interactive elements
- Adjacent target gap (≥8px) between interactive elements
- Edge exclusion zone (no interactive element within 20px of left/right edge)
- Input font-size (≥16px computed — iOS zoom prevention)
- `100vh` usage without fallback (iOS Safari overflow bug)
- Font-size units (must be `rem`, not `px`, for user font-scale)
- OTP input attributes (`type="text"`, `inputmode="numeric"`,
  `autocomplete="one-time-code"`)
- Free-text input attributes (`autocorrect`, `autocapitalize`, `spellcheck`)
- Image `alt` text presence
- All form inputs have associated `<label>`
- WCAG 2.1 AA colour contrast via axe-core
- Core Web Vitals (LCP, CLS, FID/INP) via Lighthouse
- Total JS bundle size ≤200KB gzipped

**What it does NOT check (requires human review):**
- Visual design quality and aesthetics
- Hindi text rendering and legibility
- Actual network throttle behaviour (validate manually in DevTools)
- Real OTP flow end-to-end
- WebView-specific behaviour (test manually in Instagram)
- `prefers-reduced-motion` animation behaviour (toggle in DevTools)

## Setup (one-time)

Run this from the `claude.os/skills/ux-constraint-validator` directory:

```bash
cd claude.os/skills/ux-constraint-validator
npm install
```

Dependencies: `puppeteer` (~170MB Chromium download on first install),
`@axe-core/puppeteer`, `lighthouse`. Installed locally to the skill directory.

If the bash sandbox already has a system Chromium at `/usr/bin/chromium-browser`
or `/usr/bin/google-chrome`, the script will use it automatically and skip the
puppeteer Chromium download (set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1` before
`npm install` to force this).

## How to Run

```bash
# From the staffroom-v2 repo root, after pnpm build:
node claude.os/skills/ux-constraint-validator/validate.js http://localhost:3000

# Validate a specific page:
node claude.os/skills/ux-constraint-validator/validate.js http://localhost:3000/login

# Validate production (read-only, no form submission):
node claude.os/skills/ux-constraint-validator/validate.js https://staffroom.in
```

## Output Format

The script writes to stdout and exits with code 0 (all pass) or 1 (failures
found). Claude should check the exit code: `$?`

Example output:

```
=== staffroom UX Constraint Validator ===
Target: http://localhost:3000/login

Viewport 320px ... PASS (layout OK) | 3 WARN (touch targets 44–47px)
Viewport 360px ... PASS
Viewport 375px ... PASS
Viewport 390px ... PASS
Viewport 412px ... PASS

[FAIL] Touch targets < 48px:
  - .otp-resend-btn: 36×36px at 360px viewport
  - .back-button: 40×44px at 320px viewport

[WARN] Touch targets 44–47px (below staffroom floor, above Apple HIG):
  - .close-icon: 44×44px at 360px viewport (needs 4px more)

[PASS] No elements within 20px of horizontal edges
[PASS] No horizontal overflow at any viewport
[PASS] All input font-sizes ≥ 16px
[PASS] OTP inputs: correct type/inputmode/autocomplete
[FAIL] 100vh used without fallback:
  - .login-wrapper: height: 100vh (line 47 of login.module.css)
[PASS] All images have alt text
[FAIL] axe-core WCAG AA violations:
  - colour-contrast: .helper-text (3.1:1 contrast, needs 4.5:1)
[PASS] Lighthouse CLS: 0.02 (threshold: 0.1)
[PASS] Lighthouse LCP: 1.8s (threshold: 2.5s)
[WARN] JS bundle: 187KB gzipped (threshold: 200KB — approaching limit)

=== RESULT: 3 FAIL, 3 WARN, 9 PASS ===
Exit code: 1
```

## How Claude Should Use This

1. After any frontend build that touches UI, components, or CSS:
   ```bash
   pnpm build && pnpm lint && node claude.os/skills/ux-constraint-validator/validate.js http://localhost:3000
   ```

2. Read the output. For every `[FAIL]`:
   - Identify which UX constraint is violated (the output names the constraint).
   - Fix it before presenting to Nikhil.
   - Do not present a build with `[FAIL]` items as ready for review.

3. For every `[WARN]`:
   - Assess whether the warning is a real risk.
   - Either fix it or document why it is acceptable.

4. All `[PASS]` and `[WARN]` → proceed to manual UAT.

5. For failures the validator cannot catch automatically (WebView, Hindi text,
   animation, network throttle) — perform manual UAT using the checklist at
   the bottom of this file.

## Manual UAT Checklist (post-validator)

Run these manually before marking a build as UAT-complete:

- [ ] Open the page inside Instagram's in-app browser on Android. Verify OTP
      flow and all links behave correctly.
- [ ] Open the page inside Instagram's in-app browser on iOS (if iOS device
      available) or via Safari iOS emulation.
- [ ] Enable Chrome DevTools 3× CPU throttle + Slow 3G. Verify: no jank on
      scroll, animations complete in ≤0.6s, loading states appear immediately.
- [ ] Enable `prefers-reduced-motion` in Chrome DevTools. Verify: all
      animations disappear entirely.
- [ ] Set Chrome DevTools font scale to 1.3×. Verify: no truncated labels,
      no broken layout.
- [ ] Test at 320px viewport width. Verify: no horizontal scroll, all
      elements visible and tappable.
- [ ] Check any Hindi text at 14px+. Verify: Devanagari matras legible.
- [ ] Dark mode: set OS to dark mode. Verify: page remains light
      (`color-scheme: light` meta tag must prevent any inversion).
- [ ] Kill and reopen the browser tab mid-form. Verify: form state is
      restored from server (not blank).
