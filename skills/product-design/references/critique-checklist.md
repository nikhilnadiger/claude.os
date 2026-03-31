---
skills: [product-design]
last_updated: Mar 2026
source: staffroom UX constraints + design principles
---

# Design Critique Checklist

Use this to review any design — a Figma frame, a screenshot, a proposed
layout, or a described interaction. Work through sections in order. Safety
checks (Section 1) are blocking — any fail must be resolved before
proceeding.

---

## Section 1: Hard Constraints — Blocking

Any design that fails these is not shippable. No exceptions.

| Check | Pass criteria |
|---|---|
| Mobile viewport | Design reviewed at 360px width, not just 390px or desktop |
| Touch targets | Every tappable element ≥44×44pt |
| Body text size | ≥16px for body copy; ≥14px for secondary/metadata |
| Contrast | WCAG AA: 4.5:1 for body text, 3:1 for large text (24px+) |
| All states present | Empty, loading, error, success states all designed |
| No auto-play media | No video or animation that plays automatically |
| Animation duration | All animations ≤0.6s |

---

## Section 2: Functional Completeness

Before assessing look and feel, the flow must function correctly.

| Check | What to verify |
|---|---|
| Task completion | Can the teacher complete their primary goal without confusion? |
| Primary CTA | Is there exactly one clear primary action per screen? |
| Progress visibility | On multi-step flows: does the teacher know how much is left? |
| Back/cancel path | Can the teacher back out gracefully at every step? |
| Error recovery | Is every error state recoverable? Is the recovery action clear? |
| Input feedback | Are forms validated inline (on blur), not just on submit? |
| Loading feedback | Is every async action covered by a visible loading state? |
| Success feedback | Does the teacher know when their action has succeeded? |

---

## Section 3: Information Architecture

| Check | What to verify |
|---|---|
| Hierarchy | Is the most important information first / most prominent? |
| Step count | Is the flow the minimum number of steps needed? |
| Cognitive load | How many decisions must the teacher make per screen? (Target: one) |
| Labels | Are all UI elements labelled clearly? No icon-only actions without labels. |
| Truncation | Are school names or other critical content truncated? (They should not be) |

---

## Section 4: User Context

| Check | What to verify |
|---|---|
| Teacher segment fit | Is this designed for the right segment? (Rural/low-income vs aspirational — see `staffroom-teacher-insights.md`) |
| Language | Is the copy in plain, clear language? No jargon. |
| Hinglish consideration | If the copy will be localised to Hinglish for content: is the structure translation-friendly? |
| Trust signals | For sensitive actions (submitting a review, sharing personal data): are trust/anonymity signals present? |
| Low-literacy consideration | Is the interface usable by someone who reads slowly? Avoid long paragraphs mid-flow. |

---

## Section 5: Performance Perception

| Check | What to verify |
|---|---|
| Image loading | Are images lazy-loaded? Is there a placeholder while loading? |
| Skeleton screens | Are content-heavy pages using skeleton screens rather than spinners? |
| Perceived speed | Does the design feel fast on a 2G/3G connection? (Consider what renders above the fold first) |
| Animation budget | Is the total animation cost per screen reasonable for a budget Android device? |

---

## Section 6: Brand Consistency

| Check | What to verify |
|---|---|
| Colour | All colours from the approved palette (`visual-identity.md`)? No one-off colours. |
| Typography | Font families, sizes, and weights consistent with staffroom type scale? |
| Tone | Copy consistent with staffroom voice — direct, warm, not corporate? |
| Icons | Consistent icon style across the screen? |
| Spacing | 4px grid followed? Consistent margins and padding? |

---

## Section 7: Edge Cases

| Check | What to verify |
|---|---|
| Long content | What happens with a 60-character school name? A 3-line address? |
| Short content | What happens with a 1-word school name? A missing description? |
| No data | What does the screen look like with zero reviews, zero search results? |
| Slow connection | What happens if an API call takes 5+ seconds? Or fails entirely? |
| Interrupted flow | What happens if the teacher exits mid-form and returns later? |

---

## Section 8: Login Flow (specific — highest drop-off risk)

Apply only when reviewing authentication or OTP-related designs.

| Check | What to verify |
|---|---|
| Step count | Phone entry → OTP → done. Maximum 2 screens. |
| OTP UX | Auto-advance digits, paste support, resend timer (30s), visible digits |
| Error messages | OTP expired, wrong OTP: clear message + clear next action |
| No friction added | Does this design reduce the 606 login page exits, or add to them? |
| Keyboard handling | Does the phone number field open numeric keyboard? Does OTP field auto-open? |

---

## Critique Output Format

When delivering a critique:

1. **Summary verdict** — Pass / Conditional pass (fixes required) / Fail
2. **Blocking issues** (Section 1 failures) — must fix before ship
3. **Recommended fixes** — functional and IA issues that should be addressed
4. **Minor observations** — brand/polish items, low priority
5. **What's working** — be specific; this helps the designer know what to preserve

Be direct. "This looks fine" is not useful. "The touch target on the secondary
CTA is ~32pt — needs to be 44pt" is useful.
