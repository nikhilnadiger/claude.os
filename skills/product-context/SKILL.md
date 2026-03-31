---
name: product-context
version: 1.0
description: >
  Use for understanding how the staffroom product works: feature behaviour,
  data flows, user journeys, API endpoints, and product metrics. Triggers:
  'how does X work in the product', 'what does this API do', 'user journey
  for', 'data flow for', 'how are reviews stored', 'what happens when a
  teacher searches', 'how does the auth flow work', 'what does this screen
  do', 'product overview', 'how does staffroom work', 'what is the review
  submission flow', 'how does search work', 'API inventory'. Not for
  building or fixing code (use codebase-context) or designing new features
  (use product-design).

triggers:
  - "how does X work in the product"
  - "what does this API do"
  - "user journey"
  - "data flow"
  - "how are reviews stored"
  - "what happens when a teacher"
  - "how does the auth flow work"
  - "what does this screen do"
  - "product overview"
  - "how does staffroom work"
  - "what is the review submission flow"
  - "how does search work"
  - "API inventory"

uses_references:
  - references/data-flow.md
  - references/api-inventory.md
  - references/db-schema.md

related_skills:
  - product-design
  - codebase-context
  - engineering-review

live_references:
  - label: Teacher Insights (user research, 3 segments, verbatim quotes)
    path: claude.os/knowledge/staffroom-teacher-insights.md
    tool: read_file
  - label: Product Metrics (platform counts, Clarity analytics — refresh before use)
    path: claude.os/knowledge/staffroom-product-metrics.md
    tool: read_file
---

# product-context

## Purpose

The reference layer for understanding what staffroom does and how it works
at the product level — user journeys, data flows, API contracts, and
platform metrics. Load this to answer "how does X work?" questions about
the product. Load codebase-context when you need to implement or debug;
load product-context when you need to understand.

## What staffroom is

India's first teacher-powered platform for real insights into school
workplaces. Teachers leave anonymous experiences of schools (salary,
culture, management, facilities). Schools build reputation through
verified teacher feedback and attract top talent. Functionally Glassdoor;
brand-positioned as Tripadvisor — positive, discovery-oriented.

## When to Load This Skill

- Understanding a user journey (e.g., how a teacher submits a review)
- Understanding a data flow (e.g., how teacher count is resolved for a school)
- Understanding what an API endpoint does or returns
- Getting product metrics or platform counts before a decision
- Understanding user research or teacher segments
- Providing product context as input to an engineering or design task

## When NOT to Load This Skill

- Building or fixing code → use codebase-context
- Designing a new feature or critiquing a UI → use product-design
- Content strategy or brand questions → use content-strategy / brand-custodian

## Key Product Numbers (Mar 2026 — verify against live metrics before use)

| Metric | Value |
|---|---|
| Sign-ups | 2,905 |
| Reviews submitted | 635 across 555 schools |
| Schools with 3+ reviews | 15 |
| Total searches | 1,408 (108 users searched 3+ times) |
| Sessions — Clarity 30d | 2,351 |
| Mobile sessions | 90% |
| Bengaluru sessions | 44% |
| Login page exits | 606 — primary drop-off |
| PMF threshold | ≥70% searches yield ≥3 reviews in 7 cities |

## Routing

| Question type | Where to look |
|---|---|
| User journey / data flow | `references/data-flow.md` |
| API endpoints / contracts | `references/api-inventory.md` |
| DB tables / columns / schema | `references/db-schema.md` |
| User research / teacher segments | Live reference: staffroom-teacher-insights.md |
| Platform metrics / Clarity data | Live reference: staffroom-product-metrics.md |

## Workflow

1. Identify which routing path applies (table above)
2. Load the relevant reference file or live reference
3. For metrics: always note "refresh before use" — figures are Mar 2026 snapshots
4. If answering a question that spans both data flow and API: read both files
