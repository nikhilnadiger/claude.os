---
skills: [visual-asset-creation]
last_updated: Mar 2026
source: brand-custodian/references/visual-identity.md
---

# Figma — Reference Only

> **STATUS (Mar 2026): Figma MCP is read-only.**
> Claude can read existing Figma files (get metadata, screenshots, variable
> definitions, design context) but **cannot create new files or edit existing
> designs** via MCP. All visual asset creation routes to the PowerPoint path.
> See `references/pptx-assets.md` for the active asset creation workflow.
>
> This file is retained as a layout and specification reference — the design
> specs below document the intended layouts for each asset type and remain
> valid as a design source of truth. When Figma MCP gains write access in
> future, this file can be reactivated.

---

# Asset Layout Specifications (Design Reference)

The specs below are the canonical layout definitions for each asset type.
Currently implemented via the PowerPoint path (`pptx-assets.md`).
Use these specs when building PPTX assets to ensure design consistency.

---

## Brand Quick Reference (verify against visual-identity.md)

| Name | Hex | Use |
|---|---|---|
| Deep Forest Green | #043630 | Primary dark backgrounds |
| Dark Teal | #004D43 | Secondary dark backgrounds |
| Warm Cream | #E6D7B6 | Warm light backgrounds, text containers |
| Soft Mint | #F1FEF8 | Near-white backgrounds |
| Lime Accent | #D0FF71 | Highlights, emphasis, numbers |

**Semantic colours (#3D9970, #C04B3A, #E8D485, #9E9E96) — never in marketing assets.**

Typography: Headings = Zalando Sans SemiExpanded (Medium/Bold). Body = Satoshi (Regular/Medium/Bold).

Logo: `logo-light.png` on dark backgrounds; `logo-dark.png` on light backgrounds.

---

## Asset Type 1: Quote Card

**Dimensions:** 1080×1080px (1:1) or 1080×1350px (4:5)
**Goal:** Make a teacher quote or data point shareable. High save and share rate
when the quote names a real, resonant experience.

**Best content:**
- Direct teacher quotes from the review database or Dovetail research
- Platform data points: "34% of teachers say management is good"
- Validation statements: "Teachers Are TIRED. Not the kind sleep fixes."

**Layout spec (implement in PPTX):**
1. Background: Soft Mint #F1FEF8 (warm/emotional quotes) OR Deep Forest Green
   #043630 (data/authority quotes)
2. Quote text: Satoshi Bold, 40–52pt. On dark: Warm Cream #E6D7B6. On light:
   Deep Forest Green #043630.
3. Attribution: Satoshi Regular, 18–22pt. Teacher role + city (never full name).
   On dark: Lime Accent #D0FF71. On light: Dark Teal #004D43.
4. Accent element: single Lime Accent #D0FF71 rule/line
5. Logo: bottom strip — `logo-light.png` on dark, `logo-dark.png` on light
6. Minimal decoration — the quote must dominate

**PPTX implementation note — Quote Card background option:**
```
Clean graphic design, minimal, high contrast. Background: [soft mint #F1FEF8 /
deep forest green #043630]. Central area: completely blank, reserved for quote
text overlay. Small accent illustration in one corner: [chalk classroom object /
teacher silhouette / subtle leaf pattern]. Lime accent (#D0FF71) as highlight
element. Bottom strip: reserved for attribution and logo. Style: editorial,
warm, modern. No real faces.

Upload alongside: [logo-dark.png on light / logo-light.png on dark].
```

---

## Asset Type 2: Data Visualisation Card

**Dimensions:** 1080×1080px (1:1) or 1080×1350px (4:5)
**Goal:** Make a platform data point visually compelling and shareable.
Primary format for Pillar 5 (Platform Data Reveals) content.

**Layout spec (implement in PPTX):**
1. Background: Deep Forest Green #043630 or Dark Teal #004D43
2. Primary number: Zalando Sans SemiExpanded Bold, 80–100pt. Lime Accent #D0FF71
   or Warm Cream #E6D7B6.
3. Label text: Satoshi Regular/Medium, 24–32pt. Warm Cream #E6D7B6.
4. Source attribution: Satoshi Regular, small. "Based on X experiences —
   thestaffroom.in". Soft Mint #F1FEF8 or Warm Cream at reduced opacity.
5. Logo: bottom-right — `logo-light.png`
6. Optional: Lime Accent #D0FF71 horizontal rule or bracket elements

**Example structure:**
```
[Zalando Sans SemiExpanded Bold, Lime Accent #D0FF71, very large]
34%

[Satoshi Regular, Warm Cream #E6D7B6]
of teachers rate their school's management as good

[Satoshi Regular, Warm Cream reduced opacity, small]
Based on 635 teacher experiences — thestaffroom.in

[logo-light.png — bottom-right]
```

---

## Asset Type 3: LinkedIn Post Image

**Dimensions:** 1200×627px (1.91:1) or 1080×1080px (1:1)
**Goal:** Authoritative, data-credible visual for school/partner audience.
More professional tone than Instagram — less warm, more structured.

**Layout spec (implement in PPTX):**
1. Background: Soft Mint #F1FEF8 (professional light) or Deep Forest Green
   #043630 (authoritative dark)
2. Headline: Zalando Sans SemiExpanded Bold. On light: #043630. On dark: #E6D7B6.
3. Supporting text: Satoshi Regular. More restrained use of Lime Accent.
4. Logo: bottom-right
5. Optional: platform data visualisation (bar, number callout) using brand colours

---

## Asset Type 4: Carousel

**Dimensions:** 1080×1080px (1:1) per frame
**Goal:** Tell a sequential story — data breakdown, step-by-step tip, or
multi-point argument where each frame is standalone but part of a whole.

**Carousel structure:**
- Frame 1 (Cover): Hook — strongest single image or statement. Must stand alone.
  Include "→" swipe indicator.
- Frames 2–N (Body): Each frame advances the story. Standalone but rewards sequence.
- Last Frame (Closure): Summary + CTA. "Share your experience at thestaffroom.in"
  + full logo prominent.

**Visual continuity rules (all frames must share):**
- Same background colour (no dark/light switching between frames)
- Logo in same position on every frame (bottom-right)
- Same typographic hierarchy
- Lime Accent #D0FF71 accent elements used consistently
- Frame number: small "1/5", "2/5" etc. at top-right if more than 3 frames

**PPTX setup (multi-slide carousel):**
- Create one file with N artboards named Frame-1 through Frame-N
- Build all frames before sharing — deliver as a complete set, not individually

---

## Asset Type 5: Meta Ad Creative (Text-Heavy / Data-Led)

**Use PowerPoint only path when:** the ad is data-led or text-heavy (implement via pptx-assets.md).
**Use Gemini + PPTX path when:** the ad needs an illustrated scene background plus copy overlays.
**Use Gemini standalone when:** the ad is purely illustrative with no text overlay needed.

**Dimensions:** 1080×1080px (1:1) for feed; 1080×1920px (9:16) for Stories

**What Meta Ads data shows:**
- Salary-intent: CPR ₹98 — most efficient
- Kannada-English bilingual: CPR ₹144 vs English-only ₹279 — mandatory for Bengaluru
- Hook must retain viewer past 5 seconds (high VPT correlates with lower CPR)

**Layout spec (implement in PPTX):**
1. Background: Deep Forest Green #043630 or Dark Teal #004D43
2. Primary text hook: 5–7 words max, Zalando Sans SemiExpanded Bold,
   Lime Accent #D0FF71 or Warm Cream #E6D7B6
3. CTA text: "Share your experience → thestaffroom.in" (Satoshi Regular, smaller)
4. Logo: bottom-right — `logo-light.png`
5. For Bengaluru targeting: include Kannada text variant of the hook alongside
   or below English
