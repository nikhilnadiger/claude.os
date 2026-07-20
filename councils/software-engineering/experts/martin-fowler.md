---
expert: Martin Fowler (Global)
council: SOFTWARE ENGINEERING
learnings: 50
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

## 26. YAGNI — The Four Costs of Presumptive Features

**Problem:** Teams build features "because they'll need them soon." It seems efficient.
**Mainstream:** Build it now while you're in this area of the code.
**Their approach:** Fowler identifies four cost categories for presumptive features: cost of build (wasted effort), cost of delay (revenue lost building the wrong thing), cost of carry (complexity tax on every subsequent feature), cost of repair (when the feature is eventually built differently). Research shows 2/3 of speculative features never improve the metrics they were designed to improve.
**Example:** Storm insurance system in development. Piracy pricing needed in 6 months. Don't build it now — every week of carry adds overhead to storm features. Build piracy pricing when needed.

## 27. Command Query Separation — Methods Either Change State or Return Values, Never Both

**Problem:** Methods that both change state and return a value are unpredictable and hard to compose safely.
**Mainstream:** Combine state change and return value for convenience — stack.pop() returns and removes.
**Their approach:** Divide methods into two categories: Queries (return results, no side effects, freely composable) and Commands/Modifiers (change state, return nothing). Separation makes code more predictable. Prefer separate advance() and current() over a combined next().
**Example:** A method that returns a record and also marks it as read violates CQS. Split: markAsRead() as command, getCurrentRecord() as query. Each can now be reasoned about independently.

## 28. CQRS — Separate Read and Write Models for Specific Complex Domains

**Problem:** A single CRUD model struggles when write logic (validation, business rules) and read logic (aggregations, reporting) are fundamentally different in complexity.
**Mainstream:** One model handles all interactions — create, read, update, delete.
**Their approach:** CQRS (Command Query Responsibility Segregation) uses separate models for updates and queries. The write model enforces business rules; the read model is optimized for display. Fowler cautions this pattern adds significant complexity — use it only on bounded contexts where the benefit is clear, not system-wide.
**Example:** E-commerce write model enforces inventory constraints and pricing rules. Read model provides denormalized product catalog for browsing. Different databases, eventually consistent.

## 29. Tolerant Reader — Be Liberal in What You Accept from Service Providers

**Problem:** Service consumers break whenever producers add new fields or change message structure.
**Mainstream:** Generate strongly-typed client classes from provider schema (XSD to C# classes). Any provider change breaks consumers.
**Their approach:** Consumers should only extract the elements they need and ignore everything else. Follow Postel's Law: be conservative in what you send, liberal in what you accept. Use loose XPath queries (//order rather than /orders/order-list/order). Wrap payload parsing in a single object so the rest of the system is insulated.
**Example:** Payment service adds a new currency field to its response. Tolerant reader ignores it. Consumer keeps running without redeployment. Provider can evolve without coordinating with every consumer.

## 30. Canary Release — Progressive Traffic Migration Reduces Risk

**Problem:** New version deployed to all users at once. A serious bug affects everyone simultaneously.
**Mainstream:** Deploy to all servers. Hope it works. Roll back all servers if it doesn't.
**Their approach:** Deploy new version to a small subset of infrastructure. Route 1-5% of users to the new version. Monitor metrics. Increase percentage as confidence grows. Distinct from A/B testing — canary is about detecting regressions, not testing hypotheses.
**Example:** New checkout flow deployed to 1% of users. Error rates normal. Expand to 10%, then 50%, then 100%. If error spike detected at any stage, reroute all traffic back to old version.

## 31. Blue-Green Deployment — Zero Downtime Via Router Switch

**Problem:** Deployments require downtime. Rolling back is slow and risky.
**Mainstream:** Maintenance windows. Big-bang cutover. Extended downtime for major releases.
**Their approach:** Maintain two identical production environments (blue and green). Live traffic routes to blue. Deploy and test new version on green. When ready, switch the router. Green is now live, blue is standby. If green fails, switch router back instantly.
**Example:** New API version deployed to green while blue serves all production traffic. Load tests pass on green. Router switches in seconds. If issues appear, flip back to blue within seconds.

## 32. Fluent Interface — API Designed to Read Like a Language, Not Just Chain Methods

**Problem:** Building complex objects requires many variables and method calls. Code reads like assembly, not intent.
**Mainstream:** Constructor plus setters. Functional but verbose and hard to scan.
**Their approach:** Design the API so calls compose naturally to express intent — the goal is the DSL quality of the interface, not just method chaining. Fluency means the sequence of calls reads like a domain sentence. True fluent interfaces require designing what state each call returns — not just having every method return `this`.
**Example:** customer.newOrder().with(6, "TAL").with(5, "HPK").skippable().priorityRush() versus creating Order, three OrderLines, calling addLine() for each, then calling setRush(true).

## 33. Presentation Domain Data Layering — Three Layers to Narrow Cognitive Scope

**Problem:** UI, business logic, and data access entangled. Any change requires understanding all three simultaneously.
**Mainstream:** MVC framework separates concerns in theory but collapses them in practice.
**Their approach:** Strictly separate presentation (UI), domain logic (business rules), and data access. The primary benefit is reduced scope of attention — think about one layer at a time. Second benefit: testability (domain logic tested without UI gymnastics). Key warning: developers don't have to be full-stack, but teams should be. Organizing teams by layer creates friction and reduces cross-layer understanding.
**Example:** Adding a new business rule touches only domain layer. Changing from SQL to NoSQL touches only data layer. Changing from web to mobile touches only presentation layer.

## 34. Test Doubles — Precise Vocabulary Prevents Conceptual Confusion

**Problem:** "Mock" used as a generic term for all test substitutes. Teams argue about testing because they're describing different things.
**Mainstream:** "Just mock the dependencies." Mocks, stubs, and fakes treated as synonyms.
**Their approach:** Five distinct types with different behaviors: Dummy (fills parameter lists, never used), Fake (working implementation with shortcuts unsuitable for production), Stub (canned answers, state verification), Spy (stub that records call information), Mock (pre-programmed expectations, behavior verification, verified after test). Only mocks use behavior verification. Conflating them leads to the wrong test approach.
**Example:** Testing email service: Stub returns success without sending. Spy records how many messages were sent. Mock asserts the exact recipient and content and fails if the method wasn't called exactly once.

## 35. Sacrificial Architecture — Design Deliberately for Replacement

**Problem:** Throwing away code feels like failure. Teams resist replacing working systems.
**Mainstream:** Build to last. Architectural decisions made early are expensive to undo.
**Their approach:** Sometimes the best code you can write now is code you expect to discard in a few years. Deliberately building a sacrificial architecture means: accepting current limits, designing for graceful replaceability, maintaining internal quality (good modularity makes replacement easier), and recognizing that discarded software can still deliver real value.
**Example:** eBay went from Perl scripts (1995) to C++ (1997) to Java (2002). Each discarded system was not failure — it was the learning substrate that funded the next. The Perl scripts generated the revenue that paid for the C++ rebuild.

## 36. Semantic Conflict — Tests Are the Only Guard Against Hidden Merge Damage

**Problem:** Code merges cleanly at the text level but behaves incorrectly after merge.
**Mainstream:** Modern VCS tools handle merges. No textual conflict means no problem.
**Their approach:** Textual merge success only means no line-level conflicts. Semantic conflicts — where code compiles but produces incorrect behavior — are invisible to VCS tools. Developer A renames a method; developer B adds calls to the old name on a feature branch. Textual merge succeeds. Program breaks at runtime. Only self-testing code catches semantic conflicts, and only continuous integration ensures they're caught quickly.
**Example:** calculateBill() renamed to computeInvoice(). Feature branch adds 10 new calls to calculateBill(). Textual merge succeeds. Runtime: method-not-found.

## 37. Branch By Abstraction — Large Replacements Without Long-Lived Branches

**Problem:** Replacing a major component (ORM, web framework) requires either a big-bang switch or a months-long feature branch that diverges from trunk.
**Mainstream:** Long-lived feature branch for the rewrite, big-bang merge at the end.
**Their approach:** Introduce an abstraction layer over the component to be replaced. Migrate consumers gradually to use the abstraction. Build new implementation behind the same abstraction. Switch component, remove old implementation. System stays releasable throughout all phases.
**Example:** Replace Hibernate with new ORM: 1) Introduce RepositoryInterface wrapping Hibernate, 2) Migrate all callers to RepositoryInterface, 3) Build new ORM behind RepositoryInterface, 4) Switch implementations, 5) Remove Hibernate dependency.

## 38. Parallel Change — Expand, Migrate, Contract

**Problem:** Backward-incompatible API change breaks all consumers simultaneously.
**Mainstream:** Change the API signature, fix all consumers in one large commit, or maintain versioned APIs forever.
**Their approach:** Three-phase pattern: Expand (add new version of API alongside old, both work), Migrate (move consumers one by one to new API), Contract (delete old API once all consumers migrated). System releasable at any phase. Works for methods, REST endpoints, and database schemas.
**Example:** Grid.addCell(x, y, cell) changing to Grid.addCell(Coordinate, cell): Expand adds new method, keeps old. Each team migrates their calls in separate commits. Contract removes old method after all migrated.

## 39. Self-Testing Code — Build the Bug Detector, Not Just the Bug Checker

**Problem:** Tests treated as secondary verification written after features when time permits.
**Mainstream:** Test what you remember to test. Testing is a separate phase.
**Their approach:** Self-testing code means every codebase simultaneously contains a bug detector. No programming episode is complete without working code and the tests that keep it working. When a production bug appears, first write a test that exposes it, then fix it. Any non-trivial code without tests is assumed to be broken.
**Example:** Production bug found. Step 1: write failing test that reproduces it. Step 2: fix bug. Step 3: test passes. Now the bug cannot silently return.

## 40. Classical vs Mockist TDD — State Verification vs Behavior Verification

**Problem:** "How should I test this?" generates confusion. Teams mock everything, or nothing, without understanding the tradeoffs.
**Mainstream:** Use mock objects for everything that's a dependency.
**Their approach:** Classical TDD uses real collaborators where possible and checks state after the interaction (what did the warehouse contain after the order was filled?). Mockist TDD always mocks collaborators and checks behavior (was warehouse.remove() called with the right arguments?). Mockist tests are more coupled to implementation and make refactoring harder. Fowler personally prefers classical.
**Example:** Classical: order.fill(realWarehouse); assertEquals(0, warehouse.getInventory("TALISKER")). Mockist: warehouseMock.verify that remove("TALISKER", 50) was called exactly once.

## 41. Event Sourcing — Store the Sequence of Events, Not Just Current State

**Problem:** Database stores current state. Audit trail is lossy. Time-travel queries are impossible. Debugging production issues requires reconstruction.
**Mainstream:** UPDATE rows to reflect current state. Current state is all that exists.
**Their approach:** Store state as a complete, immutable sequence of events. Current state is derived by replaying events. Enables full audit trail, temporal queries ("what was the account balance on March 3rd?"), event replay for debugging, and new projections built from historical events. Pairs naturally with CQRS.
**Example:** Bank account: not balance=500 but [Deposited 1000, Withdrew 300, Deposited 800, Withdrew 1000]. Replay all events to get current balance. Replay events up to March 3rd to get historical balance.

## 42. Consumer-Driven Contracts — Let Consumers Define What They Need from Providers

**Problem:** API providers change their service and unknowingly break consumers. Consumers can't safely evolve independently.
**Mainstream:** Provider publishes API spec. Consumers adapt. Breaking changes caught in production.
**Their approach:** Consumers write contract tests expressing exactly what they depend on from the provider. Provider runs all consumer contract tests as part of their build. Any provider change that breaks a consumer contract fails the build immediately. This inverts the typical relationship — the consumer, not the provider, defines the contract.
**Example:** Payment service consumer writes contract test: "POST /charge returns {status, transactionId}." Payment service changes response shape. Consumer's contract test fails in payment service's build. Fixed before deployment.

## 43. Feature Branching Increases Integration Risk Over Time

**Problem:** Long-lived feature branches feel productive — no interruptions, clean isolation. Integration problems appear only at merge time.
**Mainstream:** One feature branch per developer or per feature. Merge when complete.
**Their approach:** Feature branches defer integration. Semantic conflicts accumulate silently throughout the branch's lifetime. The longer the branch, the larger the integration surface. The solution is to commit to the main branch frequently — multiple times per day — using techniques like feature flags and branch by abstraction to keep unfinished work from breaking others.
**Example:** 2-week feature branch accumulates 300 file changes and 5 semantic conflicts. Merge day: 4 developers spend 2 days untangling conflicts, some behavioral bugs slipping through.

## 44. Domain-Specific Languages — Internal vs External Tradeoffs

**Problem:** Configuration and domain logic expressed in general-purpose code. Hard to read for domain experts.
**Mainstream:** XML configuration, custom config files, or raw general-purpose code.
**Their approach:** Internal DSLs use a host language to express domain logic in readable form — fluent interfaces, method chaining, closures. External DSLs are standalone languages with their own parsers. Internal DSLs are cheaper to build and benefit from host-language tooling. External DSLs offer more expressive freedom but require parser infrastructure. Most teams should prefer internal DSLs.
**Example:** Internal DSL (Ruby): 5.dollars.converted_to(:euros). External DSL: a SQL query. Internal leverages the host language and IDE. External requires its own toolchain.

## 45. Two Hats — Never Refactor and Add Features Simultaneously

**Problem:** During refactoring, developers slip in features. During feature work, developers clean up. Both are done incompletely.
**Mainstream:** Mix cleanup and features in the same commit. "I'm refactoring, but while I'm here..."
**Their approach:** Wear one hat at a time. Refactoring hat: improve structure without changing behavior — tests must pass throughout. Feature hat: add new behavior — structure changes only what's needed. When you feel the urge to switch hats, finish the current one first. Separate commits make clear which kind of change each is.
**Example:** While extracting a method, you notice a missing null check. Note it. Finish the extraction. Then add the null check as a separate feature commit.

## 46. Opportunistic Refactoring — Continuously, Not in Dedicated Sessions

**Problem:** Refactoring separated from feature work into "cleanup sprints" that never actually happen.
**Mainstream:** Quarterly code cleanup. Dedicated refactoring stories in the backlog.
**Their approach:** Refactoring happens continuously within feature work. Four workflows: Comprehension refactoring (rename to understand), Litter-pickup refactoring (fix what you notice while passing through), Preparatory refactoring (restructure before the feature), TDD refactoring (during red-green-refactor cycle). None of these is a separate scheduled activity.
**Example:** Engineer picks up a story, can't understand a method, renames variables to understand it. Code is now refactored as a natural byproduct of trying to understand it.

## 47. Preparatory Refactoring — Make the Change Easy, Then Make the Easy Change

**Problem:** A feature seems hard to add. Developer adds it in the most complex way that happens to work.
**Mainstream:** Hack the feature into the existing structure wherever it fits.
**Their approach:** First refactor to make the code receptive to the change — this is a separate commit. Then make the change — this is another separate commit. The second step becomes trivial because the first step removed the structural obstacle. Often faster in total even though it adds a step.
**Example:** Adding a new discount type. Current code has discount logic duplicated in 6 places. Step 1: extract all discount logic to one place (refactor commit). Step 2: add new discount type in that one place (feature commit). Clean, fast, safe.

## 48. Microservices Premium — Justify the Complexity Before Adopting

**Problem:** Microservices adopted as the default modern architecture without accounting for their complexity cost.
**Mainstream:** New project? Design microservices. It's what modern teams do.
**Their approach:** Microservices impose a significant complexity premium — distributed systems, network failure handling, eventual consistency, per-service deployment pipelines, service discovery. Start with a well-structured monolith. Extract microservices when a specific benefit (independent deployability, independent scaling) clearly outweighs the complexity cost. A monolith-first approach is not an anti-pattern.
**Example:** Startup builds 15 microservices from day one. Debugging requires tracing across 6 services. Deployment requires orchestrating 15 pipelines. Most of that complexity is cost without benefit until the team is 50+ engineers.

## 49. Reporting Database — A Separate Read-Optimized Store Solves Most Query Problems

**Problem:** Transactional database struggles with complex reporting queries without full CQRS overhead.
**Mainstream:** Add indexes. Tune queries. Accept that reports are slow or compromise the transaction model.
**Their approach:** Create a separate reporting database optimized for reads — denormalized, pre-aggregated, updated asynchronously from the transactional store. Use it for reporting queries. Even without full CQRS separation, a reporting database solves the read performance problem without architectural complexity.
**Example:** Orders table: normalized, write-optimized. Reporting DB: pre-computed monthly revenue by region. Report queries: milliseconds on reporting DB versus minutes on production DB.

## 50. Immutable Servers — Provision and Replace Rather Than Patch and Maintain

**Problem:** Production servers accumulate configuration drift. No two servers in a fleet are identical. "Works on server A, fails on server B" is unexplainable.
**Mainstream:** SSH into servers to apply patches, install software, change config. Servers maintained indefinitely.
**Their approach:** Treat servers as immutable. Never patch or configure servers after initial provisioning. When an update is needed, build a new server image, provision new instances, route traffic, terminate old instances. Phoenix Servers: regularly rebuilt from scratch, like a phoenix. No manual configuration accumulates.
**Example:** Java version upgrade: build new AMI with new JDK, provision new fleet using Infrastructure as Code, point load balancer at new fleet, terminate old fleet. Entire fleet identical. No drift.
