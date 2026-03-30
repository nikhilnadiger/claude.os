---
last_updated: Mar 2026
source: Microsoft Clarity dashboard, Neon PostgreSQL, Meta Ads Manager
skills: [content-strategy, codebase-context, brand-custodian]
staleness_note: >
  All figures are point-in-time snapshots. Refresh before using in any
  investor/partner material, content, or product decision. For live platform
  data, query Neon PostgreSQL directly. For Clarity data, export from the
  Clarity dashboard. For Meta Ads data, export from Meta Ads Manager.
---

# staffroom — Product Metrics

---

## Platform Metrics (Mar 2026)

| Metric | Value | Note |
|---|---|---|
| Sign-ups | 2,905 | As of Mar 2026 |
| Reviews submitted | 635 | Across 555 unique schools |
| Reviews fully complete | 255 | 40% of submitted |
| Schools with 3+ reviews | 15 | PMF threshold — target is ≥70% of searches |
| Districts covered | 133 | Bengaluru leads by volume |
| Community size | 12,000+ | WhatsApp + Instagram + YouTube |
| CAC (Meta Ads) | ₹30/sign-up | Based on all-time Meta Ads spend |
| Total searches logged | 1,408 | Neon DB; 108 users searched 3+ times |

**PMF definition:** ≥70% of searches yield ≥3 reviews in 7 cities (top 7 by
private school teacher density). Current baseline: 15 schools nationwide.

To get current figures: query Neon PostgreSQL (`reviews`, `users`, `searches`
tables) or ask Nikhil for a fresh export.

---

## Clarity Analytics (Last 30 Days — Mar 2026 snapshot)

**Traffic:**

| Metric | Value |
|---|---|
| Sessions | 2,351 |
| Users | 1,682 |
| Avg pages/session | 2.87 |
| Avg session duration | 138s |
| Bounce rate | 56% |

**Device split:**

| Device | Sessions | % |
|---|---|---|
| Mobile | 2,122 | 90% |
| Desktop | 220 | 9% |
| Tablet | ~29 | 1% |

→ **Every UI/UX decision must be mobile-first.**

**Geography (top cities):**

| City | Sessions | % |
|---|---|---|
| Bengaluru | 1,030 | 44% |
| Mumbai | 172 | 7% |
| Chennai | 109 | 5% |
| Pune | 108 | 5% |
| Delhi | 107 | 5% |
| Hyderabad | 99 | 4% |
| Kolkata | 88 | 4% |

→ **Bengaluru is the natural first city to saturate.**

**Funnel:**

Homepage → Login → /home → Share Experience

- Login is the second-biggest exit page: **606 exits** — significant drop-off.
- School pages: only 20–37 sessions each. Discovery/search is the bottleneck,
  not school page quality.

**UX friction:**

- 18.8% of sessions have dead clicks (443/2,351) — users tapping non-interactive
  elements. Primarily a mobile issue.

**Channel attribution:**

- Only 394/2,351 sessions have UTM data (Direct 222, Organic 131, Social 41).
- ~1,957 sessions are untracked — almost certainly Instagram Ads traffic without
  UTMs. Fix: ensure all paid creative links include UTM parameters.

**Data quality note:** Clarity is installed on staging and UAT too — ~100
sessions in this dataset are from non-production environments and slightly
inflate numbers.
