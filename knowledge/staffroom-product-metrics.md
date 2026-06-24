---
last_updated: June 2026
source: Neon PostgreSQL (live queries Jun 24 2026), Microsoft Clarity MCP (Jun 24 2026, last 30 days), Meta Ads MCP (Jun 24 2026, all-time + 2026 YTD)
skills: [content-strategy, codebase-context, brand-custodian, product-context]
staleness_note: >
  Fully refreshed Jun 24 2026. Neon: all metrics re-queried. Clarity: Jun 24 2026 (last 30 days, May 25–Jun 24).
  Meta Ads: all campaigns queried Jun 24 2026. Geographic distribution of reviews (Apr 22 2026 — not re-queried).
  D1 user_tracking: still STALE, frozen Feb 2026 (see School Discovery section).
---

# staffroom — Product Metrics

---

## Platform Metrics (Jun 24 2026)

All figures from Neon live queries Jun 24 2026 unless noted.

| Metric | Value | Source |
|---|---|---|
| Sign-ups | 4,038 | `SELECT COUNT(*) FROM "User"` — Jun 24 2026 |
| WhatsApp OTP verified | 2,309 (57.2%) | `SELECT COUNT(*) FROM whatsapp_users` — Jun 24 2026 |
| Reviews submitted | 1,473 | `SELECT COUNT(*) FROM stepper_form_data` — Jun 24 2026 |
| Reviews live | 1,033 | workedRecently IS NOT NULL AND overallExperience > 0 — Jun 24 2026 |
| Reviews fully complete | 727 | whatToImprove IS NOT NULL — Jun 24 2026 |
| Reviews with salary | 875 (59.4% of submitted) | salaryPerMonth > 0 — Jun 24 2026 |
| Median teacher salary | ₹30,000/month | from 875 salary reviews — Jun 24 2026 |
| Avg teacher salary | ₹35,871/month | from 875 salary reviews — Jun 24 2026 |
| Schools with 3+ live reviews | 17 | by placeId, reviews where workedRecently + overallExperience present — Jun 24 2026 |
| Unique schools reviewed | 1,187 | `COUNT(DISTINCT placeId) FROM stepper_form_data` — Jun 24 2026 |
| Teacher job applications (Apply) | 78 total, 77 active | apply_applications table — Jun 24 2026 |
| Community size | 12,000+ | WhatsApp + Instagram + YouTube (Mar 2026 — not re-queried) |
| CAC (blended, Meta Ads) | ~₹41/sign-up | ₹1,66,648 all-time Meta spend ÷ 4,038 sign-ups — Jun 24 2026 |
| Saved schools | 21 saves by 20 users | Apr 22 2026 — not re-queried (effectively zero adoption) |

⚠ **stepper_form_data has no `is_live` or `completion_stage` columns.** Both are computed from field presence. See queries below.

**WhatsApp verified note:** `whatsapp_users` table (2,309) = users who have completed WhatsApp OTP at least once. `User.phone IS NOT NULL` (3,741) is broader and includes old-era accounts with phone numbers from other sources. Use `whatsapp_users` count for OTP-verified metric. The 1,729 unverified accounts include Type 3 Old Users (pre-OTP era) who haven't returned — not pure funnel dropoff.

---

## Review Funnel (Jun 24 2026)

Mid-stage counts (Benefits, Expenses, Ease of working) not re-queried Jun 24. Use Apr 22 2026 figures for mid-stages as directional reference only.

| Dashboard stage | Jun 24 2026 count | Apr 22 count | Field anchor |
|---|---|---|---|
| Started ("I worked here recently") | 1,473 | 838 | `workedRecently IS NOT NULL` |
| Overall Rating | 1,033 | ~531 | `overallExperience > 0` |
| Salary & Work Experience | not re-queried | not queried | `totalWorkExperience > 0` |
| Benefits and Perks | not re-queried | not queried | `benefits` non-null, non-`[]` |
| Expenses borne | not re-queried | not queried | `feesDeductions` non-null, non-`[]` |
| Ease of working | not re-queried | not queried | `givingFeedbackToPrincipal` answered |
| Full Completion ("What to improve") | 727 | 336 | `whatToImprove` answered |

**Funnel rates (Jun 24 2026):** Started → Live: 70.1% (1,033 / 1,473). Live → Full Completion: 70.4% (727 / 1,033). Salary filled: 59.4% of submitted. Full completion / started: 49.4% — significant improvement from 40% in Apr 2026.

For field anchors and query logic, see neon-schema.md dashboard funnel table.

**PMF definition:** ≥70% of searches yield ≥3 reviews in 7 cities (top 7 by private school teacher density).
**Current baseline:** 17 schools with 3+ live reviews (nationwide, Jun 24 2026), up from 10 May 27 2026 and 7 Apr 22 2026. Delhi/NCR schools now appear in the top 10 for the first time.

---

## Schools with 3+ Live Reviews (Jun 24 2026)

17 schools with 3+ live reviews (all with identified placeId). Query: `placeId IS NOT NULL AND workedRecently IS NOT NULL AND overallExperience > 0 GROUP BY placeId HAVING COUNT(*) >= 3`.

| School | placeId | Live Reviews |
|---|---|---|
| Neev Academy | ChIJ67pnXv4NrjsRWrOt7C7itZM | 5 |
| Global City International School | ChIJbVQ_C1URrjsRGY86qFLdpaY | 5 |
| Tejasvi Vidyaranya | ChIJkeKlkmiZyzsRQRz0MC4EdR4 | 4 |
| Delhi Public School Vasant Kunj | ChIJ7-VOrTIcDTkRid_shxawFGw | 3 ← new Jun 2026, Delhi/NCR |
| Delhi International School Sector 23 Dwarka | ChIJPf1nOAAbDTkRDHxoPukzhIc | 3 ← new Jun 2026, Delhi/NCR |
| Green Field Sr. Sec. School | ChIJV1Xl77JNGzkReZLxofYzBR0 | 3 |
| Smt. Sulochanadevi Singhania School | ChIJuUJQSRW55zsR2GDQbgQu1k0 | 3 ← new Jun 2026 |
| Suncity School | ChIJNa_Rxq4XDTkRo-HTTdc1udM | 3 ← new Jun 2026, Delhi/NCR |
| Candor International School | ChIJh_p64_IUrjsRwBdJZXvmWNc | 3 ← new Jun 2026 |
| Lancer's Convent | ChIJKUf-UGIBDTkRPZBxSKNOJG4 | 3 ← new Jun 2026, Delhi/NCR |
| (7 more schools with 3 live reviews each) | various | 3 each |

**Key shift:** Delhi/NCR schools appear in the top-10 list for the first time (4 of the top 10 are Delhi/NCR). Bengaluru remains the top city overall. Null-placeId group not included in this query (prior null group of 7 is legacy early submissions).

**Trajectory:** 7 (Apr 22) → 10 (May 27) → 17 (Jun 24). +7 schools in ~4 weeks (Jun). Pace is accelerating — initiation nudge going live Jun 23 is the most likely driver.

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
| Jun 2026 | 291 | Through Jun 24 only — run rate ~363/month |
| May 2026 | 368 | Full calendar month |
| Apr 2026 | 438 | Full calendar month |
| Mar 2026 | 349 | |
| Feb 2026 | 563 | Peak month — highest Meta Ads spend period |
| Jan 2026 | 404 | |
| Dec 2025 | 160* | *Jun 24 query shows 62 for Dec (partial month window) — 160 is the correct full-month figure from May 27 query |
| Nov 2025 | 205 | |
| Oct 2025 | 410 | |
| Sep 2025 | 475 | Strong month |
| Aug 2025 | 238 | |
| Jul 2025 | 125 | Early days |
| Jun 2025 | 5 | Pre-launch / soft launch |
| May 2025 | 7 | Pre-launch |

Effective launch: Jul–Aug 2025. Trailing 6-month average (Jan–Jun 2026): ~385/month. Feb 2026 spike (563) correlates with highest Meta Ads spend. Apr (438) was a strong month despite lower ad spend — organic/nudge growth.

---

## Salary Data (Jun 24 2026)

From 875 reviews with `salaryPerMonth` > 0 (Jun 24 2026):

| Metric | Value |
|---|---|
| Median salary | ₹30,000/month |
| Average salary | ₹35,871/month |
| Reviews with salary | 875 (59.4% of submitted, up from 50% Apr 22) |

Median ₹30K/month = ₹3.6L/year. Unchanged from Apr 22 2026 — consistent with Indian private school benchmarks. Average (₹35.9K) higher than median indicates right skew (some high-paying international/premium schools pulling up the average). Min/max not re-queried Jun 24.

---

## School Discovery (D1 user_tracking — STALE, frozen Feb 2026)

⚠ **user_tracking is STALE.** The table stopped being written to in Feb 2026. Latest search timestamp: Feb 15, 2026. Latest visit timestamp: Jan 31, 2026. All figures below are from Jan–Feb 2026, NOT current.

Live D1 query (May 27 2026) confirmed the following Jan–Feb 2026 snapshot:

| Metric | Value | Data date | Notes |
|---|---|---|---|
| Total rows in user_tracking | 1,408 | Jan–Feb 2026 | All rows have searched_at_ist (search events) |
| Rows with visited_at_ist (actual school page visits) | 266 | up to Jan 31 2026 | Subset that converted from search to visit |
| Users with 3+ visits | 35 | up to Jan 31 2026 | Based on visited_at_ist IS NOT NULL |

**Why it's stale:** `search_intent_queue` also stopped at Feb 14 2026 (1,125 rows). Both tables are populated by the `/tracking/search` and `/tracking/visit` endpoints. These endpoints likely stopped writing to D1 user_tracking at some point in Feb 2026 — root cause not confirmed. Do not query these tables for current school discovery numbers.

**What IS live in D1 (May 2026):** nudge pipeline tables (nudges, nudge_link_clicks, question_completion_tracking, full_completion_queue, abandonment_queue, share_events, share_clicks) are all actively written. See d1-schema.md for full freshness table.

**Discrepancy vs old figures:** The Apr 22 2026 metric of "1,408 total school page visit events" was incorrect — all 1,408 rows are search events, not visit events. The "108 users with 3+ visits" cannot be reproduced. The `event_type` column referenced in old queries does not exist.

Note: Neon `school_mapping.first_searched_at` is a separate, independent school search count. Run `SELECT COUNT(*) FROM school_mapping WHERE first_searched_at IS NOT NULL` for current schools-ever-searched figure.

---

## Feature Adoption Notes

- **Saved schools:** 21 saves by 20 users (Apr 22 2026 — not re-queried) — effectively zero adoption. Not a feature teachers are using.
- **Referrals:** Tracked via `User.referredById` FK and `User.referralCount` column. No separate `referrals` table in Neon (a `referrals` table exists in D1 — see d1-schema.md). Referral volume not queried in this refresh.
- **Career Insights:** `GET /insights/career-stats` is a public endpoint returning salary aggregates. Usage not tracked server-side.
- **"Member since 2024" on Profile:** Hardcoded — always displays 2024 regardless of actual account creation date. Known product gap, documented in user journey Section 6 (Profile page).
- **staffroom Apply:** 78 applications total (77 active) as of Jun 24 2026. Feature live but early. Apply is feature-flagged behind `APPLY_ENABLED`. Schools receive email via SendPulse + WhatsApp notification. School-facing page is tokenized (no school registration required).
- **CAC denominator note:** The ~₹41 blended CAC uses all 4,038 sign-ups as denominator. Type 3 Old Users who predate paid acquisition are included — this underestimates true paid CAC for new-era sign-ups. May2026 Campaign's own attribution shows ₹107.54/registration.

---

## Clarity Analytics (Jun 2026 — last 30 days, May 25 – Jun 24 2026)

Data from Microsoft Clarity MCP, queried Jun 24 2026. All figures are for the trailing 30-day window.

**Traffic:**

| Metric | Value | Change vs May 2026 |
|---|---|---|
| Sessions | 6,805 | ↑ from 5,153 (+32%) |
| Unique users | 6,019 | ↑ from 4,503 (+34%) |

**Device split:**

| Device | Sessions | % |
|---|---|---|
| Mobile | 6,649 | 97.7% |
| Desktop | 131 | 1.9% |

→ **Mobile dominance increased further (95.6% → 97.7%). Every UI/UX decision must be mobile-first.**

**Geography (top cities, Jun 2026):**

| City | Sessions | % |
|---|---|---|
| New Delhi | 1,688 | 24.8% |
| Bengaluru | 1,336 | 19.6% |
| Delhi | 702 | 10.3% |
| Gurugram | 297 | 4.4% |
| Noida | 184 | 2.7% |
| Faridabad | 133 | 2.0% |
| Dehradun | 106 | 1.6% |
| Kolkata | 98 | 1.4% |
| Panipat | 77 | 1.1% |

NCR (New Delhi + Delhi + Gurugram + Noida + Faridabad): 3,004 sessions = **44.1%** of all sessions. Bengaluru: 19.6%. **Major shift from May 2026 — Delhi/NCR is now overwhelmingly the dominant traffic source.** This is a structural change, not a spike. Product decisions, content, and GTM must be Delhi/NCR-first.

**Top referrers:**

| Referrer | Sessions |
|---|---|
| instagram.com | 4,108 |
| m.facebook.com | 869 |
| l.facebook.com | 343 |
| google.com | 106 |

Instagram is the #1 traffic source by a wide margin. Meta Ads (Instagram + Facebook combined) drives the vast majority of attributed traffic.

**Exit pages:**

| Page | Exit Count |
|---|---|
| / (landing) | 5,289 |
| /share-experience | 564 |
| /home | 283 |
| /login | 145 |

**Login exits: 145 (Jun) vs 552 (May) — a 74% drop.** Most likely explanation: HMAC magic token (deployed Jun 22 2026) silently logs in users arriving via nudge links without OTP, bypassing the login page entirely. This dramatically reduces login page exits from nudge traffic. Not a UX fix — structural change to the auth flow.

Share-experience exits: 564 — down from 968 in May. Improvement is notable but the page is still a meaningful drop-off point.

**Channel attribution:**

- Untracked: majority of sessions (Meta Ads traffic still missing UTMs on most links)
- Instagram.com attributed: 4,108 sessions (60.4% of total sessions)
- Facebook combined (m.facebook.com + l.facebook.com): 1,212 sessions (17.8%)
- Google.com: 106 sessions (1.6%)

Fix required: ensure all paid creative links include UTM parameters. Without UTMs, cost attribution is impossible.

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

## Meta Ads Performance (Jun 24 2026)

Queried via Meta Ads MCP, Jun 24 2026. For full creative/ad-level breakdown → `staffroom-content-performance.md`.

**All-time campaign summary (maximum date range):**

| Campaign | Status | Spend | Reach | Clicks | CTR | CPC | Result |
|---|---|---|---|---|---|---|---|
| May2026 Campaign | ACTIVE | ₹52,365 | 1,61,317 | 13,151 | 2.86% | ₹3.98 | 487 registrations @ ₹107.54/reg |
| Home_Conversion_Reviews&Salary | PAUSED | ₹47,670 | 2,85,942 | 15,125 | 2.61% | ₹3.15 | N/A (mixed attribution) |
| BLR_Campaign | PAUSED | ₹30,773 | 50,996 | 3,925 | 2.22% | ₹7.84 | N/A (mixed attribution) |
| See Reviews_Campaign | PAUSED | ₹17,438 | 1,58,880 | 7,129 | 2.16% | ₹2.45 | 547 phone verifications @ ₹31.88 |
| View Salary_Campaign | PAUSED | ₹13,917 | 93,668 | 5,822 | 3.35% | ₹2.39 | 497 phone verifications @ ₹28.00 |
| Submit Reviews_Campaign | PAUSED | ₹1,824 | 24,454 | 685 | 2.52% | ₹2.66 | 9 phone verifications |
| Pr_Submit Reviews_Campaign | PAUSED | ₹841 | 8,465 | 287 | 2.67% | ₹2.93 | 4 phone verifications |
| Pr_See Reviews_Campaign | PAUSED | ₹699 | 5,646 | 197 | 2.83% | ₹3.55 | 7 phone verifications |
| Pr_View Salaries_Campaign | PAUSED | ₹697 | 9,955 | 193 | 1.60% | ₹3.61 | 16 phone verifications |
| Salary_Campaign | — | ₹240 | 1,953 | 119 | 5.80% | ₹2.01 | 0 leads |
| SeeReviews_Campaign | — | ₹184 | 270 | 78 | 26.80% | ₹2.36 | 0 leads |

**All-time totals (Jun 24 2026):** ~₹1,66,648 spend, ~8 lakh unique reach, ~46,700 clicks.

**2026 YTD (Jan 1 – Jun 24 2026):** ~₹1,35,600 spend, dominated by May2026 Campaign (₹52,370) + Home_Conversion (₹47,670) + BLR_Campaign (₹30,773).

**Blended CAC:** ₹1,66,648 ÷ 4,038 sign-ups = **~₹41/sign-up** (up from ~₹32 Apr 2026 — May2026 Campaign running at ₹107.54/registration is pulling up the blended figure).

**CAC note:** May2026 Campaign (₹107.54/registration) is 3–4x less efficient than prior campaigns (See Reviews: ₹31.88, View Salary: ₹28.00). Active campaign conversion rate needs investigation. Prior campaigns drove cheap OTP verifications; May2026 Campaign's conversion event is "Website registrations completed" — different metric, different funnel. Direct comparison is imperfect.
