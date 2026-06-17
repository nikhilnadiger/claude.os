---
last_updated: May 2026
source: Neon PostgreSQL (live queries Apr 22 2026), Microsoft Clarity dashboard (Apr 2026, May 2026 via MCP May 27 2026), Meta Ads CSV (Apr 22 2026)
skills: [content-strategy, codebase-context, brand-custodian, product-context]
staleness_note: >
  Partially refreshed May 27 2026. Neon: sign-ups, reviews, schools with 3+ are current.
  D1: user_tracking discrepancy documented (see School Discovery section). Clarity: fully
  refreshed May 2026. Pending: WhatsApp verified count, full completion count, salary data
  re-query, school search count.
---

# staffroom — Product Metrics

---

## Platform Metrics (May 27 2026)

⚠ **Partially refreshed May 27 2026.** Sign-ups, reviews submitted, live reviews, and schools with 3+ reviews are current from Neon. WhatsApp verified, full completions, salary, school search counts, and saved schools are Apr 22 2026 figures pending re-query.

| Metric | Value | Source |
|---|---|---|
| Sign-ups | 3,664 | `SELECT COUNT(*) FROM "User"` — May 27 2026 |
| WhatsApp verified | not re-queried | pending — run `SELECT COUNT(*) FROM whatsapp_users` |
| Reviews submitted | 1,106 | `SELECT COUNT(*) FROM stepper_form_data` — May 27 2026 |
| Reviews live | 740 | workedRecently IS NOT NULL AND overallExperience IS NOT NULL — May 27 2026 |
| Reviews fully complete (S3) | not re-queried | pending — run `WHERE whatToImprove IS NOT NULL` |
| Schools with 3+ live reviews | 10 | 9 with identified placeId + 1 null-placeId group — May 27 2026 |
| Median teacher salary (live reviews) | ₹30,000/month | 418 reviews with salary data — Apr 22 2026, not re-queried |
| Schools searched (ever) | not re-queried | pending — run `WHERE first_searched_at IS NOT NULL` |
| Community size | 12,000+ | WhatsApp + Instagram + YouTube (Mar 2026) |
| CAC (blended, Meta Ads) | ~₹36/sign-up | ₹1,31,289 all-time Meta spend ÷ 3,664 sign-ups — May 27 2026 |
| Saved schools | not re-queried | pending |

⚠ **stepper_form_data has no `is_live` or `completion_stage` columns.** Both are computed from field presence. See queries below.

---

## Review Funnel (Apr 22 2026 — re-query needed for mid-stages)

⚠ Counts below are from Apr 22 2026 and predate the dashboard's 7-stage model. Started, Overall Rating, and Full Completion figures are directly comparable. Mid-stage counts (Benefits, Expenses, Ease of working) were not separately queried under the old model — re-query from Neon using the field anchors in neon-schema.md.

| Dashboard stage | Apr 22 2026 count | Field anchor | Notes |
|---|---|---|---|
| Started ("I worked here recently") | 838 | `workedRecently = 'yes'` | Entry gate — ~100% of submissions |
| Overall Rating | ~531 | `overallExperience > 0` | ~63% of started |
| Salary & Work Experience | not queried | `totalWorkExperience > 0` | was bundled into old "S2" — re-query |
| Benefits and Perks | not queried | `benefits` non-null, non-`[]` | was bundled into old "S2" — re-query |
| Expenses borne | not queried | `feesDeductions` non-null, non-`[]` | was bundled into old "S2" — re-query |
| Ease of working | not queried | `givingFeedbackToPrincipal` answered | was bundled into old "S2" — re-query |
| Full Completion ("What to improve") | 336 | `whatToImprove` answered | 40% of started; 63% of live reviews |

**Key insight:** The dashboard now exposes mid-funnel drop-off between Overall Rating and Full Completion as 4 distinct stages. Re-query all 7 stages from Neon to identify where teachers are stopping. For field anchors and query logic, see neon-schema.md dashboard funnel table.

**PMF definition:** ≥70% of searches yield ≥3 reviews in 7 cities (top 7 by private school teacher density).
**Current baseline:** 10 schools with 3+ live reviews (nationwide, May 27 2026). The Mar 2026 figure of 15 was incorrect — the Apr 22 2026 live Neon query is the authoritative count.

---

## Schools with 3+ Live Reviews (May 27 2026)

10 schools nationwide with 3+ live reviews: 9 identified schools + 1 null-placeId group.

| placeId | Live Reviews |
|---|---|
| null (unmatched submissions) | 7 |
| ChIJbVQ_C1URrjsRGY86qFLdpaY | 4 |
| ChIJ67pnXv4NrjsRWrOt7C7itZM | 4 |
| ChIJ2Y6vPxJurjsRGrLie_FUs4c | 4 |
| ChIJFREQiDQ-rjsRollG9KpOgYg | 3 ← new since Apr 2026 |
| ChIJi3j6F0FdUjoRnU-NllN4RK8 | 3 ← new since Apr 2026 |
| ChIJV1Xl77JNGzkReZLxofYzBR0 | 3 |
| ChIJndiJc5G25zsRHerkokRkR1E | 3 |
| ChIJkeKlkmiZyzsRQRz0MC4EdR4 | 3 |
| ChIJTx9TmSgUrjsRnJrZD_xn6Ow | 3 ← new since Apr 2026 |

The 7-review null group is reviews where `placeId` was not captured — likely early form submissions or edge cases in school resolution. The 9 identified schools are all Bengaluru-area (ChIJ prefix pattern).

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
| May 2026 | 392 | Apr 23 – May 27 (~35 days) — not a full calendar month |
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

**WhatsApp verification note:** 1,520 of 3,664 accounts are WhatsApp-verified (Apr 22 2026 figure — not re-queried). The remaining 1,752 unverified accounts include Type 3 Old Users (accounts created before WhatsApp OTP was made mandatory) who have not returned to verify — they are not purely a current funnel loss. The split between Old Users and genuine new-signup dropoffs is not queryable from Neon alone.

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

- **Saved schools:** 21 saves by 20 users — effectively zero adoption. Not a feature teachers are using.
- **Referrals:** Tracked via `User.referredById` FK and `User.referralCount` column. No separate `referrals` table in Neon (a `referrals` table exists in D1 — see d1-schema.md). Referral volume not queried in this refresh.
- **Career Insights:** `GET /insights/career-stats` is a public endpoint returning salary aggregates. Usage not tracked server-side.
- **"Member since 2024" on Profile:** Hardcoded — always displays 2024 regardless of actual account creation date. Known product gap, documented in user journey Section 6 (Profile page).
- **CAC denominator note:** The ₹36 blended CAC uses all 3,664 sign-ups as denominator (₹1,31,289 all-time Meta spend ÷ 3,664 sign-ups). Type 3 Old Users who predate paid acquisition are included — this underestimates true paid CAC for new-era sign-ups.

---

## Clarity Analytics (May 2026 — last 30 days)

**Traffic:**

| Metric | Value | Change vs Apr 2026 |
|---|---|---|
| Sessions | 5,153 | ↑ from 3,703 (+39%) |
| Users | 4,503 | ↑ from 3,114 (+45%) |
| Avg pages/session | 2.33 | ↓ from ~2.87 |
| Avg session duration | 97.6s | ↓ from ~138s |
| Bounce rate | 65.7% | ↑ from ~56% |

Note: Session and user counts include ~43 sessions from uat.thestaffroom.in (UAT environment — Clarity is installed on all three environments). These slightly inflate numbers, same as Apr.

**Device split:**

| Device | Sessions | % |
|---|---|---|
| Mobile | 4,927 | 95.6% |
| Desktop | 194 | 3.8% |
| Tablet | 32 | 0.6% |

→ **Mobile dominance increased further (90% → 95.6%). Every UI/UX decision must be mobile-first.**

**Geography (top cities, May 2026):**

| City | Sessions | % | Change vs Apr 2026 |
|---|---|---|---|
| Bengaluru | 778 | 15.1% | ↓ dramatically from 31.4% |
| New Delhi | 549 | 10.7% | new entrant in top 2 |
| Kolkata | 335 | 6.5% | ↑ significantly |
| Mumbai | 296 | 5.7% | Similar |
| Pune | 241 | 4.7% | Similar |
| Hyderabad | 240 | 4.7% | Similar |
| Delhi | 237 | 4.6% | (note: "New Delhi" and "Delhi" are separate Clarity entries — combined NCR: ~786 sessions, ~15.3%) |
| Chennai | 214 | 4.2% | Similar |
| Ahmedabad | 105 | 2.0% | New in top 10 |

→ **Major shift: Bengaluru no longer dominant.** Delhi/NCR (New Delhi + Delhi combined) at ~786 sessions (~15.3%) now equals Bengaluru. Traffic is genuinely national. Content and product decisions can no longer assume Bengaluru-first.

**Funnel / exit pages:**

| Page | Exit Count |
|---|---|
| / (homepage) | 6,366 |
| /home | 1,763 |
| /share-experience | 968 |
| /login | 552 |
| /dashboard | 128 |

Exit note: Homepage exits are high because it has the most traffic (most sessions start and end there). Login exits: 552 (↓ from 662 in Apr) — the OTP/login friction improvement from May PR #113 (mobile keyboard/layout fix) may have helped. Share-experience exits: 968 — this is a new prominent exit point, up from not being in the top list in Apr.

**UX friction:**

- 14.9% of sessions have dead clicks (vs 18.8% in Apr — improvement). Primarily a mobile issue.
- Dead click pattern analysis (from Clarity session recordings, Apr 2026):
  - **Login page:** Users tap blank areas before/between form elements — most common
    in login sessions entering from Instagram/WhatsApp WebView
  - **School page non-interactive elements:** "(X+ years exp.)" badges, "Have you worked
    here recently?" text, designation labels — these look clickable but aren't
  - **Navigation menu area on homepage** — users tapping the nav bar area outside active elements
  - **"BackNext" button junction** in the review form — users tapping between the two buttons

**Channel attribution:**

- Organic: 175 sessions
- Social: 108 sessions
- Direct: 34 sessions
- **Untracked: ~4,836 sessions (~93.9%)** — slightly worse than Apr (89.4% untracked). Meta Ads traffic still missing UTMs on most links. Fix required: ensure all paid creative links include UTM parameters.

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
