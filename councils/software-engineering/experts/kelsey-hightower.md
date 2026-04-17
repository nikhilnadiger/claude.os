---
expert: Kelsey Hightower (Global)
council: SOFTWARE ENGINEERING
learnings: 25
---

# Kelsey Hightower (Global) — Full Learnings

## 1. No-Code Is The Best Code

**Problem:** Engineers love complex solutions. Overengineering.
**Mainstream:** More code = more power.
**Their approach:** Less code is better. Solution with least code wins. Code is liability.
**Example:** Deploy to Kubernetes manually, no orchestration. Works fine. But with orchestration, simpler.

## 2. Do The Hard Way First

**Problem:** Tools abstract away learning. Understand is missing.
**Mainstream:** Use tools. They save time.
**Their approach:** Learn how it works first. Build from scratch. Then use tools.
**Example:** Kubernetes: build cluster from scratch before using managed service. Now you understand.

## 3. Operational Excellence as First Priority

**Problem:** Code works in dev. Breaks in production.
**Mainstream:** Dev environment sufficient.
**Their approach:** Design for operations. Operator can understand and manage system.
**Example:** Logs are clean. Metrics are clear. Operator can debug 3am page without calling developer.

## 4. Boring Technology Wins

**Problem:** New tech is cool. But untested, breaks.
**Mainstream:** Latest and greatest. Cutting edge.
**Their approach:** Choose boring, proven technology. Trade novelty for reliability.
**Example:** PostgreSQL instead of trendy NoSQL. Fewer surprises. Stable. Predictable.

## 5. Systemic Empathy

**Problem:** Developers don't understand operational pain.
**Mainstream:** Ops and dev separate.
**Their approach:** Developers understand operational reality. This drives better design.
**Example:** Developer on call. Wakes up 3am for page. Now writes better code. Empathy drives quality.

## 6. Technical Debt Is a Choice

**Problem:** Technical debt inevitable. Accumulates naturally.
**Mainstream:** Pay down debt when convenient.
**Their approach:** Technical debt is conscious choice. Acknowledge cost. Make informed decisions.
**Example:** Shortcut for speed. But document cost. Plan to pay down. Debt is visible and managed.

## 7. Observe Reality, Not Theory

**Problem:** Theory says one thing. Reality is different.
**Mainstream:** Follow best practices.
**Their approach:** Observe actual system behavior. Theory is guide. Reality is truth.
**Example:** Theory says service mesh improves observability. Reality: adds complexity, marginal benefit. Don't use.

## 8. Build for Failure

**Problem:** System assumes everything works. Fails catastrophically.
**Mainstream:** Prevent failures.
**Their approach:** Assume failures. Design for graceful degradation. System survives failures.
**Example:** Database connection fails. System returns cached data. Doesn't crash.

## 9. Observability Is Non-Negotiable

**Problem:** Production issues invisible. Blind.
**Mainstream:** Logs and metrics are nice-to-have.
**Their approach:** Observability required. Logs, metrics, traces. Understanding runtime behavior essential.
**Example:** Latency spike. Distributed traces show which service slow. Quick diagnosis. Quick fix.

## 10. Simplicity in Operations

**Problem:** Complex system hard to operate. Mistakes happen.
**Mainstream:** Features require complexity.
**Their approach:** Operational simplicity prioritized. Design simple to operate. Fewer mistakes.
**Example:** Stateless service. Easy to operate. Scale horizontally. No complex distributed state.

## 11. The Operator's Perspective

**Problem:** Feature works in lab. Breaks in production.
**Mainstream:** Lab environment is sufficient.
**Their approach:** Always consider operator perspective. Can they operate this at 3am?
**Example:** Error message clear. Operator immediately understands issue. Not debug logs only.

## 12. Kubernetes Complexity Warning

**Problem:** Kubernetes is trending. Everyone wants it.
**Mainstream:** Kubernetes solves problems.
**Their approach:** Kubernetes is complex. Use only if needed. Many problems don't need it.
**Example:** Small application. Kubernetes overkill. Simple deployment sufficient. Don't use it.

## 13. Explicit Over Implicit

**Problem:** Implicit behavior seems clever. Actually confusing.
**Mainstream:** Implicit is elegant.
**Their approach:** Explicit is better. What it does is obvious. No magic.
**Example:** Magic configuration hard to debug. Explicit configuration clear. Debuggable.

## 14. Distributed Systems Are Hard

**Problem:** Distributed systems seem necessary. Actually complicated.
**Mainstream:** Scale requires distribution.
**Their approach:** Start with single system. Distribute only when necessary. Distributed systems harder.
**Example:** Monolith scales fine. Microservices add complexity. Don't distribute prematurely.

## 15. Measuring What Matters

**Problem:** Metrics optimized. Actual user experience bad.
**Mainstream:** Metrics drive decisions.
**Their approach:** Measure user-facing metrics. Not just system metrics. What users experience.
**Example:** Server latency fast. But user experience slow. Measure end-to-end latency. That's what users feel.

## 16. Configuration as Code

**Problem:** Manual configuration error-prone. Not reproducible.
**Mainstream:** Config files for reproducibility.
**Their approach:** Configuration in code. Version controlled. Testable. Reproducible.
**Example:** Infrastructure config in code. Deploy to dev/staging/prod. Identical.

## 17. The Cost of Abstraction

**Problem:** Abstraction hides complexity. Appears simple.
**Mainstream:** Abstraction is good.
**Their approach:** Abstraction has cost. When it leaks, debugging is hard. Use carefully.
**Example:** ORM hides SQL. But when it breaks, ORM magic is hard to debug.

## 18. Logging as First-Class Feature

**Problem:** Logging is afterthought. Debugging is hard.
**Mainstream:** Log for debug only.
**Their approach:** Logging is first-class. Structured logs. Searchable. Debuggable.
**Example:** JSON logs with context. Parse and search. Find issues quickly.

## 19. The Goldilocks of Resources

**Problem:** Resource allocation unclear. Systems fail.
**Mainstream:** Allocate generously.
**Their approach:** Right-sized resources. Know what's needed. Not too much, not too little.
**Example:** Memory limit 512MB. Works fine. No need for 2GB. Right-sized.

## 20. Graceful Degradation

**Problem:** System fails entirely. Cascading failure.
**Mainstream:** Prevent failures.
**Their approach:** Design to degrade gracefully. Part of system down? Rest continues.
**Example:** Cache service down. Use stale cache. Better than failing entirely.

## 21. Operability as Architecture Decision

**Problem:** Operability is non-functional requirement. Often ignored.
**Mainstream:** Focus on features.
**Their approach:** Operability is core architectural decision. Design for operational excellence.
**Example:** Stateless architecture chosen for operability. Easy to scale, debug, operate.

## 22. Curiosity as Professional Tool

**Problem:** Engineers follow patterns. Don't understand why.
**Mainstream:** Work within patterns.
**Their approach:** Curious about how things work. Understand deeply. Better engineering.
**Example:** Why does Kubernetes do this? Read source. Understand design. Better use of tool.

## 23. The Humility of Operations

**Problem:** Developers confident. Operations understands reality.
**Mainstream:** Developers lead design.
**Their approach:** Humility about complexity. Learn from operations. Build better systems.
**Example:** Ops team has war stories. Learn from them. Design better systems.

## 24. Automate Pain, Not Because You Can

**Problem:** Automate everything. Overcomplexity.
**Mainstream:** Automation is always good.
**Their approach:** Automate actual pain points. Not for sake of automation.
**Example:** Manual deploy 10 times daily: automate. Manual deploy quarterly: not worth it.

## 25. The 3am Test

**Problem:** Feature seems good. But hard to operate.
**Mainstream:** Operability is secondary.
**Their approach:** Would you want to operate this at 3am? If no, redesign.
**Example:** Page at 3am. Complex debugging. Redesign. Now simple to debug.
