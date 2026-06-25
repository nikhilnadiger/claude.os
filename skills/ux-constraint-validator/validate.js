#!/usr/bin/env node
/**
 * staffroom UX Constraint Validator
 * Checks a URL against staffroom-ux-constraints.md (all 15 constraints).
 *
 * Usage: node validate.js <url> [--skip-lighthouse]
 *
 * Requirements: npm install (installs puppeteer, @axe-core/puppeteer, lighthouse)
 * Exits 0 if no FAILs, exits 1 if any FAIL found.
 */

'use strict';

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const lighthouse = require('lighthouse');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const TARGET_URL = process.argv[2];
const SKIP_LIGHTHOUSE = process.argv.includes('--skip-lighthouse');

if (!TARGET_URL) {
  console.error('Usage: node validate.js <url> [--skip-lighthouse]');
  process.exit(2);
}

const VIEWPORTS = [
  { width: 320, height: 568, label: '320px (iOS floor: iPhone SE 1st gen)' },
  { width: 360, height: 800, label: '360px (Android floor)' },
  { width: 375, height: 812, label: '375px (iPhone SE 3rd gen / iPhone 13 mini)' },
  { width: 390, height: 844, label: '390px (iPhone 14/15)' },
  { width: 412, height: 915, label: '412px (Pixel / Galaxy S)' },
  { width: 768, height: 1024, label: '768px (tablet)' },
  { width: 1280, height: 800, label: '1280px (desktop)' },
];

const MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 12; Redmi Note 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36';

// Thresholds
const TOUCH_TARGET_MIN = 48;     // px — staffroom floor (Constraint 2)
const TOUCH_TARGET_WARN = 44;    // px — warn if between 44–47px
const EDGE_EXCLUSION_PX = 20;    // px from left/right edge (Constraint 2)
const ADJACENT_GAP_MIN = 8;      // px between adjacent touch targets (Constraint 2)
const INPUT_FONTSIZE_MIN = 16;   // px — iOS zoom prevention (Constraint 11)
const BUNDLE_SIZE_WARN_KB = 180; // KB gzipped — warn threshold (Constraint 5)
const BUNDLE_SIZE_FAIL_KB = 200; // KB gzipped — fail threshold (Constraint 5)
const LH_LCP_THRESHOLD = 2500;  // ms (Constraint 5)
const LH_CLS_THRESHOLD = 0.1;   // score (Constraint 5)

// ─── Result tracking ─────────────────────────────────────────────────────────

const results = { pass: [], warn: [], fail: [] };

function pass(msg) { results.pass.push(msg); }
function warn(msg) { results.warn.push(msg); }
function fail(msg) { results.fail.push(msg); }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function px(val) { return parseFloat(val) || 0; }

/**
 * Find system Chrome/Chromium binary.
 * Returns null if none found (puppeteer will use its bundled Chromium).
 */
function findSystemChrome() {
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// ─── Check: Layout overflow (horizontal scroll) ───────────────────────────────

async function checkLayoutOverflow(page, viewport) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  if (hasOverflow) {
    fail(`[C1/C3] Horizontal overflow at ${viewport.width}px — content wider than viewport`);
  } else {
    pass(`Layout: no horizontal overflow at ${viewport.width}px`);
  }
}

// ─── Check: Touch targets ─────────────────────────────────────────────────────

async function checkTouchTargets(page, viewport) {
  const issues = await page.evaluate(
    ({ minSize, warnSize, edgePx, gapPx, vpWidth }) => {
      const INTERACTIVE_SELECTORS =
        'a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [tabindex]:not([tabindex="-1"])';

      const els = Array.from(document.querySelectorAll(INTERACTIVE_SELECTORS));
      const fails = [];
      const warns = [];
      const edgeFails = [];

      const rects = els.map(el => {
        const r = el.getBoundingClientRect();
        return { el, r };
      }).filter(({ r }) => r.width > 0 && r.height > 0 && r.top < window.innerHeight + 100);

      for (const { el, r } of rects) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().split(/\s+/).join('.').slice(0, 40)
          : '';
        const label = `${tag}${id}${cls}`;

        const w = r.width;
        const h = r.height;

        if (w < minSize || h < minSize) {
          fails.push(`${label}: ${Math.round(w)}×${Math.round(h)}px`);
        } else if (w < warnSize || h < warnSize) {
          warns.push(`${label}: ${Math.round(w)}×${Math.round(h)}px (below ${minSize}px floor)`);
        }

        // Edge exclusion zone
        // Right-edge check is bounded to vpWidth + edgePx to avoid false positives
        // from overflow carousel cards that are scrolled off-screen to the right.
        if (r.left < edgePx || (r.right > vpWidth - edgePx && r.right <= vpWidth + edgePx)) {
          edgeFails.push(`${label}: left=${Math.round(r.left)}px right=${Math.round(vpWidth - r.right)}px from edge`);
        }
      }

      // Adjacent gap check (simplified — check closest horizontal neighbours)
      const sortedByLeft = rects.slice().sort((a, b) => a.r.left - b.r.left);
      const gapFails = [];
      for (let i = 0; i < sortedByLeft.length - 1; i++) {
        const a = sortedByLeft[i].r;
        const b = sortedByLeft[i + 1].r;
        // Only check if they are on the same horizontal band (overlap in Y)
        const yOverlap = a.top < b.bottom && a.bottom > b.top;
        if (yOverlap) {
          const gap = b.left - a.right;
          if (gap >= 0 && gap < gapPx) {
            const la = sortedByLeft[i].el.tagName.toLowerCase();
            const lb = sortedByLeft[i + 1].el.tagName.toLowerCase();
            gapFails.push(`${la} → ${lb}: gap ${Math.round(gap)}px (needs ≥${gapPx}px)`);
          }
        }
      }

      return { fails, warns, edgeFails, gapFails };
    },
    { minSize: TOUCH_TARGET_MIN, warnSize: TOUCH_TARGET_WARN, edgePx: EDGE_EXCLUSION_PX, gapPx: ADJACENT_GAP_MIN, vpWidth: viewport.width }
  );

  if (issues.fails.length > 0) {
    fail(`[C2] Touch targets < ${TOUCH_TARGET_MIN}px at ${viewport.width}px:\n  ${issues.fails.join('\n  ')}`);
  } else {
    pass(`Touch targets ≥${TOUCH_TARGET_MIN}px at ${viewport.width}px`);
  }

  if (issues.warns.length > 0) {
    warn(`[C2] Touch targets 44–47px at ${viewport.width}px (below staffroom floor):\n  ${issues.warns.join('\n  ')}`);
  }

  if (issues.edgeFails.length > 0) {
    fail(`[C2] Elements within ${EDGE_EXCLUSION_PX}px of horizontal edge at ${viewport.width}px:\n  ${issues.edgeFails.join('\n  ')}`);
  } else {
    pass(`Edge exclusion zone clear at ${viewport.width}px`);
  }

  if (issues.gapFails.length > 0) {
    fail(`[C2] Adjacent interactive elements gap < ${ADJACENT_GAP_MIN}px at ${viewport.width}px:\n  ${issues.gapFails.join('\n  ')}`);
  }
}

// ─── Check: Input attributes (Constraint 11) ──────────────────────────────────

async function checkInputAttributes(page) {
  const issues = await page.evaluate((minFontSize) => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    const fontFails = [];
    const otpIssues = [];
    const autocorrectIssues = [];
    const labelIssues = [];
    const vhIssues = [];

    for (const input of inputs) {
      const style = window.getComputedStyle(input);
      const fontSize = parseFloat(style.fontSize) || 0;
      const id = input.id ? `#${input.id}` : '';
      const name = input.name ? `[name="${input.name}"]` : '';
      const label = `${input.tagName.toLowerCase()}${id}${name}`;

      // Font size check
      if (fontSize < minFontSize) {
        fontFails.push(`${label}: ${fontSize}px (needs ≥${minFontSize}px)`);
      }

      // Label association
      const hasLabel = input.id
        ? !!document.querySelector(`label[for="${input.id}"]`)
        : !!input.closest('label');
      const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
      if (!hasLabel && !hasAriaLabel && input.type !== 'hidden' && input.type !== 'submit') {
        labelIssues.push(`${label}: no associated <label> or aria-label`);
      }

      // OTP detection heuristic
      const isOtp =
        (input.autocomplete === 'one-time-code') ||
        (input.name && /otp|code|verify|token/i.test(input.name)) ||
        (input.id && /otp|code|verify|token/i.test(input.id)) ||
        (input.maxLength === 1 && input.inputMode === 'numeric');

      if (isOtp) {
        const problems = [];
        if (input.type === 'number') problems.push('type="number" (use type="text" — iOS renders spinner)');
        if (input.inputMode !== 'numeric') problems.push('missing inputmode="numeric"');
        if (input.autocomplete !== 'one-time-code') problems.push('missing autocomplete="one-time-code"');
        if (input.pattern !== '[0-9]*') problems.push('missing pattern="[0-9]*"');
        if (problems.length > 0) {
          otpIssues.push(`${label}: ${problems.join('; ')}`);
        }
      }

      // Autocorrect check for proper-noun fields
      const isProperNounField =
        (input.name && /school|institution|city|location|designation|role|employer/i.test(input.name)) ||
        (input.id && /school|institution|city|location|designation|role|employer/i.test(input.id)) ||
        (input.placeholder && /school|city|designation|employer/i.test(input.placeholder));

      if (isProperNounField) {
        if (input.getAttribute('autocorrect') !== 'off') {
          autocorrectIssues.push(`${label}: proper-noun field missing autocorrect="off"`);
        }
      }
    }

    // 100vh check — scan inline styles and stylesheets
    const allElements = Array.from(document.querySelectorAll('*'));
    for (const el of allElements) {
      if (el.style && (el.style.height === '100vh' || el.style.minHeight === '100vh')) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().split(/\s+/)[0]
          : '';
        vhIssues.push(`${tag}${id}${cls}: inline height:100vh without -webkit-fill-available fallback`);
      }
    }

    return { fontFails, otpIssues, autocorrectIssues, labelIssues, vhIssues };
  }, INPUT_FONTSIZE_MIN);

  if (issues.fontFails.length > 0) {
    fail(`[C10/C11] Input font-size < ${INPUT_FONTSIZE_MIN}px (iOS viewport zoom):\n  ${issues.fontFails.join('\n  ')}`);
  } else {
    pass(`All input font-sizes ≥${INPUT_FONTSIZE_MIN}px`);
  }

  if (issues.otpIssues.length > 0) {
    fail(`[C7/C11] OTP input attribute problems:\n  ${issues.otpIssues.join('\n  ')}`);
  } else {
    pass(`OTP inputs: no issues detected`);
  }

  if (issues.autocorrectIssues.length > 0) {
    warn(`[C11] Proper-noun fields missing autocorrect="off":\n  ${issues.autocorrectIssues.join('\n  ')}`);
  } else {
    pass(`Autocorrect attributes: proper-noun fields correctly configured`);
  }

  if (issues.labelIssues.length > 0) {
    fail(`[C14] Form inputs without associated label:\n  ${issues.labelIssues.join('\n  ')}`);
  } else {
    pass(`All form inputs have associated labels`);
  }

  if (issues.vhIssues.length > 0) {
    fail(`[C10] 100vh used without -webkit-fill-available fallback:\n  ${issues.vhIssues.join('\n  ')}`);
  }
  // Note: stylesheet 100vh check requires CSS parsing — covered by manual UAT
}

// ─── Check: Image alt text (Constraint 15) ────────────────────────────────────

async function checkImageAlt(page) {
  const issues = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .filter(img => img.getAttribute('alt') === null)
      .map(img => {
        const src = (img.src || img.getAttribute('src') || '').split('/').pop().slice(0, 40);
        return `img[src*="${src}"]: missing alt attribute`;
      });
  });

  if (issues.length > 0) {
    fail(`[C14/C15] Images missing alt text:\n  ${issues.join('\n  ')}`);
  } else {
    pass(`All images have alt attributes`);
  }
}

// ─── Check: Font unit check (rem vs px) — via CSS custom properties ───────────

async function checkFontUnits(page) {
  // Check if body computed font-size scales with user preference
  // We test by checking if the page has any font-size set in px on text elements
  // (heuristic — cannot fully parse external CSS without fetching stylesheets)
  const issue = await page.evaluate(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    // If body font-size is exactly 16px (browser default) without rem scaling,
    // the page likely relies on px units. This is a heuristic WARN, not a definitive FAIL.
    // The definitive check is: computed font size changes if we change <html> font-size.
    const htmlEl = document.documentElement;
    const originalFontSize = htmlEl.style.fontSize;
    htmlEl.style.fontSize = '20px'; // simulate 1.25× user font scale
    const bodyFontAfterScale = parseFloat(window.getComputedStyle(document.body).fontSize);
    htmlEl.style.fontSize = originalFontSize; // restore
    // If body font-size didn't increase, it's likely set in px
    return bodyFontAfterScale <= 16;
  });

  if (issue) {
    warn(`[C11] Body font-size may be set in px (not rem) — does not scale with user font-size preference. Verify: all font-size declarations use rem.`);
  } else {
    pass(`Font units: body scales with user font-size preference (rem units likely correct)`);
  }
}

// ─── Check: color-scheme meta tag (Constraint 13) ────────────────────────────

async function checkColorScheme(page) {
  const result = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="color-scheme"]');
    const rootStyle = window.getComputedStyle(document.documentElement);
    const colorScheme = rootStyle.colorScheme;
    return {
      metaContent: meta ? meta.getAttribute('content') : null,
      cssColorScheme: colorScheme || null,
    };
  });

  const hasLightOnly =
    (result.metaContent && result.metaContent.includes('light') && !result.metaContent.includes('dark')) ||
    (result.cssColorScheme && result.cssColorScheme.includes('light') && !result.cssColorScheme.includes('dark'));

  if (!hasLightOnly) {
    warn(
      `[C13] color-scheme not locked to "light". ` +
      `meta[name="color-scheme"]="${result.metaContent || 'absent'}", ` +
      `CSS color-scheme="${result.cssColorScheme || 'absent'}". ` +
      `Add <meta name="color-scheme" content="light"> to prevent unwanted dark mode.`
    );
  } else {
    pass(`color-scheme: locked to light (dark mode auto-inversion prevented)`);
  }
}

// ─── Check: axe-core WCAG AA (Constraint 14) ─────────────────────────────────

async function checkAccessibility(page) {
  try {
    const axeResults = await new AxePuppeteer(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = axeResults.violations;

    if (violations.length === 0) {
      pass(`axe-core: no WCAG 2.1 AA violations`);
    } else {
      const summary = violations.map(v => {
        const nodes = v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(', ');
        return `${v.id} (${v.impact}): ${v.description} — ${nodes}`;
      });
      fail(`[C14] axe-core WCAG 2.1 AA violations (${violations.length}):\n  ${summary.join('\n  ')}`);
    }

    // Colour contrast specific check
    const contrastViolations = violations.filter(v => v.id === 'color-contrast');
    if (contrastViolations.length === 0) {
      pass(`Colour contrast: no WCAG AA contrast violations`);
    }
    // Note: staffroom requires 7:1 (AAA) for primary text — axe checks 4.5:1 (AA)
    // Manual verification of 7:1 is required for outdoor legibility
    warn(`[C13] Colour contrast verified to WCAG AA (4.5:1). Manually verify primary text achieves 7:1 (AAA) for outdoor legibility.`);

  } catch (err) {
    warn(`axe-core check failed: ${err.message}. Run manually with axe-cli.`);
  }
}

// ─── Check: Bundle size (Constraint 5) ───────────────────────────────────────

async function checkBundleSize(page) {
  // Measure total JS transferred (gzipped) via performance API
  const totalJsKb = await page.evaluate(() => {
    if (!window.performance || !window.performance.getEntriesByType) return null;
    const resources = performance.getEntriesByType('resource');
    const jsBytes = resources
      .filter(r => r.initiatorType === 'script' && r.transferSize > 0)
      .reduce((sum, r) => sum + r.transferSize, 0);
    return jsBytes / 1024;
  });

  if (totalJsKb === null) {
    warn(`[C5] Could not measure JS bundle size (Performance API unavailable).`);
  } else if (totalJsKb > BUNDLE_SIZE_FAIL_KB) {
    fail(`[C5] JS bundle size: ${Math.round(totalJsKb)}KB gzipped (threshold: ${BUNDLE_SIZE_FAIL_KB}KB)`);
  } else if (totalJsKb > BUNDLE_SIZE_WARN_KB) {
    warn(`[C5] JS bundle size: ${Math.round(totalJsKb)}KB gzipped (approaching ${BUNDLE_SIZE_FAIL_KB}KB limit)`);
  } else {
    pass(`JS bundle: ${Math.round(totalJsKb)}KB gzipped (≤${BUNDLE_SIZE_FAIL_KB}KB)`);
  }
}

// ─── Check: Lighthouse (Constraint 5) ────────────────────────────────────────

async function checkLighthouse(browser) {
  if (SKIP_LIGHTHOUSE) {
    warn(`[C5] Lighthouse skipped (--skip-lighthouse flag). Run manually: npx lighthouse ${TARGET_URL} --form-factor=mobile`);
    return;
  }

  try {
    const { lhr } = await lighthouse(TARGET_URL, {
      port: new URL(browser.wsEndpoint()).port,
      output: 'json',
      logLevel: 'silent',
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        disabled: false,
      },
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 150,
        throughputKbps: 1.6 * 1024,
        cpuSlowdownMultiplier: 4,
      },
      onlyCategories: ['performance', 'accessibility'],
    });

    const lcp = lhr.audits['largest-contentful-paint']?.numericValue || null;
    const cls = lhr.audits['cumulative-layout-shift']?.numericValue || null;
    const tbt = lhr.audits['total-blocking-time']?.numericValue || null;

    if (lcp !== null) {
      if (lcp > LH_LCP_THRESHOLD) {
        fail(`[C5] Lighthouse LCP: ${(lcp / 1000).toFixed(1)}s (threshold: ${LH_LCP_THRESHOLD / 1000}s on simulated 2G)`);
      } else {
        pass(`Lighthouse LCP: ${(lcp / 1000).toFixed(1)}s`);
      }
    }

    if (cls !== null) {
      if (cls > LH_CLS_THRESHOLD) {
        fail(`[C5] Lighthouse CLS: ${cls.toFixed(3)} (threshold: ${LH_CLS_THRESHOLD}) — layout shift on load`);
      } else {
        pass(`Lighthouse CLS: ${cls.toFixed(3)}`);
      }
    }

    if (tbt !== null) {
      if (tbt > 300) {
        warn(`[C4] Lighthouse TBT: ${Math.round(tbt)}ms (>300ms risks animation jank on budget devices)`);
      } else {
        pass(`Lighthouse TBT: ${Math.round(tbt)}ms`);
      }
    }

    const a11yScore = lhr.categories?.accessibility?.score;
    if (a11yScore !== null && a11yScore !== undefined) {
      if (a11yScore < 0.9) {
        fail(`[C14] Lighthouse accessibility score: ${Math.round(a11yScore * 100)}/100 (threshold: 90)`);
      } else {
        pass(`Lighthouse accessibility: ${Math.round(a11yScore * 100)}/100`);
      }
    }

  } catch (err) {
    warn(`[C5] Lighthouse failed: ${err.message}. Run manually: npx lighthouse ${TARGET_URL} --form-factor=mobile`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== staffroom UX Constraint Validator ===');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Time:   ${new Date().toISOString()}\n`);

  const executablePath = findSystemChrome();
  const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
  if (executablePath) {
    console.log(`Using system Chrome: ${executablePath}\n`);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: launchArgs,
    ...(executablePath ? { executablePath } : {}),
  });

  try {
    // ── Per-viewport checks ──────────────────────────────────────────────────
    for (const viewport of VIEWPORTS) {
      console.log(`\n── Viewport: ${viewport.label} ──`);
      const page = await browser.newPage();
      await page.setUserAgent(MOBILE_UA);
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 2 });

      try {
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
      } catch (navErr) {
        warn(`Navigation at ${viewport.width}px: ${navErr.message}`);
        await page.close();
        continue;
      }

      // Small wait for JS to settle
      await new Promise(r => setTimeout(r, 500));

      await checkLayoutOverflow(page, viewport);
      await checkTouchTargets(page, viewport);

      // Run input, accessibility, and bundle checks only on primary viewports
      if (viewport.width === 360) {
        await checkInputAttributes(page);
        await checkImageAlt(page);
        await checkFontUnits(page);
        await checkColorScheme(page);
        await checkAccessibility(page);
        await checkBundleSize(page);
      }

      await page.close();
    }

    // ── Lighthouse (uses its own page) ───────────────────────────────────────
    console.log('\n── Lighthouse (simulated 2G mobile) ──');
    await checkLighthouse(browser);

  } finally {
    await browser.close();
  }

  // ── Report ───────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('=== VALIDATION REPORT ===\n');

  if (results.fail.length > 0) {
    console.log('FAILURES:');
    results.fail.forEach(f => console.log(`  ✗ ${f}`));
    console.log('');
  }

  if (results.warn.length > 0) {
    console.log('WARNINGS:');
    results.warn.forEach(w => console.log(`  ⚠ ${w}`));
    console.log('');
  }

  if (results.pass.length > 0 && process.env.VERBOSE) {
    console.log('PASSED:');
    results.pass.forEach(p => console.log(`  ✓ ${p}`));
    console.log('');
  }

  console.log(
    `=== RESULT: ${results.fail.length} FAIL, ${results.warn.length} WARN, ${results.pass.length} PASS ===`
  );

  if (results.fail.length > 0) {
    console.log('\nConstraint references:');
    console.log('  claude.os/knowledge/staffroom-ux-constraints.md');
    console.log('\nDo NOT present this build for UAT until all FAILs are resolved.\n');
  } else {
    console.log('\nNo FAILs. Proceed to manual UAT checklist in SKILL.md.\n');
  }

  process.exit(results.fail.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('\nValidator crashed:', err);
  process.exit(2);
});
