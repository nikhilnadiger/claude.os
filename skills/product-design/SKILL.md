---
name: product-design
version: 1.0
description: >
  Use for UI/UX design decisions, screen critique, design process guidance,
  component design, and constraint-aware design work for staffroom. Triggers:
  'design this screen', 'critique this UI', 'review this design', 'how should
  this look', 'design for mobile', 'UX flow', 'component design', 'design
  review', 'is this design correct', 'what should this screen do'. Routes to
  design-process.md for design workflow, component-standards.md for component
  and pattern decisions, critique-checklist.md for structured review.
  Not for product feature strategy (use product-context) or implementing
  code (use codebase-context).

triggers:
  - "design this screen"
  - "critique this UI"
  - "review this design"
  - "how should this look"
  - "design for mobile"
  - "UX flow"
  - "component design"
  - "design review"
  - "is this design correct"
  - "what should this screen do"
  - "design the"
  - "should this be"

uses_references:
  - references/design-process.md
  - references/component-standards.md
  - references/critique-checklist.md

related_skills:
  - product-context
  - codebase-context
  - engineering-review

live_references:
  - label: UX Constraints (non-negotiable floors — load before any design decision)
    path: claude.os/knowledge/staffroom-ux-constraints.md
    tool: read_file
  - label: Teacher Insights (3 segments, verbatim quotes — load when designing for specific users)
    path: claude.os/knowledge/staffroom-teacher-insights.md
    tool: read_file
---

# product-design

## Purpose

The design layer for staffroom. Provides structured process, constraints,
component standards, and critique framework for all UI/UX work. Always
anchored to staffroom's real context: 90% mobile, budget Android devices,
2G-capable, Indian private school teachers.

## Two-Layer Design Model

**Floor (non-negotiable):** The constraints in `staffroom-ux-constraints.md`
are always active. They represent hard limits derived from the user
population and device context. Any design that violates them is wrong,
regardless of how good it looks on a desktop Figma canvas.

**Ceiling (aspirational):** The design process in `references/design-process.md`
represents the full design workflow — research, exploration, iteration,
validation. Use it when there is time and scope for thorough design work.

When time is short, respect the floor unconditionally. The ceiling is
aspirational; the floor is not.

## When to Load This Skill

- Designing a new screen or user flow from scratch
- Critiquing or reviewing an existing design or mockup
- Deciding between design options (layout, interaction, component)
- Checking whether a proposed design meets staffroom's constraints
- Designing components or patterns for reuse
- Producing design briefs or Figma specs

## When NOT to Load This Skill

- Understanding product features or data flows → use product-context
- Building or fixing code → use codebase-context
- Architecture or PR review → use engineering-review
- Brand or content questions → use brand-custodian / content-strategy

## Routing

| Task | Reference file |
|---|---|
| Full design workflow or new feature design | `references/design-process.md` |
| Component, pattern, or interaction decisions | `references/component-standards.md` |
| Critique or review of an existing design | `references/critique-checklist.md` |
| Non-negotiable constraints | Live reference: `staffroom-ux-constraints.md` |
| Understanding user segments | Live reference: `staffroom-teacher-insights.md` |

## Workflow

1. Load `staffroom-ux-constraints.md` first — always. Constraints are active
   for every design task.
2. Identify the task type using the routing table above.
3. Load the relevant reference file(s).
4. If designing for a specific teacher segment, load `staffroom-teacher-insights.md`.
5. Apply functional completeness first — a design must work correctly before
   optimising for delight, animation, or visual polish.
6. If a constraint would be violated: stop, flag it, present Option A
   (within constraints) before any Option B. See Constraint Violation Protocol
   in `CLAUDE.md`.

## Non-Negotiable Constraints (summary — load full file for details)

Defined in `staffroom-ux-constraints.md`. At a minimum:

- 97.7% mobile — mobile-first, no exceptions
- iOS is 36% of mobile sessions — 13 Safari/WKWebView constraints apply
- 48×48pt minimum touch targets (8px gap between adjacent; 20px edge exclusion)
- 320px minimum viewport (iOS floor); design optimised for 360px (Android)
- 2G network baseline — lazy-load images, no auto-play video, ≤200KB JS gzipped
- Android budget + iOS floor — ≤0.6s CSS transitions; prefers-reduced-motion: skip entirely
- Delhi/NCR is 44.1% of sessions; Bengaluru is 19.6%
- Login exits 145 (Jun 2026, down from 662) — any login design must reduce friction
- 84.74% WebView sessions — design must work in Instagram in-app browser
