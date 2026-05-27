---
last_updated: Apr 2026
maintained_by: Nikhil Nadiger
purpose: >
  Step-by-step protocol for refreshing the claude.os knowledge base and skill
  reference files. This covers the full claude.os refresh — analytics updates,
  product metrics, content performance, schema changes, and API/codebase changes.
  It does NOT cover: competitor landscape (trigger separately), LinkedIn
  (nikhil-linkedin skill has its own update workflow), or staffroom-user-journey.md
  (trigger "update user journey" with the product-context skill).
---

# claude.os Refresh Protocol

---

## Scope

**Included in this refresh:**
- `knowledge/staffroom-product-metrics.md`
- `knowledge/staffroom-ux-constraints.md`
- `knowledge/staffroom-content-performance.md`
- `skills/product-context/references/data-flow.md`
- `skills/product-context/references/api-inventory.md`
- `skills/product-context/references/d1-schema.md`
- `skills/product-context/references/neon-schema.md`
- `skills/codebase-context/references/stack-topology.md`
- `skills/codebase-context/references/deployment-guide.md`
- `knowledge/skill-architecture.md` (if new skills were added)

**Excluded from this refresh (separate protocols):**
- `knowledge/staffroom-competitive-landscape.md` — trigger as a standalone task
- `knowledge/staffroom-user-journey.md` — trigger "update user journey" with product-context skill loaded
- `skills/nikhil-linkedin/` — LinkedIn skill has its own voice and update workflow
- `knowledge/staffroom-teacher-insights.md` — updated only when new Dovetail/user research is conducted

---

## When to Run a Refresh

Run this protocol when:
- New Clarity analytics data is available (monthly)
- New Neon data is available (sign-ups, reviews, searches milestone)
- New YouTube or Instagram performance data is available (quarterly or after a major content push)
- A codebase change adds new NestJS controllers, routes, or D1 tables
- package.json changes introduce new framework versions
- New Meta Ads campaign data is available

---

## Data Sources to Gather Before Starting

| Data | How to get it | Used in |
|---|---|---|
| Clarity analytics (last 30 days) | Export from Microsoft Clarity dashboard → Overview tab | product-metrics.md, ux-constraints.md |
| Clarity session recordings | Use Clarity MCP — filter by page (login, share-experience, dead-clicks) | ux-constraints.md |
| Neon review data | Query Neon PostgreSQL directly, or ask Nikhil for export | product-metrics.md |
| YouTube performance | Export from YouTube Studio → Analytics → Videos CSV | content-performance.md |
| Instagram performance | Export from Instagram Insights → Posts CSV | content-performance.md |
| Meta Ads data | Export from Meta Ads Manager → Campaigns → Export CSV | content-performance.md |
| D1 schema changes | Query D1 via Cloudflare MCP: `SELECT name FROM sqlite_master WHERE type='table'` then `PRAGMA table_info(<table>)` for any new tables | d1-schema.md |
| Neon schema changes | Ask Nikhil for pg_dump: `pg_dump <connection_string> --schema-only > neon-schema.sql` | neon-schema.md |
| package.json versions | Read `staffroom-v2/package.json` and `staffroom-v2/backend-nest/package.json` | stack-topology.md |
| NestJS controllers | Grep `backend-nest/src/` for `@Controller`, `@Get`, `@Post`, etc. | api-inventory.md, data-flow.md |

---

## Refresh Order

Run in this order — later files depend on accuracy of earlier ones.

### Step 1: Codebase changes (if any since last refresh)

**D1 schema:**
1. List all tables: `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
2. For each table not in d1-schema.md: run `PRAGMA table_info(<table>)` and document
3. Update Section 1 (active tables), Section 3 (no active code reference), and Section 4 (cross-DB relationships)

**Neon schema:**
1. Ask Nikhil to run: `pg_dump <connection_string> --schema-only --no-owner > neon-schema.sql`
2. Compare against neon-schema.md — add new tables, update existing schemas
3. Flag any tables that appear in codebase but not in schema, or vice versa

**NestJS controllers (api-inventory.md):**
1. Grep controllers: `grep -r "@Controller\|@Get\|@Post\|@Put\|@Delete\|@Patch" backend-nest/src/ --include="*.controller.ts"`
2. Compare against api-inventory.md — add missing endpoints, remove deleted ones
3. Verify auth guards on any new endpoints (`@UseGuards(JwtAuthGuard)`, `@UseGuards(AdminAuthGuard)`)

**Data flows (data-flow.md):**
1. For each flow, verify the key service files still implement the described logic
2. Update completion counts and drop-off numbers using fresh Neon + Clarity data

**Stack versions (stack-topology.md):**
1. Read `package.json` in repo root: check Next.js, React, Tailwind versions
2. Read `backend-nest/package.json`: check NestJS version, pg version
3. Update version numbers in stack-topology.md

### Step 2: Product metrics (product-metrics.md)

From Neon:
```sql
-- Total submissions
SELECT COUNT(*) FROM stepper_form_data;

-- Full completions (whatToImprove present = Section 3 done)
-- ⚠ No completion_stage column — computed from field presence
SELECT COUNT(*)
FROM stepper_form_data
WHERE "whatToImprove" IS NOT NULL AND TRIM("whatToImprove") != '';

-- Live reviews (workedRecently + overallExperience present)
-- ⚠ No is_live column — computed from field presence
SELECT COUNT(*)
FROM stepper_form_data
WHERE "workedRecently" IS NOT NULL
  AND TRIM("workedRecently") != ''
  AND "overallExperience" IS NOT NULL
  AND "overallExperience" > 0;

-- Schools with 3+ live reviews
SELECT place_id, COUNT(*) as review_count
FROM stepper_form_data
WHERE "workedRecently" IS NOT NULL
  AND TRIM("workedRecently") != ''
  AND "overallExperience" IS NOT NULL
  AND "overallExperience" > 0
GROUP BY place_id
HAVING COUNT(*) >= 3
ORDER BY review_count DESC;

-- Total sign-ups
SELECT COUNT(*) FROM "User";
```

From D1 (school visit/search counts):

⚠ **user_tracking is STALE as of May 27 2026.** The table stopped being written to in Feb 2026 (latest search: Feb 15 2026, latest visit: Jan 31 2026). Do not query it for current visit metrics — the figures reflect Jan–Feb 2026 state only. `search_intent_queue` is similarly frozen at Feb 14 2026.

Before querying any D1 table for metrics, verify it is live:
```sql
-- Check freshness of a table (adjust column name per table)
SELECT COUNT(*), MAX(searched_at_ist), MAX(visited_at_ist) FROM user_tracking;
-- If latest timestamps are months old, the table is stale.
```

If user_tracking were live (it is not), the correct queries would be:
```sql
-- ⚠ event_type column does NOT exist — use visited_at_ist instead
-- Total school page visits
SELECT COUNT(*) FROM user_tracking WHERE visited_at_ist IS NOT NULL;

-- High-intent visitors (3+ school page visits)
SELECT COUNT(*) FROM (
  SELECT user_id FROM user_tracking
  WHERE visited_at_ist IS NOT NULL AND user_id IS NOT NULL
  GROUP BY user_id HAVING COUNT(*) >= 3
) subq;
```

For current activity, use live D1 tables: `nudges`, `question_completion_tracking`, `nudge_link_clicks`, `share_events` (see d1-schema.md freshness table for full list).

From Clarity: update Sessions, Users, avg pages/session, bounce rate, device split, top cities, login exits.

### Step 3: UX constraints (ux-constraints.md)

1. Update the quantitative figures in the constraint descriptions (mobile %, Bengaluru %, login exits, review completion)
2. Pull 3–5 session recordings per key drop-off point (login, share-experience, dead clicks) from Clarity MCP
3. Update the "Recording-confirmed" sections with new behavioural observations
4. Update the Constraint Summary Table at the bottom

### Step 4: Content performance (content-performance.md)

YouTube:
1. From YouTube Studio export, update channel totals (video count, total views, watch hours)
2. Update top performers table if rankings have changed
3. Update pillar insights if any new patterns emerge

Instagram:
1. From Instagram Insights export, update totals (post count, total views, total shares)
2. Update top performers table if rankings have changed

Meta Ads:
1. From Meta Ads Manager export, update all-time spend, reach, link clicks, landing page views
2. Recalculate derived metrics (cost per click, cost per landing page view, CAC)
3. Update campaign-level and ad-level breakdowns

### Step 5: Skill architecture (skill-architecture.md)

1. Update the Known Inaccuracies table — mark each fixed inaccuracy as done
2. If new skills were added: update the ecosystem table and skill count
3. If new knowledge docs were added: update the knowledge docs list
4. Update `last_updated` in frontmatter

---

## Pre-Refresh: Load the User Journey First

**Before starting any refresh, read `knowledge/staffroom-user-journey.md` in full.**

This document is the authoritative source on how the system actually works — user types, screen
behaviour, completion stage definitions, entry points, error states, and known limitations.
Every metric and data flow in the other knowledge files must be interpreted through it.

Specific things the user journey clarifies that affect how metrics are recorded and labeled:
- **Type 3 (Old Users):** Pre-OTP-era accounts get silently linked when they return via OTP.
  WhatsApp verification counts must not be framed as pure funnel drop-off without this context.
- **Review completion stages:** `s1_complete` = Gate + Steps 1 AND 2 (Overall Experience + Salary).
  The Neon query condition `overallExperience IS NOT NULL` catches "reached experience step" — not
  s1_complete. Label accordingly.
- **Review goes live immediately:** No admin gate. `stepper_form_approval` is never written.
- **"Member since 2024" is hardcoded** on Profile — not a DB value.
- **Sign-out is client-only** — no server-side token invalidation.
- **Unreachable features** (/about, /blogs, /secondhome, /whatsapp-verification) exist in the
  codebase but are not linked from navigation.

If the user journey has been updated since the last refresh (check its version number and
"Codebase last verified" date), re-read it before proceeding.

---

## Update Rules

- **Accuracy over completeness:** If you cannot verify a number from source data, do not
  write it. State what you know and what needs verification.
- **Targeted changes only:** Update only what has changed. Do not rewrite surrounding sections
  for stylistic reasons.
- **Preserve plain-language style:** These files are read by Claude in task context, not by humans.
  Write clearly, not elegantly.
- **Update frontmatter:** Update `last_updated` in YAML frontmatter of every file you modify.
- **Flag discrepancies:** If a new data point contradicts a previous figure (e.g., schools with 3+
  reviews went down), document the discrepancy and possible causes rather than silently overwriting.
- **Source citations:** Every numerical figure must have a source and date. "Clarity, Apr 2026" not
  just "latest data."

---

## Output: Ready Report Format

After completing the refresh, report to Nikhil in this format:

**Updated (verified from source):**
List each file updated with: what changed, what the source was.

**Unchanged (verified as current):**
List each file checked but not requiring an update.

**Needs Nikhil's action:**
List any data that could not be obtained without Nikhil's direct involvement (e.g., pg_dump for Neon schema, new Meta Ads export).

**Discrepancies flagged:**
List any data points where the new value contradicts the old value unexpectedly, with possible explanations.
