---
skills:
  - meta-ad-creation
purpose: >
  Full specification for Gates 0–4 in the meta-ad-creation workflow.
  Each gate defines who produces it, what Claude does before it opens,
  what gets delivered, and how Nikhil approves it.
last_updated: Jun 2026
---

# Gate Framework — meta-ad-creation

Gates are strictly sequential. No gate opens without written approval of
the prior gate. No parallel work across gates at any time.

---

## Gate 0 — Creative Strategy Brief

### Who Produces It
Brand-Marketing Council (full deliberation, all 4 experts).

### What Claude Does Before This Gate Opens
1. Confirm Nikhil has approved the assembled input set from the self-briefing sweep.
2. Load `knowledge/staffroom-teacher-insights.md` and `knowledge/staffroom-user-journey.md`.
3. Load relevant sections of `CLAUDE.md` (30-Second Context, Current Priorities, Competitive Landscape).
4. Load the live production codebase state — what does a user who clicks an ad actually see and do right now?
5. **Iteration Mode only:** Load prior campaign performance data (Meta Ads exports, prior CPR benchmarks). Present as a pre-session fact briefing visible to all experts. Label it "Prior Campaign Data" — the council is not required to repeat prior creative direction, but they must not be briefed blind.
6. Run full 5-phase deliberation process per `advisory-councils/references/deliberation-process.md`.

### What Gets Delivered
- **Single-Minded Proposition (SMP):** One sentence that is the strategic core of this campaign.
- **Audience definition:** Which teacher segment, what insight drives them, what language they use.
- **Hook strategy recommendation:** Grounded in available performance data (CPR, completion rates, strongest prior hooks).
- **Format mix recommendation:** Which production formats (AI Avatar, AI Video, Static, Agency), how many ads, and why this mix for this objective.
- **The specific creative tension:** What makes this campaign brief different from a generic brief — the named tension the council is solving. This must be explicit, not implied.

### Approval Protocol
Nikhil reads the brief. Either:
- **Approves as-is** in writing → Gate 1 opens.
- **Gives written feedback** → Claude relays feedback to council in full. Council revises. Loop repeats until Nikhil explicitly approves in writing.

Gate 0 does not close until Nikhil explicitly approves in writing.

---

## Gate 1 — Creative Routes

### Who Produces It
Brand-Marketing Council (new session; approved Gate 0 Brief is the sole creative input).

### What Claude Does Before This Gate Opens
1. Confirm approved Gate 0 Brief is in context.
2. Flag any open data questions from Gate 0 that need resolution before routes are generated.
3. Load the approved brief into council as a pre-session fact — all experts read it before Phase 1 begins.

### What Gets Delivered
2–3 named creative routes. Each route must include:
- **Name:** A short, memorable label for the territory.
- **Strategic territory:** 2-sentence description — what emotional or rational space this route occupies and why.
- **Hook line:** Exact words, 5–7 words. This is the ad's opening line if the route is selected.
- **Format fit recommendation:** Which production format(s) suit this route and why.
- **Production complexity rating:** Simple / Medium / High — relative to available formats.
- **Predicted performance pattern:** Why this route is expected to work for this audience and objective, grounded in prior data or teacher insight.

### Approval Protocol
Nikhil selects which routes to develop. Written direction required — e.g., "develop Route 1 and Route 2, kill Route 3." Partial selection is valid.

Feedback on any route → Claude relays to council for revision before scripts are written. Gate 1 does not close until Nikhil has given explicit written direction on which routes to develop.

---

## Gate 2 — Scripts

### Who Produces It
Brand-Marketing Council (one full script per approved route).

### What Claude Does Before This Gate Opens
1. Confirm approved routes are in context.
2. Load `content-strategy/references/script-style-guide.md` for the council — hook spec, 5-beat structure, IR format, Hinglish rules, CTA standards, duration specs. This is the council's creative constraint set for scripts; they must work within it.

### What Gets Delivered
Per script:
- **Full 2-column script table:** Audio | Visual
- **Duration specified:** 15s, 30s, 60s cuts where relevant — or council recommends which cuts are needed and why
- **Beat structure per the style guide:**
  - Hook (0–3s)
  - Reinforcement (4–7s)
  - Core Value (8–30s)
  - Escalation (31–50s)
  - Closing CTA (51–60s)
- **Visual descriptions:** Exact frame descriptions — what the camera sees, not emotional abstractions
- **Language per line:** English / Hinglish / regional variant specified line by line
- **Format tag:** 9:16 / 1:1 — specified for each version of the script
- **Casting direction:** Any direction relevant to this specific script (not generic)

### Approval Protocol
Each script is approved individually. Nikhil does not need to approve all scripts before any production brief begins — approved scripts can proceed to Gate 3 while others are still in revision.

Feedback on a script → Claude relays to council. Council revises that script only. Other approved scripts are not affected.

---

## Gate 3 — Production Briefs

### Who Produces It
Brand-Marketing Council (one production brief per approved script).

### What Claude Does Before This Gate Opens
1. Confirm approved scripts are in context.
2. Identify the production pathway for each approved script (AI Avatar / AI Video / Static+PPTX / Agency).
3. Load `references/production-brief-formats.md` — specifically the format section matching each script's production pathway. Read only the relevant section.

### What Gets Delivered
One production brief per approved script, matched to the production pathway of that script. Brief contents per format: see `references/production-brief-formats.md`.

**Delivery format:** Single Word document containing all approved production briefs. Each brief is self-contained — it can be handed to an AI tool or a human agency team with no additional context needed.

### Approval Protocol
Nikhil approves each production brief. Approved briefs go to production immediately — do not hold back approved briefs while others are in revision.

Feedback → Claude relays to council for revision of that brief only.

---

## Gate 4 — Meta Ads Setup Brief

### Who Produces It
Claude (not the council).

### Inputs Claude Uses
- All approved creatives from Gates 0–3 (SMP, routes, scripts, production briefs)
- Confirmed campaign objective, geography, and targeting parameters from the self-briefing sweep (corrected by Nikhil)
- Prior CPR benchmarks if available
- Full spec: `references/meta-ads-setup.md`

### What Gets Delivered
A complete Meta Ads setup brief including:
- UTM parameter strings per creative (complete URLs, one per creative)
- Budget structure (ABO default with rationale)
- Ad set structure (one per creative route)
- Ad copy per creative (primary text, headline, description, CTA, destination URL)
- Audience targeting spec (geography, language, interests, exclusions)
- Pre-launch checklist (all items confirmed before the brief is signed off)

Full spec: `references/meta-ads-setup.md`

### Approval Protocol
Nikhil approves the Gate 4 brief before any ad goes live. No exceptions.
