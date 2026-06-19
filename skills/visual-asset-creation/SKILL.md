---
name: visual-asset-creation
version: 1.3
description: >
  Use for creating any staffroom visual asset: YouTube thumbnails, Instagram
  Reel covers, quote cards, data visualisation cards, LinkedIn post images,
  carousel sequences, WhatsApp graphics, and video production briefs. Triggers:
  'create a thumbnail', 'make a visual', 'design a quote card', 'thumbnail
  for this video', 'visual for this reel', 'create an asset', 'make a graphic',
  'data card', 'image for this post', 'carousel', 'video brief', 'fetch an
  image'. This skill routes to the right creation path (Gemini illustration
  prompt, Gemini + PowerPoint two-step, or PowerPoint-only) based on asset
  type. Not for script writing (use content-strategy) or brand voice review
  (use brand-custodian).

triggers:
  - "create a thumbnail"
  - "make a visual"
  - "design a quote card"
  - "thumbnail for this video"
  - "visual for this reel"
  - "create an asset"
  - "make a graphic"
  - "data card"
  - "image for this post"
  - "reel cover"
  - "YouTube thumbnail"
  - "carousel"
  - "video brief"
  - "fetch an image for"

uses_references:
  - references/asset-creation-guide.md
  - references/gemini-assets.md
  - references/pptx-assets.md
  - references/real-image-assets.md
  - references/video-brief-template.md

related_skills:
  - content-strategy
  - brand-custodian
  - meta-ad-creation

live_references:
  - label: Visual Identity (brand colours, typography, logo system)
    path: claude.os/skills/brand-custodian/references/visual-identity.md
    tool: read_file
  - label: Logo assets
    path: claude.os/assets/logos/
    tool: read_file
  - label: Social & template assets
    path: claude.os/assets/social/
    tool: read_file
---

# visual-asset-creation

## Purpose

Creates every type of staffroom visual asset across three creation paths:

1. **Gemini standalone path** — Claude generates an Imagen 3 prompt + specifies
   which logo file to upload → Nikhil pastes prompt + logo into Gemini → image
   is the final deliverable. No PPTX step.
   Use when: the asset needs no text overlay (pure illustration, abstract
   background, visual-only asset). Claude decides based on whether the brief
   requires readable copy on top of the image.
   **Critical:** When this image will later go into a PPTX, add "absolutely no
   text, numbers, or words in the image" and define clear zones for PPTX layers.
   Never mix Gemini-baked text with PPTX overlays — text will clash and appear twice.
2. **Gemini + PowerPoint (two-step) path** — Gemini generates the illustration-
   only background; Claude then builds a PPTX file (python-pptx) with the
   Gemini image as the full-bleed background and all text, copy, URLs, pills,
   and logo as PPTX layers on top. Best for WhatsApp graphics, Meta ads,
   thumbnails, and Reel covers that need both a rich illustrated scene and
   substantial readable copy.
3. **PowerPoint path** — Claude builds the asset entirely in PPTX using brand
   colour fills (no Gemini background needed). Best for data cards, quote cards,
   carousels, and text-heavy layouts.
4. **Real image path** — Claude fetches a credible real image (government
   website, company site, Wikipedia, press archive) via WebFetch, then builds a
   PPTX with the real image as background and brand text overlays on top.

For video assets, Claude produces a **Video Production Brief** — a complete
document (script, visual guide, voice directions, timing) that can be handed
to an AI video agent or a human creator without any additional briefing.

## When to Load This Skill

- Creating a YouTube thumbnail for a new video
- Creating a Reel cover frame or Instagram post image
- Creating a quote card from a teacher quote or data point
- Creating a data visualisation card (salary range, rating breakdown, etc.)
- Creating a LinkedIn post image
- Creating a carousel sequence (multiple images with logical flow)
- Creating a WhatsApp graphic
- Producing a Meta ad creative
- Creating a video production brief for short or long-form video
- Fetching and placing a real image from an external source

## When NOT to Load This Skill

- Writing scripts or content — use content-strategy
- Brand voice review of text — use brand-custodian
- Reading existing Figma designs for reference — use Figma MCP directly (read-only)
- Note: Figma MCP cannot create or edit assets; all asset creation uses PPTX

## Key Rules

1. **Always read `brand-custodian/references/visual-identity.md` first**
   before writing any prompt or building any PPTX. Never recall brand
   colours or typography from memory — they must be read from the source.
   Using wrong colours or fonts is a critical error that invalidates the asset.
2. **Brand colours only in all marketing assets** — Deep Forest Green #043630,
   Dark Teal #004D43, Warm Cream #E6D7B6, Soft Mint #F1FEF8, Lime Accent #D0FF71.
   Semantic colours (#3D9970, #C04B3A, #E8D485, #9E9E96) are for product UI only
   — never in marketing or content assets.
3. **Typography** — Headings: Zalando Sans SemiExpanded (Medium/Bold).
   Body: Satoshi (Regular/Medium/Bold). No other typefaces.
4. **Logo is in the prompt, not post-generation** — for the Gemini path,
   specify the exact logo variant to upload alongside the prompt so Gemini
   bakes it into the generated image. Specify position and background-matching
   variant (dark logo on light bg, light logo on dark bg).
5. **No real people's faces** in Gemini-generated images — illustrated
   characters, silhouettes, or abstract compositions only.
6. **Prompt length for Gemini: 50–150 words** — outside this range outputs degrade.
7. **Semantic colours are UI-only** — never use #3D9970, #C04B3A, #E8D485,
   or #9E9E96 in marketing assets, thumbnails, social posts, or ad creatives.
8. **Always read asset-creation-guide.md** before writing any prompt or
   building any PPTX — it contains path-specific templates, the thumbnail
   formula, carousel structure rules, video brief format, and real image
   guidance.

## Design Quality Standard

Brand compliance (Key Rules above) is the floor. It is not the goal.

The goal of every marketing asset is to **earn a forward** — a teacher
shares it with colleagues, a principal sends it to teachers. An asset that
is on-brand but does not earn that action has failed its purpose.

Before finalising any asset, apply these checks in order:

**1. Hierarchy — one dominant element**
Every asset must have one thing that hits first: a headline, a number, an
illustration, a face. If two elements compete for attention, the asset is
broken. Fix by making one bigger or removing the other.

**2. Breathing room — restraint over completeness**
Resist filling every zone. Empty space is not wasted — it directs the eye
and signals confidence. If the copy can be cut, cut it. If a stat can be
removed without losing the message, remove it.

**3. The 3-second test**
Simulate the WhatsApp scroll: would the message land in 3 seconds on a
phone screen? If not, it will be skipped. Only the headline, dominant visual,
and CTA need to survive this test. Everything else is secondary.

**4. The forward test**
Ask: would a teacher forward this to a colleague? Would a principal send
this to their staff? If the honest answer is "maybe" or "probably not", the
asset is not done. The emotional hook is missing or the copy is too heavy.
Common fixes: cut body copy by half, make the headline more specific, ensure
the illustration or visual centrepiece has room to breathe.

**5. Delight — one unexpected element**
Every strong asset has one element that rewards the eye: an accent line, an
oversize number, a brandmark, a single word in a contrasting colour. This
is layer 5. It costs nothing to add and is often what makes the difference
between "informative" and "shareable."

These checks apply **before writing PPTX code**, not after. Design on paper
or in text first. Code second.

---

## Creation Path Decision

| Asset type | Best path |
|---|---|
| Illustrated scene — no text needed | Gemini standalone |
| Thumbnail / Reel cover — needs text hook | Gemini + PowerPoint (two-step) |
| WhatsApp graphic / Meta ad — needs copy | Gemini + PowerPoint (two-step) |
| Data card, quote card, text post | PowerPoint only |
| Real school/teacher/organisation photo | Real image + PowerPoint |
| Carousel sequence | PowerPoint only (all frames in one PPTX) |
| Video (Short, Reel, ad) | Video Production Brief |

**Claude decides the path** by evaluating whether the brief requires readable
copy on the asset. If no text is needed → Gemini standalone. If text is needed
on top of an illustration → Gemini + PowerPoint. If no illustration needed
→ PowerPoint only. When in doubt, ask Nikhil.

## Workflow

1. Read `brand-custodian/references/visual-identity.md` — confirm exact
   brand colours, typography, and which logo variant to use
2. Read `references/asset-creation-guide.md` — use the Creation Path Decision
   table to determine which path and which reference file to load next
3. Read the relevant path reference file:
   - **Gemini + PowerPoint path** → read `references/gemini-assets.md` then `references/pptx-assets.md`
   - **PowerPoint only path** → read `references/pptx-assets.md`
   - **Real image path** → read `references/real-image-assets.md` then `references/pptx-assets.md`
   - **Video Production Brief** → read `references/video-brief-template.md`
4. For **Gemini + PowerPoint (two-step) path**:
   a. Write the illustration-only Gemini prompt (no text in image, clear zones
      defined). Deliver as a ready-to-paste block for Nikhil to run in Gemini.
   b. Nikhil runs the prompt in Gemini, downloads the image, uploads it to chat.
   c. Claude receives the image, builds a PPTX using python-pptx: image as
      full-bleed background layer, then ALL text (headline, copy, pills, URL,
      logo) as PPTX layers on top. See `references/pptx-assets.md` for specs.
   d. Save PPTX to working directory, deliver `computer://` link. Nikhil exports
      each slide as PNG (File → Export → PNG, highest quality).
5. For **PowerPoint only path**: build directly in PPTX with brand colour fills
   (no Gemini step). See `references/pptx-assets.md` for asset-type specs.
6. For **Real image path**: fetch the image via WebFetch, confirm it is
   appropriate and credible, then embed it as background in a PPTX and add
   brand text overlays. See `references/pptx-assets.md` for specs.
7. For **Video Production Brief**: produce the brief in the standard format from
   video-brief-template.md.

## Output Format

**Gemini + PowerPoint (two-step) — Step 1 output:**
```
**Asset:** [type + channel]
**Dimensions:** [e.g., 1080×1080px, 1:1]
**Logo to upload alongside prompt:** [variant name from assets/logos/]

**Gemini/Imagen 3 Prompt (illustration-only — no text in image):**
[prompt — ready to copy-paste]

→ Run this in Gemini, download the image, and upload it here to continue.
```

**Gemini + PowerPoint — Step 2 output (after Nikhil uploads image):**
Claude builds and saves the PPTX. Deliver as:
```
[View your asset](<computer://link to .pptx file>)

Open in PowerPoint → File → Export → PNG → highest quality.
Each slide exports as a separate PNG.
```

**PowerPoint only path:** Build PPTX, save, deliver `computer://` link with export instructions.

**Real image path:** Fetch image via WebFetch, build PPTX with image as background, deliver link + cite image source URL.

**Video Production Brief:** Markdown document — see format in video-brief-template.md.

---

## Brand Colour Reference (always verify against visual-identity.md)

| Colour | Name | Hex | Use in assets |
|---|---|---|---|
| Primary | Deep Forest Green | #043630 | Dark backgrounds, strong brand anchor |
| Secondary dark | Dark Teal | #004D43 | Secondary dark backgrounds, depth |
| Secondary light | Warm Cream | #E6D7B6 | Warm light backgrounds, text containers |
| Light | Soft Mint | #F1FEF8 | Light backgrounds, near-white |
| Accent | Lime Accent | #D0FF71 | Highlights, emphasis, energy elements |

**Semantic colours — NOT for marketing assets:**
#3D9970 (Success), #C04B3A (Error), #E8D485 (Loading), #9E9E96 (Neutral)
These exist for product UI states only.

Full source: `brand-custodian/references/visual-identity.md`
Logo files: `assets/logos/`
Social templates: `assets/social/`
