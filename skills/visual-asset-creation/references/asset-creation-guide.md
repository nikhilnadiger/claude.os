---
skills: [visual-asset-creation]
last_updated: Mar 2026
source: brand-custodian/references/visual-identity.md
---

# Asset Creation Guide

**BEFORE USING ANY TEMPLATE:** Read `brand-custodian/references/visual-identity.md`
to confirm the current brand colour palette and typography. Never write colour
codes from memory.

---

## Brand Quick Reference (verify against visual-identity.md)

| Name | Hex | Usage |
|---|---|---|
| Deep Forest Green | #043630 | Primary dark — backgrounds, text on light |
| Dark Teal | #004D43 | Secondary dark, depth layers |
| Warm Cream | #E6D7B6 | Warm light backgrounds, text containers |
| Soft Mint | #F1FEF8 | Near-white backgrounds |
| Lime Accent | #D0FF71 | Accent, highlights, energy elements |

**Semantic colours** (#3D9970, #C04B3A, #E8D485, #9E9E96) — **never use
in marketing assets**. Product UI states only.

**Typography:** Headings = Zalando Sans SemiExpanded (Medium/Bold). Body = Satoshi.

**Logo:** `logo-light.png` on dark backgrounds; `logo-dark.png` on light backgrounds.

---

## Creation Path Decision

| Asset type | Path | Reference file |
|---|---|---|
| YouTube thumbnail | Gemini + PowerPoint | gemini-assets.md → pptx-assets.md |
| Instagram Reel cover / Short cover | Gemini + PowerPoint | gemini-assets.md → pptx-assets.md |
| WhatsApp graphic | Gemini + PowerPoint | gemini-assets.md → pptx-assets.md |
| Meta ad (illustrated scene + copy) | Gemini + PowerPoint | gemini-assets.md → pptx-assets.md |
| Quote card | PowerPoint only | pptx-assets.md |
| Data visualisation card | PowerPoint only | pptx-assets.md |
| LinkedIn post image | PowerPoint only | pptx-assets.md |
| Carousel sequence | PowerPoint only | pptx-assets.md |
| Meta ad (data-led / text-heavy) | PowerPoint only | pptx-assets.md |
| Real school/person/org photo | Real image + PowerPoint | real-image-assets.md → pptx-assets.md |
| Video (Short, Reel, ad, episode) | Video Production Brief | video-brief-template.md |

---

## General Rules (all asset types)

- **No real people's faces** in Gemini-generated images — illustrated
  characters, silhouettes, or abstract compositions only
- **Indian context is mandatory** — school settings, classroom objects,
  Indian-looking illustrated characters, Indian educational contexts
- **Illustration-only mode in Gemini (mandatory for Gemini + PPTX path):** include
  "absolutely no text, numbers, or words in the image" — all copy goes in the PPTX step.
  Never mix Gemini-baked text with PPTX overlays; text will appear twice and clash.
- **Prompt length for Gemini: 50–150 words** — outside this range outputs degrade
- **Style keyword for Gemini:** "flat illustration, warm colour palette,
  Indian educational context" unless the asset type requires otherwise

---

## Logo Usage in Gemini Prompts

For the Gemini path, Nikhil uploads the logo file alongside the prompt.
Claude must specify:
- **Which variant:** `logo-dark.png` on light/cream backgrounds; `logo-light.png`
  on dark/forest/teal backgrounds
- **Position:** bottom-right (default), bottom-left, or centered bottom
- **Clear zone:** "small clear rectangular zone at [position] for logo placement"

When Nikhil uploads the logo file + pastes the prompt into Gemini, the
generated image has the logo baked in. No post-generation editing needed.

---

## Do-Not-Generate List

- Real named public figures' faces or likenesses
- Any text in Gemini prompts when a PPTX step follows — use illustration-only mode
- Specific school logos or third-party brands (without permission)
- News screenshots or document mockups
- Photorealistic imagery in Gemini (use illustration style — photorealism is inconsistent)
- Any content that could be read as defamatory toward a school or person
- Images using semantic UI colours (#3D9970, #C04B3A, #E8D485, #9E9E96)
  in marketing contexts

---

## PowerPoint Path

**When to use:** All assets that need text, copy, data, or layout — whether
or not they also have a Gemini illustration background.

Claude builds PPTX files programmatically using python-pptx. Nikhil opens
the file in PowerPoint (Mac) and exports each slide as PNG.

**Setup:** `pip install python-pptx --break-system-packages`

**Full spec (slide dimensions, colour codes, font spec, asset-type layouts,
export instructions):** see `references/pptx-assets.md`.

**Critical rule:** If the PPTX uses a Gemini image as background, that
Gemini image must be illustration-only (no text). If Gemini baked in text,
the PPTX must have zero text overlays. Never mix.

---

## Video Production Brief

**When to use:** Any video asset — YouTube Short, Instagram Reel, Meta video
ad, YouTube long-form episode. The completed brief can be handed to an AI
video agent or a human creator with no additional context.

**Template:** See `references/video-brief-template.md` for the full template
including 5-beat script structure, Visual Guide table, Voice Direction,
Text Overlays, B-Roll list, Branding section, and Sources.

**Brief includes:** Platform, Duration, Pillar, Hook type, Language, 5-beat
script (Opening 0–3s → Reinforcement 4–7s → Core Value 8–30s → Escalation
31–50s → Closing 51–60s), visual guide per time segment, voice direction,
text overlays, B-roll needs, and all branding/source requirements.
