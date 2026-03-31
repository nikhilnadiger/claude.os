---
last_updated: "Mar 2026"
skill: nikhil-linkedin
purpose: >
  Step-by-step workflow for updating the LinkedIn KPI Sheet when Nikhil shares
  a new post URL. Runs in Chrome. No manual data entry required from Nikhil.
---

# LinkedIn KPI Update Workflow

## Trigger
Nikhil shares a LinkedIn post URL in conversation — new or existing.

## Pre-condition
Chrome must be open and logged in as nikhilnadiger@gmail.com.
If not: ask Nikhil to open Chrome with that profile before proceeding.

---

## Step 1: Extract Post ID
From the URL: `https://www.linkedin.com/feed/update/urn:li:activity:{POST_ID}/`
Extract `{POST_ID}` — the numeric ID used to build analytics URLs.

---

## Step 2: Fetch Analytics for the New Post

Navigate to the post summary analytics page:
```
https://www.linkedin.com/analytics/post-summary/urn:li:activity:{POST_ID}/
```
Use `get_page_text` to extract all metrics in one call. Capture:
- Impressions, Members Reached, Reactions, Comments, Reposts, Saves, Sends
- Profile Viewers, Followers Gained
- Full post text (visible on this page)

Then navigate to demographics:
```
https://www.linkedin.com/analytics/demographic-detail/urn:li:activity:{POST_ID}/?metricType=IMPRESSIONS
```
Use `get_page_text` to extract:
- Top Seniority + %, Top Location + %
- Top Industry #1 + %, Top Industry #2 + %
- Top Job Title + %
- Education Sector Reach % (sum of Education + Education Admin Programs industry %)

Note: Demographics are unavailable for posts older than 360 days. Mark as "n/a" if unavailable.

---

## Step 3: Refresh Recent Posts (< 30 days old)

For any existing posts in the Sheet with a date within the last 30 days,
repeat Step 2 for each. Their engagement may still be accumulating.

Posts older than 30 days: skip. Data is stable.

The post list and dates are in the KPI Sheet (live_references in SKILL.md).
Check column B (Date) to identify which posts qualify.

---

## Step 4: Write to Google Sheet

Open the KPI Sheet (see live_references in SKILL.md).
Open Extensions → Apps Script and run `updateLinkedInKPI(postData)`:

```javascript
// Call this from the Apps Script editor to add/update a post row
// postData is an array matching the 33-column header order
updateLinkedInKPI(postData);
```

The `updateLinkedInKPI` function (already in the Sheet's Apps Script):
- Checks if a row for that Post # already exists
- If yes: updates the row in-place (for refreshing recent posts)
- If no: appends a new row and increments Post #

For refreshed posts, only overwrite the metric columns (J–AM).
Never overwrite Post #, Date, URL, Topic, Pattern, Audience Tags, Format,
Hashtags, Word Count, or Full Post Text for existing posts — those are set once.

---

## Step 5: Derive Calculated Metrics

Before writing, compute:
- **Engagement Rate %** = (Reactions + Comments + Reposts) / Impressions × 100
- **Deep Engagement %** = (Comments + Reposts + Saves) / Impressions × 100
- **Comment:Reaction Ratio %** = Comments / Reactions × 100 (use "n/a" if Reactions = 0)

Round all to 2 decimal places.

---

## Step 6: Confirm and Report

After writing, confirm:
- Row count in Sheet matches expected post count
- New post row is present with correct Post #
- Any refreshed rows show updated values

Report back to Nikhil:
- New post # and impressions captured
- Which recent posts were refreshed
- Link to the Sheet

---

## Tagging the New Post

Before running the update, ask Nikhil (or infer from post content):
- **Topic / Hook** — 1-line summary of what the post is about
- **Post Pattern** — which of the 11 patterns it uses (see post-patterns.md)
- **Audience Tags** — Hires / Investors / Partners (can be multiple)
- **Format** — Text only / Text + Link / Text + Image / etc.

These are editorial tags, not scraped from LinkedIn. Claude should propose them
based on reading the post; Nikhil confirms or corrects.

---

## Refresh Frequency Reference

| Post age | Action on update run |
|---|---|
| New post | Always add |
| < 30 days | Refresh metrics |
| 30–90 days | Skip (stable, but check if a post is trending) |
| > 90 days | Skip |
| > 360 days | No demographics available — mark as n/a if not already |
