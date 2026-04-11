---
last_updated: "Apr 2026"
skill: nikhil-linkedin
webapp_url: "https://script.google.com/macros/s/AKfycbwIhve8swG3i604K4Y5CxPKsecu_gpRRf8NREMUcYg9gGe0u8WITrO0zwVeRA3COtRxhQ/exec"
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

Decode exact post date using BigInt (run in Chrome via javascript_tool):
```javascript
const ms = Number(BigInt('{POST_ID}') >> 22n);
new Date(ms).toISOString().split('T')[0]; // YYYY-MM-DD (UTC)
```
LinkedIn snowflake IDs encode Unix ms in the top 42 bits. This gives the exact
UTC creation date with no approximation needed.

Note: LinkedIn shows relative dates ("3d", "2w", "1mo") on the analytics page.
Always decode from the post ID instead. The decoded date may differ by 1 day
from IST (UTC+5:30); use as-is unless Nikhil corrects.

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

Call doGet to read the current post list from the sheet:

```javascript
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwIhve8swG3i604K4Y5CxPKsecu_gpRRf8NREMUcYg9gGe0u8WITrO0zwVeRA3COtRxhQ/exec';
(async () => {
  const r = await fetch(WEBAPP_URL, { redirect: 'follow' });
  const data = await r.json();
  return data.posts; // [{postNum, date, url}, ...]
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
  const r = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts: [ /* array of post objects */ ] })
  });
  return await r.text();
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

POST to the Web App using no-cors + text/plain to avoid CORS preflight:

```javascript
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwIhve8swG3i604K4Y5CxPKsecu_gpRRf8NREMUcYg9gGe0u8WITrO0zwVeRA3COtRxhQ/exec';

await fetch(WEBAPP_URL, {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify({ posts: [row1, row2] })
});
```

CORS note: Apps Script Web Apps do not handle OPTIONS preflight correctly.
Using mode: 'no-cors' + Content-Type: text/plain bypasses the preflight.
The body is still valid JSON — Apps Script parses it correctly.
Response is opaque — always verify success via a separate doGet call after posting.

---

## Step 5: Verify and Report

After posting, call doGet and confirm new or updated rows are present.

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

## Important: Correcting Non-Metric Columns on Existing Rows

The updateLinkedInKPI function preserves columns 1-9 and column 33 for existing
rows (editorial data and post text are never overwritten). To correct dates,
URLs, topics, patterns, or other non-metric fields, the Apps Script must do a
direct range write rather than calling updateLinkedInKPI. Build a fresh full row
and write it directly to the correct row range, or fix manually in the sheet.
