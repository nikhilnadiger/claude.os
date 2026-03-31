---
skills: [visual-asset-creation]
last_updated: Mar 2026
source: tested workflow — Mar 2026 session
---

# PowerPoint Path Assets

**BEFORE USING:** Read `brand-custodian/references/visual-identity.md` to
confirm current brand colours and typography. Never write colour codes from
memory.

This path replaces Figma MCP for all design-only and two-step illustrated
assets. Nikhil has PowerPoint Pro installed. Claude builds the PPTX
programmatically using python-pptx; Nikhil exports each slide as PNG.

---

## Setup

```bash
pip install python-pptx --break-system-packages
```

---

## Critical Rule: Text Clash Prevention

**The single most common failure mode is text appearing twice — baked into the
Gemini background image AND added by the PPTX as overlays.**

- **If Gemini baked in text** → PPTX must have zero text overlays.
- **If PPTX adds text** → Gemini prompt must be illustration-only. Include
  "absolutely no text, numbers, or words in the image" in every such prompt.

Never mix. One owner for all text — either Gemini (standalone mode) or PPTX
(two-step mode). Choose before starting and do not deviate.

---

## Brand Colour Reference (python-pptx format)

```python
from pptx.dml.color import RGBColor

DEEP_FOREST_GREEN = RGBColor(0x04, 0x36, 0x30)  # #043630 — primary dark
DARK_TEAL         = RGBColor(0x00, 0x4D, 0x43)  # #004D43 — secondary dark
WARM_CREAM        = RGBColor(0xE6, 0xD7, 0xB6)  # #E6D7B6 — warm light
SOFT_MINT         = RGBColor(0xF1, 0xFE, 0xF8)  # #F1FEF8 — near-white
LIME_ACCENT       = RGBColor(0xD0, 0xFF, 0x71)  # #D0FF71 — accent
```

**Semantic colours** (`#3D9970`, `#C04B3A`, `#E8D485`, `#9E9E96`) — never use
in marketing assets. Product UI states only.

---

## Typography

- **Headings:** `Zalando Sans SemiExpanded` — specify Medium or Bold weight
- **Body:** `Satoshi` — specify Regular, Medium, or Bold weight

Specify these font names directly in python-pptx. Do not use fallback fonts.
If either font is not installed when Nikhil opens the file, PowerPoint will
substitute its default — Nikhil should select the affected text and manually
reassign to the correct font. Both fonts should be installed on Nikhil's
system (confirmed available Mar 2026).

---

## Slide Dimensions

| Asset type | Target px | python-pptx slide size |
|---|---|---|
| WhatsApp graphic / Instagram post / Quote card | 1080×1080 (1:1) | `Inches(10) × Inches(10)` |
| Meta ad Stories / Reel cover | 1080×1920 (9:16) | `Inches(5.625) × Inches(10)` |
| YouTube thumbnail | 1280×720 (16:9) | `Inches(13.33) × Inches(7.5)` |
| LinkedIn post (wide) | 1200×627 (1.91:1) | `Inches(12.5) × Inches(6.53)` |
| Carousel frame | 1080×1080 (1:1) | `Inches(10) × Inches(10)` (multiple slides per file) |

**Export:** Nikhil opens in PowerPoint (Mac), File → Export → PNG, select highest
quality (300 DPI). At 300 DPI, a 10"×10" slide exports at 3000×3000px — Nikhil
can resize to 1080×1080px in any image editor. At default 150 DPI it exports at
1500×1500px — sufficient for social media.

---

## Presentation Setup Template

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

prs = Presentation()
prs.slide_width = Inches(10)   # adjust per asset type table above
prs.slide_height = Inches(10)

# Add blank slide (no placeholder elements)
blank_layout = prs.slide_layouts[6]
slide = prs.slides.add_slide(blank_layout)
```

**Set solid background colour (PPTX-only path):**
```python
background = slide.background
fill = background.fill
fill.solid()
fill.fore_color.rgb = DEEP_FOREST_GREEN
```

**Embed Gemini image as full-bleed background (two-step path):**
```python
# img_path = path to the uploaded Gemini image file
# e.g. '/sessions/determined-eloquent-ramanujan/mnt/uploads/gemini-bg.png'
slide.shapes.add_picture(
    img_path,
    Inches(0), Inches(0),
    width=prs.slide_width,
    height=prs.slide_height
)
# IMPORTANT: add image before any text boxes so it sits behind all text layers
```

**Add text box:**
```python
txBox = slide.shapes.add_textbox(
    Inches(0.4),   # left
    Inches(0.4),   # top
    Inches(9.2),   # width
    Inches(3.0)    # height
)
tf = txBox.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = 'Headline text here'
p.alignment = PP_ALIGN.LEFT

run = p.runs[0]
run.font.name = 'Zalando Sans SemiExpanded'
run.font.bold = True
run.font.size = Pt(52)
run.font.color.rgb = SOFT_MINT
```

**Save:**
```python
prs.save('/sessions/determined-eloquent-ramanujan/output-asset.pptx')
```

---

## Two-Step Workflow (Gemini + PPTX)

For WhatsApp graphics, Meta ads, thumbnails, and Reel covers that need an
illustrated background plus substantial copy.

**Step 1 — Gemini prompt:**
Claude generates an illustration-only prompt (see gemini-assets.md for
templates). Delivers as a ready-to-paste block. Key requirement: specify
"absolutely no text, numbers, or words in the image" and define exact clear
zones matching where PPTX text layers will land.

**Step 2 — Nikhil runs Gemini:**
Nikhil pastes the prompt + uploads the logo file into Gemini, downloads the
generated image, and uploads it to the chat (or places it in an agreed folder).

**Step 3 — Claude embeds image:**
Claude reads the uploaded image from the upload path and embeds it as the
full-bleed background slide layer using the template above.

**Step 4 — Claude adds text layers:**
Claude adds all text boxes, labels, trust indicators, URL, and logo on top of
the background — following the asset-type spec below.

**Step 5 — Claude saves and links:**
Claude saves the PPTX to `/sessions/determined-eloquent-ramanujan/` and
provides a `computer://` link. Nikhil exports as PNG.

---

## Asset Type 1: WhatsApp Graphic / Meta Ad Feed (1:1)

**Slide:** 10"×10"

**Zone layout:**
```
Top label (0–0.8"):     "FOR TEACHERS" tag — Satoshi Bold, 14–16pt, Lime Accent
Hook (0.8"–4.0"):       Main headline — Zalando Sans SemiExpanded Bold, 48–60pt
Body (4.0"–6.5"):       Sub-copy or bullet points — Satoshi Regular, 20–24pt
Trust (6.5"–7.8"):      Pill buttons: Anonymous · Safe · Free
Social proof (7.8"–8.6"): "+12,000 teachers trust staffroom" — Satoshi, 18pt
URL (8.6"–9.3"):        "www.thestaffroom.in" — Satoshi Medium or Bold, 18–22pt
Logo (9.3"–10"):        staffroom wordmark — logo-light.png on dark backgrounds
```

**Pill buttons (Anonymous / Safe / Free):**
Create rounded-rectangle shapes with Lime Accent fill, Deep Forest Green text:
```python
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE_TYPE

# Use add_shape with MSO_CONNECTOR_TYPE.STRAIGHT to get a rectangle
# then round the corners via XML adjustment if needed, OR
# use a plain rectangle with no line border (close enough for pills)
from pptx.util import Inches, Pt

pill = slide.shapes.add_shape(
    1,  # MSO_SHAPE_TYPE.RECTANGLE
    Inches(0.4), Inches(6.5), Inches(1.9), Inches(0.48)
)
pill.fill.solid()
pill.fill.fore_color.rgb = LIME_ACCENT
pill.line.fill.background()  # no border

tf = pill.text_frame
tf.margin_left = Pt(8)
tf.margin_right = Pt(8)
p = tf.paragraphs[0]
p.text = 'Anonymous'
p.alignment = PP_ALIGN.CENTER
run = p.runs[0]
run.font.name = 'Satoshi'
run.font.bold = True
run.font.size = Pt(14)
run.font.color.rgb = DEEP_FOREST_GREEN

# Repeat for 'Safe' (left: Inches(2.5)) and 'Free' (left: Inches(4.1))
```

**Colour on dark vs light background:**
- On Deep Forest Green / Dark Teal: headline = Soft Mint or Warm Cream; sub-copy = Warm Cream
- On Warm Cream / Soft Mint: headline = Deep Forest Green; sub-copy = Dark Teal

---

## Asset Type 2: Data Visualisation Card (PPTX Only)

**Slide:** 10"×10" with solid Deep Forest Green background

**Zone layout:**
```
Source/label (0–1.2"):   "staffroom data" or pillar label — Satoshi Regular, 16–18pt, Warm Cream
Primary number (1.2"–5.5"): e.g. "34%" — Zalando Sans SemiExpanded Bold, 100–130pt, Lime Accent
Explanation (5.5"–7.5"): "of teachers rate their school's management as good"
                          Satoshi Regular, 26–30pt, Warm Cream
Attribution (7.5"–8.5"): "Based on 635 experiences — thestaffroom.in"
                          Satoshi Regular, 16pt, Warm Cream at partial opacity (set alpha if needed)
Accent rule:             Lime Accent horizontal line, 2–4pt, full width at ~1.0" from top
Logo (8.5"–10"):          logo-light.png — add_picture, bottom-right aligned
```

---

## Asset Type 3: Quote Card (PPTX Only)

**Slide:** 10"×10"

**Background:**
- Soft Mint `#F1FEF8` — for warm, emotional teacher quotes
- Deep Forest Green `#043630` — for data / authority quotes

**Zone layout:**
```
Accent rule (0.6"–0.7"):  Lime Accent horizontal line, 3pt, left-aligned 0.5" wide
Category (0.7"–1.4"):     Pillar or topic label — Satoshi Medium, 16–18pt
Quote (1.4"–7.5"):        Satoshi Bold, 42–52pt
                          On dark: Warm Cream. On light: Deep Forest Green.
Attribution (7.5"–8.5"):  "Teacher · Role · City" — Satoshi Regular, 18–20pt
                          On dark: Lime Accent. On light: Dark Teal.
Logo (8.5"–10"):           logo-light.png (dark bg) or logo-dark.png (light bg)
```

---

## Asset Type 4: YouTube Thumbnail (Gemini + PPTX, 16:9)

**Slide:** 13.33"×7.5"

**Gemini generates:** illustration in right 40%; left 60% completely clear. No text.

**PPTX text layers (left 60% zone: 0–8" wide):**
```
Headline (0.4"–0.4", width 7.8"): Zalando Sans SemiExpanded Bold, 60–80pt
                                   Lime Accent or Warm Cream
Sub-line (below headline):         Satoshi Regular, 24–28pt, Warm Cream
Logo (bottom-left, 0.3" from edge): logo-light.png
```

---

## Asset Type 5: Instagram Reel / YouTube Short Cover (Gemini + PPTX, 9:16)

**Slide:** 5.625"×10"

**Gemini generates:** illustration in bottom 60%; top 25% completely clear. No text.

**PPTX text layers:**
```
Hook text (top zone, 0–2.5"): Zalando Sans SemiExpanded Bold, 36–48pt, Lime Accent or Warm Cream
Logo (upper-right):            logo-light.png, small
```

---

## Asset Type 6: Carousel (PPTX Only, Multiple Slides)

**Slide:** 10"×10" per frame — build all frames in one PPTX file (multiple slides).

**Consistency rules across all frames:**
- Same background colour on every frame — no switching between light and dark
- Logo in same position every frame (bottom-right)
- Same typographic hierarchy throughout
- Frame counter: small "1/5" etc. at top-right if more than 3 frames (Satoshi Regular, 14pt)

**Frame structure:**
- Frame 1 (Cover): strongest hook statement. Include a "→ swipe" cue.
- Frames 2–N (Body): each advances the story; standalone but rewards sequence.
- Final Frame: summary + CTA: "Share your experience at thestaffroom.in" + full logo prominent.

---

## Adding Logo to Slides

Always use the correct variant:
- `logo-light.png` on dark backgrounds (Deep Forest Green, Dark Teal)
- `logo-dark.png` on light backgrounds (Warm Cream, Soft Mint)

Logo files are in `assets/logos/`. Add as a picture shape:
```python
logo_path = '/sessions/determined-eloquent-ramanujan/mnt/claude.os/assets/logos/logo-light.png'
logo_width = Inches(1.6)
logo_left = prs.slide_width - logo_width - Inches(0.3)
logo_top = prs.slide_height - Inches(0.5) - Inches(0.3)
slide.shapes.add_picture(logo_path, logo_left, logo_top, width=logo_width)
```

---

## Export Instructions (Nikhil)

1. Open the PPTX in PowerPoint (Mac)
2. **File → Export → PNG** (or File → Save As → choose PNG)
3. When prompted for resolution, choose the highest available (best for printing / 300 DPI)
4. Each slide exports as a separate PNG: Slide1.png, Slide2.png, etc.
5. Rename per destination: e.g. `whatsapp-ad-v1.png`, `quote-card-management-data.png`

At 300 DPI a 10"×10" slide = 3000×3000px. Resize to 1080×1080 if needed.
At default 150 DPI a 10"×10" slide = 1500×1500px — acceptable for social.
