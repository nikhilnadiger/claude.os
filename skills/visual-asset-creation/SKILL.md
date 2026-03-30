---
name: visual-asset-creation
version: 1.1
description: >
  Use for creating any staffroom visual asset: YouTube thumbnails, Instagram
  Reel covers, quote cards, data visualisation cards, LinkedIn post images,
  carousel sequences, WhatsApp graphics, and video production briefs. Triggers:
  'create a thumbnail', 'make a visual', 'design a quote card', 'thumbnail
  for this video', 'visual for this reel', 'create an asset', 'make a graphic',
  'data card', 'image for this post', 'carousel', 'video brief', 'fetch an
  image', 'create a figma file'. This skill routes to the right creation
  path (Gemini prompt, Figma MCP, or real image) based on asset type.
  Not for script writing (use content-strategy) or brand voice review
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
  - "create a figma file"
  - "fetch an image for"

uses_references:
  - references/asset-creation-guide.md
  - references/gemini-assets.md
  - references/figma-assets.md
  - references/real-image-assets.md
  - references/video-brief-template.md

related_skills:
  - content-strategy
  - brand-custodian

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

1. **Gemini path** — Claude generates a precise Imagen 3 prompt + specifies
   which logo file to upload alongside it → Nikhil pastes prompt + logo into
   Gemini → gets a final, ready-to-use image. No post-generation edits.
2. **Figma MCP path** — Claude designs the asset directly in Figma via MCP
   (typography, brand colours, text content, logo placement). Best for
   design-only assets that do not need AI imagery: data cards, quote cards,
   text-heavy layouts, carousels.
3. **Real image path** — Claude fetches a credible real image (government
   website, company site, Wikipedia, press archive) via WebFetch, then places
   it in a Figma layout via MCP with brand overlays. No AI generation needed.

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
- Building an editable asset in Figma

## When NOT to Load This Skill

- Writing scripts or content — use content-strategy
- Brand voice review of text — use brand-custodian
- Technical Figma design work (component design, design system) — different workflow

## Key Rules

1. **Always read `brand-custodian/references/visual-identity.md` first**
   before writing any prompt or building any Figma asset. Never recall brand
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
   opening Figma — it contains path-specific templates, the thumbnail formula,
   carousel structure rules, video brief format, and real image guidance.

## Creation Path Decision

| Asset type | Best path |
|---|---|
| Thumbnail, Reel cover, illustrated scenes | Gemini |
| Data card, quote card, text post | Figma MCP |
| Real school/teacher/organisation photo | Real image + Figma MCP |
| Carousel sequence | Figma MCP (all frames in one file) |
| Meta ad creative (static) | Gemini or Figma MCP |
| Video (Short, Reel, ad) | Video Production Brief |

## Workflow

1. Read `brand-custodian/references/visual-identity.md` — confirm exact
   brand colours, typography, and which logo variant to use
2. Read `references/asset-creation-guide.md` — use the Creation Path Decision
   table to determine which path and which reference file to load next
3. Read the relevant path reference file:
   - **Gemini path** → read `references/gemini-assets.md`
   - **Figma MCP path** → read `references/figma-assets.md`
   - **Real image path** → read `references/real-image-assets.md`
   - **Video Production Brief** → read `references/video-brief-template.md`
4. For **Gemini path**: write the prompt, specify the logo file to upload
   alongside it, and note output dimensions. Deliver as a ready-to-paste block.
5. For **Figma MCP path**: use the Figma MCP (`use_figma`) to build the asset —
   brand colours, typography, text content, logo. Share the Figma file link.
6. For **Real image path**: fetch the image via WebFetch, confirm it is
   appropriate and credible, then use Figma MCP to place it in a branded layout.
7. For **Video Production Brief**: produce the brief in the standard format from
   video-brief-template.md.

## Output Format

**Gemini path:**
```
**Asset:** [type + channel]
**Dimensions:** [e.g., 1280×720px, 9:16]
**Logo to upload alongside prompt:** [variant name from assets/logos/]

**Gemini/Imagen 3 Prompt:**
[prompt — ready to copy-paste]
```

**Figma MCP path:** Share Figma file link with description of what was built.

**Real image path:** Share Figma file link + cite source URL of the image used.

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
