---
source: brand-guidelines.pdf + Figma (node 639-545, variable defs verified Mar 2026)
last_updated: Mar 2026
skills: [brand-custodian, visual-asset-creation]
update-frequency: When colour palette, typography, or logo system changes
---

# staffroom — Visual Identity

## Brand Colour Palette

### Canonical Palette

| Role | Name | Hex |
|---|---|---|
| Primary | Deep Forest Green | #043630 |
| Secondary | Warm Cream | #E6D7B6 |
| Dark Teal | Dark Teal | #004D43 |
| Soft Mint | Soft Mint | #F1FEF8 |
| Lime Accent | Lime Accent | #D0FF71 |

**Codebase note**: The frontend currently uses `#214838` (a marginally lighter green) where `#043630` is canonical. This is a known divergence — flag and correct in the next design system pass. Do not introduce `#214838` in new design output; always use `#043630`.

---

### Semantic / Functional Colours

These are for product UI states only — not for brand communications or marketing output.

| State | Hex | Usage |
|---|---|---|
| Success | #3D9970 | Confirmations, completed states, positive indicators |
| Error | #C04B3A | Validation errors, destructive actions, failure states |
| Loading / Work-in-progress | #E8D485 | Skeleton loaders, pending states, in-progress badges |
| Neutral / Disabled | #9E9E96 | Disabled inputs, placeholder text, secondary labels |

---

## Typography

| Role | Typeface | Weights | Usage |
|---|---|---|---|
| Headings | Zalando Sans SemiExpanded | Medium, Bold | Page titles, section headers, card headings |
| Body | Satoshi | Regular, Medium, Bold | Body copy, labels, captions, UI text |

Both typefaces are confirmed from Figma (node 639-545). No other typefaces are in use.

---

## Logo System

### Variants Available

All files are in `assets/logos/`. Each variant exists in both SVG (preferred) and PNG.

| Variant | Dark version | Light version | When to use |
|---|---|---|---|
| Logo | logo-dark | logo-light | Primary mark — name + icon |
| Logo + Tagline | logo-tagline-dark | logo-tagline-light | Hero placements, decks, onboarding |
| Wordmark | wordmark-dark | wordmark-light | Text-only contexts, tight horizontal spaces |
| Brandmark | brandmark-dark | brandmark-light | Icon-only contexts — favicons, app icons, social profile pictures |

### SVG vs PNG — When to Use Which

| Situation | Use |
|---|---|
| Digital — web, app, email, deck | SVG |
| Social media export (Instagram, LinkedIn post) | PNG |
| Print (letterhead, physical collateral) | PNG (at minimum 300 dpi) |
| Favicon / app icon | PNG |
| When SVG is not supported by the platform | PNG |

Default: always start with SVG. Switch to PNG only when the platform or format requires it.

### Logo Usage Rules

- Use `logo-dark` on light/white/cream backgrounds.
- Use `logo-light` on dark/teal/forest-green backgrounds.
- Never place the logo on a busy photographic background without a solid or semi-transparent container.
- Minimum clear space: equal to the cap-height of the wordmark on all four sides.
- Never stretch, rotate, recolour, add shadow, or outline the logo.
- Never recreate the logo in type — always use the provided file.

### Brandmark Usage Rules

- The brandmark (icon alone, no wordmark) is for contexts where staffroom is already established — profile pictures, app icons, favicons.
- Do not use the brandmark as the primary mark in new-audience materials (emails to cold prospects, investor decks, ads) — use the full logo or logo+tagline.
- Same dark/light pairing rules apply as for the full logo.

---

## Social & Template Assets

All files are in `assets/social/` and `assets/`.

| Asset | File | When to use |
|---|---|---|
| LinkedIn cover | linkedin-cover.png | staffroom LinkedIn company page header |
| Post — text, dark bg | post-text-dark.png | Instagram/LinkedIn square text post, dark background |
| Post — text, light bg | post-text-light.png | Instagram/LinkedIn square text post, light background |
| Post — title, dark bg | post-title-dark.png | Post with title/headline, dark background |
| Post — title, light bg | post-title-light.png | Post with title/headline, light background |
| Story — dark, 1 image | story-dark-1image.png | Instagram story, dark, single image |
| Story — dark, 1 video | story-dark-1video.png | Instagram story, dark, video frame |
| Story — dark, 2 video | story-dark-2video.png | Instagram story, dark, two video frames |
| Story — light, wide image | story-light-1image-wide.png | Instagram story, light, wide image |
| Story — light, 1 image | story-light-1image.png | Instagram story, light, single image |
| Story — light, 2 images | story-light-2image.png | Instagram story, light, two images |
| YouTube banner | youtube-banner.png | YouTube channel art |
| PPT template | ppt-template.pptx | All presentations and investor decks |
| Letterhead | letterhead.pdf | Formal external letters only |
| Email signature (Nikhil) | email-signature-nikhil.png | Nikhil's email signature |

---

## Rating Score Assets

Files are in `assets/ratings/`. Available scores: 0.0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0.

**Usage rules:**

- Use rating score assets for aggregate school score display only — not for individual experiences.
- Round the aggregate score to the nearest 0.5 before selecting the asset (e.g., 3.2 → 3.0, 3.3 → 3.5).
- No minimum experience threshold — display score with any number of verified experiences, including 1.
- Do not display a score asset alongside claims that imply certification ("Verified Excellence", "Top School") — score is a data point, not an award.
- File naming: `score-[integer]-[decimal].png` (e.g., `score-3-5.png` for 3.5).
