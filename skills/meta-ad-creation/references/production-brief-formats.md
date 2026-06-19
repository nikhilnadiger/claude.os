---
skills:
  - meta-ad-creation
purpose: >
  Format-specific production brief specs for Gate 3. One section per
  production pathway. Load only the section matching the approved script's
  pathway — do not load all sections for every brief.
last_updated: Jun 2026
---

# Production Brief Formats — Gate 3

Each section below defines what the Brand-Marketing Council must include in
the production brief for that format. Briefs must be immediately actionable —
handed to a tool or team with zero additional context needed.

---

## Format A — AI Avatar (HeyGen or equivalent)

Use when: the approved script features a human presenter delivering direct-
to-camera dialogue. Best for Authority hook type, testimonial-style scripts,
and scripts where a named persona adds credibility.

### Brief Contents

**Script for tool input**
- Clean dialogue only — no stage directions, no parenthetical notes in the
  spoken text. Exactly as the avatar will say it.
- Line breaks between beats so the council can specify pause timing if needed.

**Avatar spec**
- Gender
- Age range (e.g., 28–35)
- Skin tone (specify: South Asian / North Indian / pan-Indian — not racial
  categories)
- Professional appearance direction: what they are wearing, hair, whether
  they wear glasses, overall vibe (e.g., "experienced classroom teacher,
  not corporate")

**Voice register**
- Tone: warm / urgent / matter-of-fact / authoritative
- Pace: slow / conversational / fast
- Energy level: calm / moderate / high
- Emphasis markers: any specific lines the council wants delivered with
  particular stress or pause (mark inline with [EMPHASIS] or [PAUSE])

**Background spec**
- What should appear behind the avatar: colour, environment, abstract, blur
- If a classroom or school environment: describe lighting and props visible
- Note any brand colour alignment (Deep Forest Green / Dark Teal / Warm Cream)

**B-roll text prompts**
- For any cutaway moments in the script (where avatar is not on screen):
  one Runway/Kling-ready visual prompt per cutaway beat, including:
  - What the camera sees
  - Motion direction
  - Duration in seconds

**Tool recommendation**
- HeyGen (default) unless council gives rationale for alternative
- If alternative recommended: name the tool and state the specific reason
  HeyGen is insufficient for this script

**Aspect ratio and duration**
- 9:16 (Reels / Stories) or 1:1 (Feed) — one brief per ratio variant if
  both are required
- Total duration in seconds per script version (15s / 30s / 60s)

---

## Format B — AI Video (Runway / Kling)

Use when: the approved script relies on cinematic visuals, environmental
scenes, or abstract imagery rather than a single presenter. Best for
emotional hook types, product-in-context scenes, and scripts where the
visual is the lead.

### Brief Contents

**Script broken into shot-level prompts**
One prompt per scene or beat. Do not combine multiple beats into one prompt.

For each shot prompt:
- **Visual description:** What the camera sees — subject, environment,
  lighting, time of day, colour mood. Specific enough to generate without
  additional direction.
- **Motion direction:** Camera move (push in / pull out / static / pan left)
  OR subject motion (teacher walking / hands writing / door opening). One
  motion directive per prompt — do not stack.
- **Mood/lighting:** Natural light / fluorescent / golden hour / flat studio.
  Specify if this is a contrast shot relative to the prior beat.
- **Duration in seconds:** How long this shot plays.

**Negative prompts per shot**
What to avoid generating — specified per shot because context changes.
Examples: "no text in frame", "no logos", "no western-looking faces",
"no corporate office environment", "no stock photography aesthetic".

**Transitions between shots**
- Hard cut / dissolve / match cut — specified per transition
- If a match cut: describe the visual element that links the two shots

**Audio direction**
- Music mood: acoustic / ambient / upbeat / tension / none
- Voiceover notes: is there a VO track? If yes, point back to the clean
  dialogue from the script. If no VO: is the audio purely music?

**Tool recommendation**
- Runway (default for camera motion-heavy scripts)
- Kling (default for character consistency across shots)
- State rationale if the script's needs deviate from the default

**Aspect ratio and duration**
- 9:16 or 1:1 per version required
- Total duration in seconds per version

---

## Format C — Static / PPTX

Use when: the approved script is a static or carousel ad — no video, no
avatar. Best for data-forward hooks, quote-based scripts, and any creative
requiring Hinglish or regional language text as the primary visual element.

### Brief Contents

**Frame-by-frame layout brief**
One section per frame (or slide in a carousel). Number each frame.

Per frame:
- **Copy:** Exact text as it appears on the frame. Specify which copy is
  headline vs. body vs. CTA.
- **Typography:**
  - Headlines: Zalando Sans SemiExpanded Bold
  - Body: Satoshi Regular or Medium
  - Specify font size tier: Large (headline) / Medium (subhead) / Small (body)
- **Colour:**
  - Background: which brand colour — Deep Forest Green `#043630` /
    Dark Teal `#004D43` / Warm Cream `#E6D7B6` / or specify other
  - Text colour must contrast: Lime Accent `#D0FF71` or white on dark
    backgrounds; Deep Forest Green on Warm Cream
- **Visual spec:** Background colour only, OR include a Gemini illustration.
  If Gemini illustration: write the exact Gemini prompt for this frame.
- **Logo placement:** Specify variant and position.
  - `logo-light.png` on dark backgrounds
  - `logo-dark.png` on light backgrounds
  - Position: top-left / top-right / bottom-left / bottom-right / centered
- **CTA placement:** Frame number where CTA appears, exact CTA text,
  button or text-only, position on frame.
- **Regional language variant:** If a Kannada, Tamil, Telugu, or Hindi line
  is included — specify which line, which frame, which language variant.

**Production path**
- **Gemini + PPTX two-step:** Use when a Gemini illustration is needed as
  a background or visual element. Rationale must be stated.
- **PPTX only:** Use when all visuals can be built from brand colours,
  typography, and logo assets alone.

**Handoff note (always include this line)**
> "Claude builds the PPTX using visual-asset-creation skill. Hand this brief
> to Claude with instruction: create Meta ad creative."

---

## Format D — Agency Live-Action

Use when: the approved script requires real human talent, real locations,
or live-action footage that AI video cannot credibly produce. Best for
emotionally complex scripts, testimonial formats featuring real teachers,
or campaigns where authenticity requires documentary-style footage.

### Brief Contents

**Casting brief**
- Character description(s): one per speaking or featured role
- Age range per character
- Gender per character
- Teacher persona or non-teacher (if non-teacher: who are they in relation
  to the story?)
- Physical appearance notes: only what is relevant to the story — do not
  over-specify

**Location spec**
- Primary location: classroom / school corridor / school exterior / home /
  outdoor public space
- Mood direction for location: warm / institutional / cramped / aspirational
- Props required: list only props the script explicitly needs

**Wardrobe**
- Per character: what they are wearing and why it matters to the story
- What to avoid: corporate-looking clothing, obviously styled looks that
  break the documentary feel

**Shot list**
Numbered. Each shot as the director reads it:
- Shot number
- Shot type: Wide / Medium / Close-up / OTS / Insert
- Subject and action
- Any specific visual requirement from the script (e.g., "camera must see
  the salary slip clearly")

**Director's treatment**
2–3 paragraphs. Describes the emotional journey of the ad from first frame
to last — not a shot list, but the feeling the viewer should have at each
stage. This is the director's brief, not the editor's.

**PPM-ready structure**
- Scene numbers (matching the shot list)
- Duration per scene in seconds
- Total Runtime (TRT) in seconds
- Any scene with location change flagged explicitly

**Language direction**
- Line by line: specify which lines are English, which are Hinglish, which
  are in a regional language
- If regional language: specify which language and which city/state context
  makes this natural (e.g., Kannada for Bengaluru-targeted creatives)
- Hinglish direction: where code-switching happens and why it feels natural
  at that beat (do not leave this to the talent's discretion)
