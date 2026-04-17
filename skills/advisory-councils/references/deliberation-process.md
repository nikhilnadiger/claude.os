---
name: deliberation-process
version: 1.1
purpose: >
  The 5-phase engine for all advisory council sessions. Governs parallelism,
  file loading/release, expert differentiation, clarifying questions, and
  joint council sessions.
---

# Advisory Council Deliberation Process

---

## Pre-Session: Factual Briefing (if needed)

Before opening the council, check whether the question requires current
factual grounding that is not already in loaded context (e.g., a recent
competitor move, a market statistic, a regulatory change).

If yes: fetch that information now, before any expert speaks. Present it
as a brief factual context note visible to all experts. This is the only
point where external information enters the session.

If no: proceed directly to Phase 1.

---

## Phase 1 — Independent Expert Responses (parallel)

**Parallelism:** All experts respond independently in this phase.
Write each expert's response sequentially (A → B → C → D), but do not
pause for user input between experts. Deliver all Phase 1 responses
in a single output.

**File loading:** For each expert in turn:
- Load their individual file: `councils/[council]/experts/[name].md`
- Write their response
- Release the file from active reference before loading the next expert

**What each expert produces:**
- Their core position on the question (3–5 points)
- Each point tagged: `#NON-NEGOTIABLE`, `#MUST-HAVE`, or `#GOOD-TO-HAVE`
- At least one point must cite a specific learning by number
  (e.g., "Learning 7 — The Brief Is Your Battlefield")
- If the expert is a global expert applying their thinking to an
  Indian/bootstrapped context they have no direct experience in,
  flag it: `[Context note: extrapolating from [their domain] to India]`

**Format per expert:**
```
### [Expert Name]
**Position:** [1–2 sentence framing of their overall take]

- [Point 1] [#TAG] *(Learning N — Title)*
- [Point 2] [#TAG]
- [Point 3] [#TAG] *(Learning N — Title)*
[Context note if applicable]
```

**Clarifying question check:** If any expert cannot form a position
because a key fact about staffroom's situation is unknown, they flag it:
`[NEEDS CLARIFICATION: describe what is missing]`

Collect all clarification flags at the end of Phase 1. If any exist,
pause and ask Nikhil before proceeding to Phase 2.

---

## Phase 2 — Scoring (sequential)

Runs entirely from Phase 1 outputs already in context. No new files loaded.

**What to produce:**
A consolidated list of all ideas across all experts with two scores each:

- **Repetition score:** How many experts raised this idea (fully or partially)?
  Full match = 1 point. Partial/related = 0.5 points.
- **Contradiction score:** How many experts explicitly contradicted this idea?
  Full contradiction = 1 point. Partial tension = 0.5 points.

**Format:**
```
| Idea | Tag | Repetition | Contradiction | Notes |
|---|---|---|---|---|
| [idea] | #NON-NEGOTIABLE | 3 | 0.5 | Pandey + Joshi agree; Sutherland partial |
```

Surface the top tensions explicitly:
> "Tension: Pandey (Learning 4 — Conviction Over Consensus) argues against
> testing. Sutherland (Learning 2) argues perception beats product reality —
> which implies testing what framing works. These are not the same argument."

**Condensed Phase 2 (when conflict is low):** If repetition is high and
contradiction score is 0 across all ideas, skip the full table. Write a
2–3 sentence consensus summary noting any nuance differences between experts,
then proceed directly to Phase 3. The table is for genuine conflict, not
for cataloguing agreement.

---

## Phase 3 — Reconsideration (parallel)

**Parallelism:** Each expert's reconsideration is independent. Write all
experts' reconsiderations in one pass without pausing for input.

**File loading:** Load each expert's individual file again only if their
reconsideration requires referencing a specific learning beyond what is
already in context from Phase 1. Otherwise work from memory of Phase 1.

Each expert sees:
- Their own Phase 1 ideas + scores
- All contradictions identified in Phase 2

Each expert decides for each of their ideas: **hold** or **drop/revise**.
They must give a rationale. If dropping, say why. If holding against
contradiction, defend with a specific learning citation.

**Format per expert:**
```
### [Expert Name] — Reconsideration
- [Idea]: **HOLD** — [rationale, cite learning if defending against contradiction]
- [Idea]: **REVISE** — [revised position]
- [Idea]: **DROP** — [why]
```

---

## Phase 4 — Structured Debate (sequential)

This phase is genuinely sequential — debate is reactive.

**Sub-phase 4a — Opening positions (parallel):**
Each expert states their consolidated post-reconsideration position in
2–3 sentences. Write all opening positions in one pass.

**Sub-phase 4b — Exchanges (sequential):**
Run 2–3 rounds of focused debate on the highest-tension contradictions
identified in Phase 2. Each round: one expert challenges, one responds.

Rules for debate:
- Challenges must reference a specific learning
- Responses must either cite a counter-learning or concede
- "I agree" without a reason is not a valid response
- Look for synthesis: can the contradiction be resolved at a higher level?

Aim for consensus where genuinely earned. Note dissent where it isn't.

**Format:**
```
**Round 1 — [Tension being debated]**
[Expert A] (Learning N): [challenge]
[Expert B] (Learning N): [response / concession / synthesis]
```

---

## Phase 4.5 — Open Questions Pause (sequential)

**This step runs before Phase 5, every time.**

After Phase 4 debate, collect every question that emerged across all phases
that the council could not answer from context — facts about staffroom's
situation, product state, user data, or decisions already made that would
change the advice.

Present them to Nikhil and stop. Do not proceed to Phase 5 until answers
are received.

**Format:**
```
---
## Before the final advisory, the council needs your answers:

1. [Question] — [1 sentence on why this changes the advice]
2. [Question] — [why it matters]
...

Please answer the above. The council will incorporate your answers and
then deliver the final advisory.
---
```

**If there are no open questions:** state "The council has no open questions
— proceeding to final advisory." Then move immediately to Phase 5.

**After Nikhil answers:** Run Phase 4.5b — each expert briefly states
whether their position holds or changes in light of the answers. Parallel,
one pass, no user input needed. Format:

```
### [Expert Name] — incorporating Nikhil's answers
- [Answer N]: [how it affects their position, or "no change"]
```

Then proceed to Phase 5.

---

## Phase 5 — Final Advisory (sequential)

Synthesis from everything in context, including Nikhil's answers. No new files.

**Format:**

```
## Advisory: [Question summary]

### Non-Negotiable
*(Ideas that held through all phases, high repetition, defended against challenge)*
1. [Idea] — [1-sentence rationale] [Experts who hold this]

### Must-Have
*(Important ideas, moderate repetition, no fatal contradiction)*
1. [Idea] — [rationale] [Experts]

### Good-to-Have
*(Valid but lower priority or more speculative)*
1. [Idea] — [rationale]

### Dropped / Noted
*(Ideas raised but dropped after debate — worth knowing why)*
- [Idea]: dropped because [reason]
```

Keep Phase 5 tight. Each item is one line with rationale. The council
advises — Nikhil decides.

---

## Joint Council Sessions

When two or more councils are invoked on the same question:

- Phase 1: All experts from all councils respond independently (still
  parallel within the phase — load one expert file at a time across
  all councils before moving to Phase 2)
- Phases 2–5: All experts treated as one pool. Cross-discipline tensions
  are the most valuable output — surface them explicitly in Phase 2
- In Phase 4 debates, cross-discipline pairs are preferred over
  same-discipline pairs (e.g., a brand expert debating a product expert
  is more generative than two brand experts)

---

## File Load/Release Summary

| Phase | Files loaded | Release after |
|---|---|---|
| Pre-session | Context files per routing table in SKILL.md | Hold through all phases |
| Phase 1 | Expert file per turn, one at a time | Release after each expert's response |
| Phase 2 | None — works from Phase 1 context | — |
| Phase 3 | Expert file only if specific learning needed | Release immediately after |
| Phase 4 | None — works from accumulated context | — |
| Phase 4.5 | None — pause for Nikhil's answers, then 4.5b | — |
| Phase 5 | None | — |

MEMBERS.md for all invoked councils is loaded at session start and
held throughout.
