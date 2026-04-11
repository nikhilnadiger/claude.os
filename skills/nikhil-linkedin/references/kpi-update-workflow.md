---
last_updated: "Apr 2026"
skill: nikhil-linkedin
webapp_url: "https://script.google.com/macros/s/AKfycbzCvE7ejSmpg_jTQAe5uto2KalKPYUnumCrA9lL3u2i_8-gtjuDI9rn_aphAefo7oETHA/exec"
purpose: >
  Step-by-step workflow for updating the LinkedIn KPI Sheet when Nikhil shares
  a new post URL. Fully automated via Apps Script Web App — no manual steps
  required from Nikhil after sharing the URL.
---

# LinkedIn KPI Update Workflow

## Trigger
Nikhil shares a LinkedIn post URL in conversation — new or existing.

## Pre-condition
Chrome must be open and logged in as nikhilnadiger@gmail.com.
If not: ask Nikhil to open Chrome with that profile before proceeding.

---

## Step 1: Extract Post ID and Exact Date

From the URL extract {POST_ID} — the numeric ID.

Decode exact IST publish date using the calibrated epoch (run in Chrome via javascript_tool):
```javascript
const EPOCH = -51192580n;  // calibrated: Post 20 (ID 7447285355323744256 = 2026-04-07 IST)
const IST   = 19800000n;   // +5h30m offset
const ts = (BigInt('{POST_ID}') >> 22n) + EPOCH + IST;
new Date(Number(ts)).toISOString().substring(0, 10); // YYYY-MM-DD
```

Note: LinkedIn IDs do NOT use Unix epoch in the top bits — the raw shift gives an
arbitrary value. Always apply the EPOCH constant. Re-calibrate only if Post 20's
date (2026-04-07) is ever found to be wrong. Never use relative timestamps ("3d",
"2w", "1mo") — always decode from the post ID.

---

## Step 2: Fetch Analytics for the Post

Navigate to the post summary analytics page:
  https://www.linkedin.com/analytics/post-summary/urn:li:activity:{POST_ID}/

Use get_page_text to extract all metrics in one call. Capture:
- Impressions, Members Reached, Reactions, Comments, Reposts, Saves, Sends
- Profile Viewers, Followers Gained
- Full post text (visible on this page)

Then navigate to demographics:
  https://www.linkedin.com/analytics/demographic-detail/urn:li:activity:{POST_ID}/?metricType=IMPRESSIONS

Use get_page_text to extract:
- Top Seniority + %
- Top Location + %
- Top Industry #1 + %, Top Industry #2 + %
- Top Job Title + %
- Education Sector Reach % = Education % + Education Administration Programs %

Note: Demographics unavailable for posts older than 360 days. Mark as "n/a".

---

## Step 3: Check Which Existing Posts Need Refreshing

From the Google Sheets tab, read the post list via gviz CSV (reliable, no CORS issues):

```javascript
(async () => {
  const r = await fetch('https://docs.google.com/spreadsheets/d/1eBrZr6LVgbIyzcvQTvjWVQCXSDtK_P-R4feUQIyP8vI/gviz/tq?tqx=out:csv&sheet=LinkedIn%20KPIs&range=A:C');
  const csv = await r.text();
  const rows = csv.trim().split('\n').slice(1); // skip header
  return rows.map(row => {
    const [num, date, url] = row.split(',').map(v => v.replace(/^"|"$/g, ''));
    return { postNum: Number(num), date, url };
  });
})()
```

Filter posts where date is within last 30 days and re-fetch analytics for each.
Posts older than 30 days: skip — data is stable.

---

## Step 4: Write to Google Sheet via Web App POST

Navigate to the Sheets page first — LinkedIn's CSP blocks fetch calls:
`https://docs.google.com/spreadsheets/d/1eBrZr6LVgbIyzcvQTvjWVQCXSDtK_P-R4feUQIyP8vI/edit`

Then POST from that tab using javascript_tool:

```javascript
(async () => {
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzCvE7ejSmpg_jTQAe5uto2KalKPYUnumCrA9lL3u2i_8-gtjuDI9rn_aphAefo7oETHA/exec';
  // no-cors + no Content-Type = text/plain, which bypasses CORS preflight.
  // Apps Script receives the raw body and JSON.parses it correctly.
  // Response is opaque — verify success via gviz read (see Step 5).
  await fetch(WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ posts: [ /* array of post objects */ ] })
  });
})()
```

**Post object fields:**

| Field | Type | Notes |
|---|---|---|
| `postNum` | integer | Required. Existing = refresh, missing = append |
| `date` | string | YYYY-MM-DD. New posts only. Derive from activity ID (see below) |
| `url` | string | Full LinkedIn URL. New posts only |
| `impressions`, `membersReached`, `reactions`, `comments`, `reposts`, `saves`, `sends`, `profileViewers`, `followersGained` | integers | All posts |
| `engagementRate`, `deepEngagement` | float 2dp | All posts |
| `commentReactionRatio` | float 2dp or `"n/a"` | Use `"n/a"` string if comments = 0 |
| `topSeniority`, `topLocation`, `topIndustry1`, `topIndustry2`, `topJobTitle` | strings | All posts |
| `topSeniorityPct`, `topLocationPct`, `topIndustry1Pct`, `topIndustry2Pct`, `topJobTitlePct`, `eduSectorReach` | float | **Divide scraped % by 100.** Sheet cells are percentage-formatted. Write 0.347 not 34.7 |
| `topic`, `pattern`, `audienceTags`, `format`, `hashtags`, `wordCount`, `fullPostText` | strings | New posts only — never sent for refreshes |

For existing posts the web app writes cols J–AF only. Cols A–I are never touched.

## Date Derivation from Activity ID

Extract exact IST publish date from the activity ID — never guess or use relative timestamps.

```javascript
const EPOCH = -51192580n;  // calibrated: Post 20 (ID 7447285355323744256 = 2026-04-07)
const IST   = 19800000n;   // +5h30m

function linkedInIdToDate(activityId) {
  const ts = (BigInt(activityId) >> 22n) + EPOCH + IST;
  return new Date(Number(ts)).toISOString().substring(0, 10); // YYYY-MM-DD
}
```

Re-calibrate the epoch constant only if Post 20's date is ever found to be wrong.

---

## Column Map (verified Apr 2026)

Cols A–I = editorial (set once, never overwritten on refresh).
Cols J–AF = metrics + demographics (overwritten on every refresh).

| Col | # | Field | Format |
|---|---|---|---|
| J | 10 | Impressions | integer |
| K | 11 | Members Reached | integer |
| L | 12 | Reactions | integer |
| M | 13 | Comments | integer |
| N | 14 | Reposts | integer |
| O | 15 | Saves | integer |
| P | 16 | Sends | integer |
| Q | 17 | Profile Viewers | integer |
| R | 18 | Followers Gained | integer |
| S | 19 | Engagement Rate % | float |
| T | 20 | Deep Engagement % | float |
| U | 21 | Comment:Reaction Ratio % | float or "n/a" |
| V | 22 | Top Seniority | string |
| W | 23 | Top Seniority % | decimal (e.g. 0.347) |
| X | 24 | Top Location | string |
| Y | 25 | Top Location % | decimal |
| Z | 26 | Top Industry #1 | string |
| AA | 27 | Top Industry #1 % | decimal |
| AB | 28 | Top Industry #2 | string |
| AC | 29 | Top Industry #2 % | decimal |
| AD | 30 | Top Job Title #1 | string |
| AE | 31 | Top Job Title #1 % | decimal |
| AF | 32 | Edu Sector Reach % | decimal |



---

## Step 5: Verify and Report

After posting, read via gviz CSV to confirm rows are present and values are correct:

Report to Nikhil:
- New post number and impressions
- Which recent posts were refreshed
- Link: https://docs.google.com/spreadsheets/d/1eBrZr6LVgbIyzcvQTvjWVQCXSDtK_P-R4feUQIyP8vI

---

## Tagging Each Post

Infer from post text (Claude proposes, Nikhil confirms or corrects):
- Topic/Hook: 1-line summary of what the post is about
- Post Pattern: which of the 11 patterns (see post-patterns.md)
- Audience Tags: Hires / Investors / Partners (can be multiple)
- Format: Text only / Text + Link / Text + Image / etc.
- Hashtags: scrape from post text if visible, else leave blank

---

## Refresh Frequency Reference

Post age        | Action
----------------|---------------------------
New post        | Always add
< 30 days       | Refresh metrics
30-90 days      | Skip
> 90 days       | Skip
> 360 days      | No demographics available — mark n/a if not already set

---


