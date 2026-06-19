---
skills:
  - meta-ad-creation
purpose: >
  Gate 4 Meta Ads Setup Brief specification. Claude (not the council)
  produces this brief from all approved Gate 0–3 outputs plus the
  confirmed targeting and budget parameters from the self-briefing sweep.
last_updated: Jun 2026
---

# Meta Ads Setup Brief — Gate 4

Claude produces this brief after all required production briefs are approved.
Nikhil approves this brief before any ad goes live. No exceptions.

---

## UTM Schema

Standard UTM parameter structure for all staffroom Meta Ads:

| Parameter | Value |
|---|---|
| `utm_source` | `meta` |
| `utm_medium` | `paid_social` |
| `utm_campaign` | [campaign name — snake_case, include objective and month/year, e.g., `review_submissions_jun2026`] |
| `utm_content` | [script ID — e.g., `script_3a`, `script_1b`] |
| `utm_term` | [format tag — `static`, `ai_avatar`, `ai_video`, or `carousel`] |

**Build one complete UTM string per creative.** Present as a table:

| Script ID | Creative Name | Full UTM URL |
|---|---|---|
| script_1a | [Route 1 name — Format] | https://thestaffroom.in/[landing-path]?utm_source=meta&utm_medium=paid_social&utm_campaign=[name]&utm_content=script_1a&utm_term=[format] |

Pre-launch verification: paste each destination URL into a browser and
confirm the landing page loads correctly. See pre-launch checklist below.

---

## Budget Structure

**Default: ABO (Ad Set Budget Optimisation)**
Gives Nikhil direct control and per-ad-set visibility into CPR. This is
always the starting point.

**CBO (Campaign Budget Optimisation):** Only switch if:
1. Meta surfaces a strong CBO recommendation after ≥72 hours of ABO data, AND
2. Nikhil explicitly approves the switch in writing.

**Never switch to CBO mid-flight without Nikhil's written approval.**

Rationale: ABO keeps attribution clean per route. With a small number of ad
sets (one per creative route), the benefit of CBO's algorithmic reallocation
is minimal and the loss of per-route CPR visibility is not worth it at this
stage.

---

## Ad Set Structure

**One ad set per creative route (from Gate 1).** Do not mix routes in the
same ad set — mixed ad sets make CPR attribution ambiguous and prevent
clean iteration decisions.

Ad set naming convention:
`[campaign_name]_[route_name]_[format]`

Example: `review_jun2026_good_school_static`

---

## Ad Copy Format

For each creative, Gate 4 delivers the following copy fields:

| Field | Spec | Notes |
|---|---|---|
| Primary text | Up to 125 characters | Body copy that appears above the creative in Feed |
| Headline | Up to 27 characters | Bold text below the creative |
| Description | Up to 27 characters | Optional — appears below headline |
| CTA button | "Learn More" or "Sign Up" | "Sign Up" when objective is direct registration; "Learn More" default |
| Display URL | `thestaffroom.in` | Always — do not use the full path as display URL |
| Destination URL | Full URL with UTM string appended | From the UTM table above |

**staffroom is always lowercase in all copy fields.** No "StaffRoom" or
"Staffroom" — in primary text, headline, description, and display URL.

---

## Audience Targeting Spec

Claude fills this template per campaign from confirmed self-briefing sweep inputs:

**Geography**
- Cities and radius: [confirmed from self-briefing sweep — list each city
  with radius in km]
- Country: India

**Language**
- English (default, always included)
- Add regional language targeting only if bilingual creative is included
  for that region (e.g., add Kannada if a Kannada-English script is in this
  campaign targeting Bengaluru)

**Interest targeting — base layers (always include)**
- Private school teachers
- Education (broad)
- Teaching / Teacher (interest)

**Campaign-specific interest layers**
- [Add based on campaign objective and council's audience definition from Gate 0]
- IB/Cambridge segment: available as an interest layer — include only if
  Gate 0 brief specifically targets that teacher segment

**Exclusions**
- Prior converters: exclude if the campaign objective is new registrations
  and retargeting is not the brief
- [Any campaign-specific exclusions confirmed by Nikhil]

**Note on targeting constraints at bootstrapped scale:** At early-stage
budget levels, avoid hyper-narrow layering. The audience should be large
enough for the algorithm to find the signal. Narrow to the city level first
— interest stacking comes after CPR data proves the base audience is working.

---

## Pre-Launch Checklist

Claude confirms all of the following before presenting the Gate 4 brief
to Nikhil for approval:

1. **UTM parameters verified** — paste each destination URL into a browser;
   confirm landing page loads correctly and is not a 404 or redirect loop.
2. **Pixel firing confirmed** — Events Manager shows `CompleteRegistration`
   firing on form submission. Do not assume it is live — verify before launch.
3. **Ad copy confirmed against each creative** — no mismatch between the
   primary text promise and what the landing page actually delivers to the user.
4. **Campaign objective set correctly** — Conversions → `CompleteRegistration`.
   Not Traffic, not Reach, not Link Clicks.
5. **Budget optimisation confirmed as ABO** — not CBO unless Nikhil has
   approved a switch in writing.
6. **Bid strategy confirmed as Lowest Cost** — not Bid Cap (Bid Cap
   requires CPR benchmark data to set correctly; default to Lowest Cost
   until at least 2 campaigns of data exist).
7. **Scheduling confirmed** — start date correct; no end date set unless
   explicitly required by the campaign brief.
8. **Ad set naming convention applied** — `[campaign_name]_[route_name]_[format]`
   for every ad set.
9. **Ad naming convention applied** — `[script_id]_[language_variant]` for
   every ad. Examples: `script_3a_en`, `script_3a_kaen` (Kannada-English).
10. **staffroom lowercase verified** — in all copy fields across all ads;
    no capitalisation variant anywhere.
