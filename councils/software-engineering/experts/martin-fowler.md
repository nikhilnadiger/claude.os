---
expert: Martin Fowler (Global)
council: SOFTWARE ENGINEERING
learnings: 25
---

# Martin Fowler (Global) — Full Learnings

## 1. Evolutionary Architecture

**Problem:** Architecture decided upfront. Can't evolve.
**Mainstream:** Big up-front design. Get architecture right.
**Their approach:** Architecture evolves. Start simple. Change as understanding deepens. Refactoring enables evolution.
**Example:** Monolithic architecture. As it grows, extract services. Never redesign. Always evolving.

## 2. Refactoring to Patterns

**Problem:** Complex architecture required from start. Overkill.
**Mainstream:** Anticipate patterns. Build complex from day one.
**Their approach:** Start simple. As complexity emerges, refactor toward patterns. Pattern becomes obvious.
**Example:** Simple class structure. As it grows, Factory pattern becomes obvious. Refactor into it.

## 3. Small Continuous Changes Over Big Rewrites

**Problem:** System becomes big ball of mud. Rewrite needed.
**Mainstream:** Keep system. Do big rewrite every 3 years.
**Their approach:** Small, continuous changes prevent mud. Refactoring regularly keeps system healthy.
**Example:** Every iteration includes refactoring time. System stays healthy. Never needs rewrite.

## 4. Test-Driven Development as Design Tool

**Problem:** Design hard. Code afterward. Wrong design.
**Mainstream:** Design first. Code after.
**Their approach:** TDD forces good design. If hard to test, design is wrong. Change design. Tests guide design.
**Example:** Can't test dependency injection. Refactor to dependency injection. Code becomes testable and better designed.

## 5. The Safe Refactoring

**Problem:** Refactoring breaks things. Risky.
**Mainstream:** Refactor minimally. Fear of breakage.
**Their approach:** Test safety enables bold refactoring. With good tests, refactor fearlessly.
**Example:** Want to rename 100 places. With tests, do it confidently. Tests catch mistakes.

## 6. Microservices Challenges

**Problem:** Monolith becomes slow. Need microservices.
**Mainstream:** Microservices solves everything.
**Their approach:** Monolith first. Extract microservices when justified. Complexity cost of microservices high.
**Example:** Start monolith. As independent services emerge, extract. Sometimes monolith is right answer.

## 7. The Strangler Fig Pattern

**Problem:** Big system needs replacement. Risk of rewrite.
**Mainstream:** Big bang replacement.
**Their approach:** Gradually replace old system with new. Old and new coexist. Gradual switchover.
**Example:** Build new system alongside old. Route traffic slowly to new. Parallel running reduces risk.

## 8. Coupling Kills Flexibility

**Problem:** System rigid. Hard to change.
**Mainstream:** Everything connected.
**Their approach:** Minimize coupling. High cohesion. Change in one part doesn't ripple.
**Example:** Service A depends on B's internal structure. Tightly coupled. Change B breaks A. Loose coupling through contracts.

## 9. Continuous Integration Discipline

**Problem:** Branches diverge. Merge hell.
**Mainstream:** Long-lived branches. Protect against conflicts.
**Their approach:** Frequent commits to trunk. Tests catch integration issues immediately. No merge hell.
**Example:** Commit multiple times daily. Tests run. Integrate continuously. Issues caught fast.

## 10. The Database as Strangler

**Problem:** Database tightly coupled. Hard to change schema.
**Mainstream:** DBA owns schema. Developers adapt.
**Their approach:** Database as component. Schema as API. Changes managed carefully.
**Example:** Schema change through migration. Backward compatible. Gradual rollout. No downtime.

## 11. Testing Pyramid

**Problem:** All tests slow. Manual testing. Low confidence.
**Mainstream:** Manual testing most reliable.
**Their approach:** Fast unit tests (base), slower integration tests (middle), slow e2e tests (top). Pyramid shape.
**Example:** 1000 unit tests (fast). 100 integration tests (slower). 10 e2e tests (slowest). Efficient feedback.

## 12. Continuous Delivery as Discipline

**Problem:** Releases infrequent. Risk high.
**Mainstream:** Batch releases. Quarterly releases.
**Their approach:** Releasable every commit. Deploy to production daily. Low risk deployments.
**Example:** Feature flagging allows deploy without release. Released code is dark. Flip switch to enable.

## 13. The Cost of Complexity

**Problem:** System grows. Complexity accumulates.
**Mainstream:** Complexity is inevitable.
**Their approach:** Actively fight complexity. Refactor regularly. Keep system simple as it grows.
**Example:** As features add, also remove unnecessary code. Simplification is ongoing.

## 14. Monolithic vs. Distributed

**Problem:** Which is better? Microservices or monolith?
**Mainstream:** Microservices is modern. Use it.
**Their approach:** Both are tools. Monolith simple, but couples everything. Microservices complex, but decouples. Choose based on need.
**Example:** Startup: monolith. Large company: microservices. Scaling needs differ.

## 15. API as Contract

**Problem:** API changes break clients.
**Mainstream:** API is implementation detail.
**Their approach:** API is contract. Version it. Maintain backward compatibility. Contract is stable.
**Example:** Change internal implementation. External API unchanged. Clients don't care.

## 16. Testing Legacy Code

**Problem:** Old code untested. Risky to change.
**Mainstream:** Rewrite legacy code.
**Their approach:** Add tests around legacy code. Tests enable safe refactoring. Gradually improve.
**Example:** Legacy method untested. Write characterization tests. Tests document behavior. Now safe to refactor.

## 17. Design Patterns as Language

**Problem:** Describing design solutions is verbose.
**Mainstream:** Explain in detail.
**Their approach:** Design patterns are vocabulary. Shared understanding. Name a pattern, everyone knows intent.
**Example:** Observer pattern. Everyone knows: one-to-many dependency. Notifications. Shared vocabulary.

## 18. The Two Rules of Simple Design

**Problem:** What makes design good?
**Mainstream:** Experience and taste determine quality.
**Their approach:** Simple design: passes tests, reveals intent. Two rules. Everything else follows.
**Example:** Does it pass tests? Does it reveal intent? Then it's good design.

## 19. Premature Optimization Is Root of Evil

**Problem:** Performance is critical. Optimize from start.
**Mainstream:** Optimize early. Better safe than sorry.
**Their approach:** Optimize after profiling. Get code right first. Then optimize the 20% that matters.
**Example:** Profile reveals 80% time in one function. Optimize that. Not the 99% that doesn't matter.

## 20. Bounded Contexts

**Problem:** One ubiquitous language doesn't work. Teams confused.
**Mainstream:** One model for everything.
**Their approach:** Different contexts have different models. Model valid only within context. Boundaries matter.
**Example:** In Sales context: Customer. In Shipping context: Recipient. Different models. Different bounded contexts.

## 21. The Power of Feedback

**Problem:** Development is slow. Long iteration cycles.
**Mainstream:** Slower is more careful.
**Their approach:** Short feedback loops. Tests, deployments, metrics. Know immediately if change worked.
**Example:** Deploy daily. Metrics show impact daily. Learn fast. Adjust quickly.

## 22. Infrastructure as Code

**Problem:** Manual infrastructure is error-prone. Not reproducible.
**Mainstream:** Ops teams manage manually.
**Their approach:** Infrastructure defined in code. Version controlled. Reproducible. Testable.
**Example:** Server configuration in code. Deploy to any environment. Identical.

## 23. Feature Flags Decouple Release from Deployment

**Problem:** Release = deployment. All users get feature. Risky.
**Mainstream:** Test thoroughly before release.
**Their approach:** Deploy code dark. Feature flag controls visibility. Roll out feature gradually.
**Example:** Deploy to 1% of users. Monitor metrics. Increase gradually. Kill switch if issues.

## 24. Technical Debt Is Real Debt

**Problem:** Technical debt invisible. No urgency.
**Mainstream:** Debt is inevitable. Accept it.
**Their approach:** Debt is real cost. Accrues interest. Must be paid. Make it visible and manage it.
**Example:** Debt tracker in sprint. Allocate time to pay down. Never ignore debt.

## 25. Organization Structure Mirrors Code Structure

**Problem:** Organization and code are separate.
**Mainstream:** Organization decides code structure.
**Their approach:** Code structure mirrors team structure. Conway's Law. Organize teams for code you want.
**Example:** Want microservices? Organize into independent teams. Code structure will follow.
