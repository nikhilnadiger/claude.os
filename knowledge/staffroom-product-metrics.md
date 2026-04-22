---
last_updated: Apr 2026
source: Neon PostgreSQL (live queries Apr 22 2026), Microsoft Clarity dashboard (Apr 2026), Meta Ads CSV (Apr 22 2026)
skills: [content-strategy, codebase-context, brand-custodian, product-context]
staleness_note: >
  All figures are point-in-time snapshots. Refresh before using in any
  investor/partner material, content, or product decision. For live platform
  data, query Neon PostgreSQL directly. For Clarity data, export from the
  Clarity dashboard. For Meta Ads data, see staffroom-content-performance.md.
---

# staffroom — Product Metrics

---

## Platform Metrics (Apr 22 2026)

| Metric | Value | Source |
|---|---|---|
| Sign-ups | 3,272 | `SELECT COUNT(*) FROM "User"` — Apr 22 2026 |
| WhatsApp verified | 1,520 | `whatsapp_users` table — 46.5% of sign-ups completed OTP. Note: remaining 1,752 unverified accounts include pre-OTP-era Old Users (Type 3) who predate mandatory WhatsApp OTP — not all are current funnel dropoffs |
| Reviews submitted | 838 | `stepper_form_data` — Apr 22 2026 |
| Reviews live | 531 | workedRecently IS NOT NULL AND overallExperience IS NOT NULL |
| Reviews fully complete (S3) | 336 | whatToImprove IS NOT NULL — 40% of submitted |
| Schools with 3+ live reviews | 7 | 6 with identified placeId + 1 null-placeId group |
| Median teacher salary (live reviews) | ₹30,000/month | 418 reviews with salary data |
| Salary range | ₹4,500 – ₹1,50,000/month | From `salaryPerMonth` on S2-complete reviews |
| Schools searched (ever) | 2,557 | `school_mapping.first_searched_at IS NOT NULL` of 44,494 mapped |
| Community size | 12,000+ | WhatsApp + Instagram + YouTube (Mar 2026) |
| CAC (blended, Meta Ads) | ~₹32/sign-up | ₹1,03,250 all-time Meta spend ÷ 3,272 sign-ups |
| Saved schools | 21 saves by 20 users | Near-zero feature adoption |

⚠ **stepper_form_data has no `is_live` or `completion_stage` columns.** Both are computed from field presence. See queries below.

---

## Review Funnel (Apr 22 2026)

| Stage | Count | Condition | Notes |
|---|---|---|---|
| Submitted (any) | 838 | Any row in stepper_form_data | S0 is answered on every submission — it is the form entry gate |
| Reached experience step | 531 | workedRecently IS NOT NULL AND overallExperience IS NOT NULL | 63% of submitted. Note: user journey's `s1_complete` requires salary also — true s1_complete count ≤ 418 |
| Salary section complete (S2) | 418 | salaryPerMonth IS NOT NULL AND salaryPerMonth > 0 | 50% of submitted |
| Full complete (S3) | 336 | whatToImprove IS NOT NULL | 40% of submitted; 63% of live reviews |

**Key insight:** S0 is answered on 100% of submissions — it is the entry gate, not a drop-off point. The meaningful drop-offs are S1→S2 (531→418, 79% continue) and the 37% of live reviews that don't reach full completion.

**PMF definition:** ≥70% of searches yield ≥3 reviews in 7 cities (top 7 by private school teacher density).
**Current baseline:** 7 schools with 3+ live reviews (nationwide). The Mar 2026 figure of 15 was incorrect — the Apr 22 2026 live Neon query is the authoritative count.

---

## Schools with 3+ Live Reviews (Apr 22 2026)

| placeId | Live Reviews |
|---|---|
| null (unmatched submissions) | 7 |
| ChIJ67pnXv4NrjsRWrOt7C7itZM | 4 |
| ChIJ2Y6vPxJurjsRGrLie_FUs4c | 4 |
| ChIJbVQ_C1URrjsRGY86qFLdpaY | 4 |
| ChIJV1Xl77JNGzkReZLxofYzBR0 | 3 |
| ChIJndiJc5G25zsRHerkokRkR1E | 3 |
| ChIJkeKlkmiZyzsRQRz0MC4EdR4 | 3 |

The 7-review null group is reviews where `placeId` was not captured — likely early form submissions or edge cases in school resolution. The 6 identified schools are all Bengaluru-area (ChIJ prefix pattern).

---

## Geographic Distribution of Reviews (Apr 22 2026)

Based on `school_mapping.district_name` join — where the *schools* are, not where the reviewer is based.

| District | Live Reviews |
|---|---|
| Bengaluru Urban | 116 |
| Chennai | 17 |
| Thane | 16 |
| Kolkata | 14 |
| Mumbai Suburban | 13 |
| Hyderabad | 12 |
| Ranga Reddy | 10 |
| Pune | 8 |
| Jaipur | 8 |
| Ghaziabad | 7 |
| Gurugram | 7 |
| Bengaluru Rural | 7 |
| Gautam Buddha Nagar | 7 |
| Coimbatore | 6 |
| 24 Paraganas South | 6 |

Bengaluru Urban (116) accounts for ~22% of all live reviews — dominant but the platform is now meaningfully national (NCR districts combined: Ghaziabad + Gurugram + Gautam Buddha Nagar = 21 reviews; Chennai 17, Thane 16, Kolkata 14).

---

## Sign-up Growth (monthly cohorts)

| Month | New Sign-ups | Notes |
|---|---|---|
| Apr 2026 | 331 | Partial month (~22 days) — run rate ~450/month |
| Mar 2026 | 349 | |
| Feb 2026 | 563 | Peak month — likely campaign push |
| Jan 2026 | 404 | |
| Dec 2025 | 160 | Slow month |
| Nov 2025 | 205 | |
| Oct 2025 | 410 | |
| Sep 2025 | 475 | Strong month |
| Aug 2025 | 238 | |
| Jul 2025 | 125 | Early days |
| Jun 2025 | 5 | Pre-launch / soft launch |
| May 2025 | 7 | Pre-launch |

Effective launch: Jul–Aug 2025. Trailing 6-month average (Nov 2025 – Apr 2026): ~335/month. Feb 2026 spike (563) correlates with the period of highest Meta Ads spend.

**WhatsApp verification note:** 1,520 of 3,272 accounts are WhatsApp-verified (46.5%). The remaining 1,752 unverified accounts include Type 3 Old Users (accounts created before WhatsApp OTP was made mandatory) who have not returned to verify — they are not purely a current funnel loss. The split between Old Users and genuine new-signup dropoffs is not queryable from Neon alone.

---

## Salary Data (Apr 22 2026)

From 418 reviews with `salaryPerMonth` filled (S2-complete reviews):

| Metric | Value |
|---|---|
| Median salary | ₹30,000/month |
| Minimum | ₹4,500/month |
| Maximum | ₹1,50,000/month |
| Reviews with salary | 418 (50% of all submitted) |

Median ₹30K/month = ₹3.6L/year. Consistent with Indian private school teacher salary benchmarks. The range (₹4.5K–₹1.5L) reflects the spectrum from budget primary schools to premium international schools.

---

## School Discovery (Apr 22 2026)

| Metric | Value |
|---|---|
| Total schools in school_mapping | 44,494 |
| Schools ever searched (first_searched_at populated) | 2,557 (5.7%) |
| Most recent search | Apr 14 2026 |

2,557 schools have been looked up via the platform — a small fraction of the 44,494 mapped, indicating large untapped discovery potential. Search/visit counts are tracked in D1 `user_tracking`, not Neon.

---

## Feature Adoption Notes

- **Saved schools:** 21 saves by 20 users — effectively zero adoption. Not a feature teachers are using.
- **Referrals:** Tracked via `User.referredById` FK and `User.referralCount` column. No separate `referrals` table in Neon (a `referrals` table exists in D1 — see d1-schema.md). Referral volume not queried in this refresh.
- **Career Insights:** `GET /insights/career-stats` is a public endpoint returning salary aggregates. Usage not tracked server-side.
- **"Member since 2024" on Profile:** Hardcoded — always displays 2024 regardless of actual account creation date. Known product gap, documented in user journey Section 6 (Profile page).
- **CAC denominator note:** The ₹32 blended CAC uses all 3,272 sign-ups as denominator. Type 3 Old Users who predate paid acquisition are included — this underestimates true paid CAC for new-era sign-ups.

---

## Clarity Analytics (Apr 2026 — last 30 days)

**Traffic:**

| Metric | Value | Change vs Mar 2026 |
|---|---|---|
| Sessions | 3,703 | ↑ from 2,351 (+57%) |
| Users | 3,114 | ↑ from 1,682 (+85%) |
| Avg pages/session | ~2.87 | Similar |
| Avg session duration | ~138s | Similar |
| Bounce rate | ~56% | Similar |

Note: ~100 sessions in the Clarity dataset are from staging/UAT environments
(Clarity is installed on all three). These slightly inflate numbers.

**Device split:**

| Device | Sessions | % |
|---|---|---|
| Mobile | ~3,333 | ~90% |
| Desktop | ~333 | ~9% |
| Tablet | ~37 | ~1% |

→ **Every UI/UX decision must be mobile-first.**

**Geography (top cities, Apr 2026):**

| City | Sessions | % | Change vs Mar 2026 |
|---|---|---|---|
| Bengaluru | ~1,164 | ~31.4% | ↓ from 44% — traffic diversifying |
| Mumbai | ~259 | ~7% | Similar |
| Chennai | ~185 | ~5% | Similar |
| Pune | ~185 | ~5% | Similar |
| Delhi | ~185 | ~5% | Similar |
| Hyderabad | ~148 | ~4% | Similar |
| Kolkata | ~148 | ~4% | Similar |

→ **Bengaluru remains the primary city but its share is declining as traffic grows nationally.**

**Funnel:**

Homepage → Login → /home → Share Experience

- Login is the second-biggest exit page: **662 exits** (up from 606 in Mar 2026)
- School pages: only 20–37 sessions each. Discovery/search is the bottleneck,
  not school page quality.

**UX friction:**

- 18.8% of sessions have dead clicks (443/2,351 in last 30-day window) — users
  tapping non-interactive elements. Primarily a mobile issue.
- Dead click pattern analysis (from Clarity session recordings, Apr 2026):
  - **Login page:** Users tap blank areas before/between form elements — most common
    in login sessions entering from Instagram/WhatsApp WebView
  - **School page non-interactive elements:** "(X+ years exp.)" badges, "Have you worked
    here recently?" text, designation labels — these look clickable but aren't
  - **Navigation menu area on homepage** — users tapping the nav bar area outside active elements
  - **"BackNext" button junction** in the review form — users tapping between the two buttons

**Channel attribution:**

- Only ~394/3,703 sessions have UTM data (Direct ~222, Organic ~131, Social ~41)
- ~3,309 sessions are untracked — almost certainly Meta Ads traffic without UTMs
- Meta ecosystem (meta + ig + instagram.com + facebook combined) accounts for ~83% of traffic
- Fix: ensure all paid creative links include UTM parameters

---

## Login Drop-off Analysis (Clarity recordings, Apr 2026)

Five sessions studied at the login page exit point. Three distinct patterns identified:

**Pattern A — Dead click before OTP form:** Teacher from Instagram/WhatsApp WebView taps
near the phone input or "Join the staffroom!" heading before the OTP form has loaded or
while unfamiliar with the layout. Zero interaction before tapping blank space, then session
ends. Likely a WebView user who can't switch apps to receive the WhatsApp OTP.

**Pattern B — WebView banner dismissal:** Teacher dismisses a browser banner ("Open in Chrome")
then encounters the OTP step. Unable to switch to WhatsApp from within Instagram's in-app
browser. Session ends after the OTP screen appears.

**Pattern C — Pure bounce:** Teacher from a Meta paid ad arrives at the homepage, then
navigates to login, clicks nothing (or clicks dead areas), exits. No meaningful engagement.
Likely sees the login requirement as a friction wall.

**Implication for all three patterns:** The OTP mechanism itself may be the barrier — not
the UI copy or layout. WebView users physically cannot switch to WhatsApp to retrieve the
OTP without losing their session. This is a structural WebView problem, not a copy problem.

---

## Share Experience Analysis (Clarity recordings, Apr 2026)

One confirmed successful conversion from paid Meta ad to completed review:
- Arrived from utm_campaign=Home_Conversion_Reviews&Salary
- Completed login (phone → OTP → profile role)
- Navigated to share-experience, searched for school, completed all steps (~8 minutes)
- Dead click observed on "BackNext" junction (tapped between buttons) — one-time friction,
  did not block completion

One highly engaged researcher session (34 minutes active, 14 pages, multiple schools):
- Searched and browsed multiple schools (DPS Khanapara, Royal Global, Down Town School, Gurukul)
- Successfully completed login despite being in a WebView context (was able to switch apps)
- Demonstrates that high-intent users overcome WebView friction if motivated enough

---

## Meta Ads Performance

For full campaign, ad set, and creative breakdown → `staffroom-content-performance.md`.

**All-time summary (Apr 22 2026):** ₹1,03,250 spend, 4,51,793 reach, 18,839 link clicks, 13,079 LPVs, CPC ₹5.48, CPM ₹86.37, LPV rate 69.4%.

**Blended CAC:** ₹1,03,250 ÷ 3,272 sign-ups = ~₹32/sign-up (all-time Meta spend ÷ total sign-ups — assumes majority of sign-ups are Meta-driven given ~83% of Clarity sessions are unattributed Meta traffic).
