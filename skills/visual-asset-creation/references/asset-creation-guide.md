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
| YouTube thumbnail | Gemini | gemini-assets.md |
| Instagram Reel cover / Short cover | Gemini | gemini-assets.md |
| Meta ad (illustrated scene) | Gemini | gemini-assets.md |
| Quote card | Figma MCP | figma-assets.md |
| Data visualisation card | Figma MCP | figma-assets.md |
| LinkedIn post image | Figma MCP | figma-assets.md |
| Carousel sequence | Figma MCP | figma-assets.md |
| Meta ad (data-led / text-heavy) | Figma MCP | figma-assets.md |
| Real school/person/org photo | Real image + Figma MCP | real-image-assets.md |
| Video (Short, Reel, ad, episode) | Video Production Brief | video-brief-template.md |

---

## General Rules (all asset types)

- **No real people's faces** in Gemini-generated images — illustrated
  characters, silhouettes, or abstract compositions only
- **Indian context is mandatory** — school settings, classroom objects,
  Indian-looking illustrated characters, Indian educational contexts
- **Text in Gemini prompts: 3–5 words max** — add longer text via Figma MCP;
  Imagen 3 fails on long text
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
- Text passages longer than 5 words in Gemini (add in Figma)
- Specific school logos or third-party brands (without permission)
- News screenshots or document mockups
- Photorealistic imagery in Gemini (use illustration style — photorealism is inconsistent)
- Any content that could be read as defamatory toward a school or person
- Images using semantic UI colours (#3D9970, #C04B3A, #E8D485, #9E9E96)
  in marketing contexts

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
