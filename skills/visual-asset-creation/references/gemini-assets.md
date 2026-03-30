---
skills: [visual-asset-creation]
last_updated: Mar 2026
source: brand-custodian/references/visual-identity.md
---

# Gemini Path Assets

**BEFORE USING:** Read `brand-custodian/references/visual-identity.md` to
confirm current brand colours and typography. Never write colour codes from memory.

Covers: YouTube thumbnails, Instagram/Short Reel covers, Meta ad illustrated
scenes. All use the Gemini/Imagen 3 path — Claude generates a prompt, Nikhil
uploads the logo file alongside it in Gemini, and gets a final ready-to-use image.

---

## Brand Quick Reference (verify against visual-identity.md)

| Name | Hex | Use |
|---|---|---|
| Deep Forest Green | #043630 | Primary dark backgrounds |
| Dark Teal | #004D43 | Secondary dark backgrounds |
| Warm Cream | #E6D7B6 | Warm light backgrounds, text containers |
| Soft Mint | #F1FEF8 | Near-white backgrounds |
| Lime Accent | #D0FF71 | Highlights, emphasis |

**Semantic colours (#3D9970, #C04B3A, #E8D485, #9E9E96) — never in marketing assets.**

Typography: Headings = Zalando Sans SemiExpanded (Medium/Bold). Body = Satoshi.

---

## Logo in Gemini Prompts

Nikhil uploads the logo file alongside the prompt. Specify in every prompt:
- **Which variant:** `logo-dark.png` on light/cream backgrounds; `logo-light.png`
  on dark/forest/teal backgrounds
- **Position:** bottom-right (default), bottom-left, or centered bottom
- **Clear zone:** "small clear rectangular zone at [position] for logo placement"

---

## General Gemini Rules

- No real people's faces — illustrated characters, silhouettes, or abstract only
- Indian context mandatory — South Asian character appearance, Indian school
  settings, Indian classroom objects
- Text in prompt: 3–5 words max — add longer text via Figma MCP after generation
- Prompt length: 50–150 words — outside this range outputs degrade
- Style keyword: "flat illustration, warm colour palette, Indian educational context"

---

## Asset Type 1: YouTube Thumbnail

**Dimensions:** 1280×720px (16:9)
**Goal:** Stop the scroll in YouTube search results. Readable at small size,
communicates value in under 1 second.

**Formula (from IB Salary and IGCSE top performers):**
Large readable text + visual anchor + brand colour background

**Composition:**
- Left 60%: completely clear — reserved for text overlay (added via Figma MCP)
- Right 40%: illustrated Indian teacher character OR topic-relevant visual
- Background: Deep Forest Green #043630 or Dark Teal #004D43 (high contrast)
- Accent: Lime Accent #D0FF71 for emphasis elements
- Logo: bottom-right — upload `logo-light.png` alongside prompt

**Prompt template:**
```
Flat illustration, Indian educational context, warm colour palette.
Background: deep forest green (#043630). Right 40% of image: illustrated
Indian teacher character, gender [male/female], professional appearance,
warm expression, facing slightly left, fills 40% of image height. Left 60%:
completely clear, no text, no elements — reserved for text overlay. Small
clear rectangular zone at bottom-right corner for logo placement. Accent
element: lime green (#D0FF71) used sparingly in character clothing or
background detail. Style: clean, friendly, high contrast, readable at
small thumbnail size. No real faces, no Western school imagery, no
gradients, no text or words.

Upload alongside: logo-light.png — place at bottom-right clear zone.
```

**Customise by pillar:**
- Career/Salary: rupee symbol illustration, school building silhouette
- Teaching Practice: chalkboard, illustrated students, teaching tools
- Wellbeing: softer composition, Warm Cream background (#E6D7B6), contemplative character

**After Gemini:** Use Figma MCP to add text overlay (Zalando Sans SemiExpanded Bold,
3–6 words) on the left 60% clear space.

---

## Asset Type 2: Instagram Reel Cover / YouTube Short Cover

**Dimensions:** 1080×1920px (9:16)
**Goal:** First frame visible before play — communicates what the video is about
and entices a tap.

**Prompt template:**
```
Flat illustration, Indian educational context, 9:16 vertical format.
Background: [deep forest green #043630 / warm cream #E6D7B6 — dark for
authority, warm for emotional content]. Centre of image: [describe central
visual — e.g., illustrated Indian teacher character standing, looking forward,
professional and warm]. Top 25% of image: completely clear — no text, no
elements, reserved for hook text overlay. Bottom 15% of image: clear —
reserved for UI overlap. Small clear zone at upper-right for logo placement.
Lime accent (#D0FF71) used sparingly. Style: flat illustration, high contrast,
bold, readable as a still frame on a phone screen. No real faces.

Upload alongside: [logo-light.png on dark bg / logo-dark.png on light bg]
— place at upper-right clear zone.
```

**After Gemini:** Use Figma MCP to add hook text in top 25%
(Zalando Sans SemiExpanded Bold).

---

## Asset Type 3: Meta Ad Creative (Gemini variant)

**Use Gemini when:** the ad needs an illustrated scene background.
**Use Figma MCP instead when:** the ad is data-led or text-heavy (see figma-assets.md).

**Dimensions:** 1080×1080px (1:1) for feed; 1080×1920px (9:16) for Stories ads

**What Meta Ads data shows:**
- Salary-intent creative: CPR ₹98 — most efficient
- Kannada-English (KaEn) bilingual: CPR ₹144 vs English-only ₹279 — mandatory
  for Bengaluru targeting
- AI Avatar format: CPR ₹101 — worth scaling
- Hook must retain viewer past 5 seconds (VPT correlates with CPR)

**Prompt template (1:1 feed ad):**
```
Flat illustration, Indian educational context, square format (1:1).
Background: deep forest green (#043630) or dark teal (#004D43). Centre:
[illustrated scene relevant to ad message — e.g., teacher looking at
phone with school building in background]. Large clear zone at top for
short text hook (3–5 words max). Small clear zone bottom-right for logo.
Lime accent (#D0FF71) used sparingly. Style: bold, high contrast, designed
to stop scroll on a phone feed. No real faces, no text in image.

Upload alongside: logo-light.png — place at bottom-right clear zone.
```

**After Gemini:** Use Figma MCP to add hook text (Zalando Sans SemiExpanded Bold,
Lime Accent or Warm Cream) and Kannada variant of hook for Bengaluru targeting.

---

## Prompt Improvement Tips

If first Imagen 3 output is wrong, these fixes reliably help:

| Problem | Fix to add to prompt |
|---|---|
| Looks too Western | "Indian school setting, South Asian character appearance" |
| Too cluttered | "minimal composition, generous negative space" |
| Wrong tone (too corporate) | "warm, human, approachable flat illustration" |
| Wrong tone (too casual) | "clean, professional, editorial illustration" |
| Colours look off | Add exact hex codes: "background exactly #043630" |
| Characters look generic | "Indian teacher, professional kurta or formal shirt, warm expression" |
| Unwanted text appeared | "absolutely no text, numbers, or words in the image" |
| Wrong background | "solid flat colour background, no gradients, no patterns" |
