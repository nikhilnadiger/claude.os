---
expert: Kelsey Hightower (Global)
council: SOFTWARE ENGINEERING
learnings: 50
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

## 26. Platform Engineering Is Product Engineering

**Problem:** Internal platform teams build tools developers don't adopt, then mandate their use.
**Mainstream:** Build what seems useful internally; tell developers to use it.
**Their approach:** Platform teams must think like product teams. Developers are customers. If developers build workarounds to your platform, that is product feedback — the platform has failed, not the developers.
**Example:** An internal deployment tool with 40% adoption despite a company mandate signals a product problem. The 60% building workarounds are telling you exactly what's wrong.

## 27. You Build It, You Run It

**Problem:** Separation between development and operations creates misaligned incentives.
**Mainstream:** Dev teams write code; ops teams run it in production.
**Their approach:** Teams that write code should operate it in production. The direct feedback loop between what you build and what pages you at 3am improves quality faster than any review process.
**Example:** A developer who has never been on-call for their service optimizes for features. A developer who gets paged immediately starts caring about error messages, timeouts, and graceful shutdown.

## 28. GitOps: Git as the Authoritative Source

**Problem:** Infrastructure drifts between what is documented and what actually runs in production.
**Mainstream:** Deploy with scripts; track changes in tickets or wikis.
**Their approach:** Git should be the single source of truth for desired system state. Changes to infrastructure flow through pull requests. When a cluster drifts from the repo, it gets reconciled back — the repo wins.
**Example:** An operator accidentally deletes a namespace. A GitOps operator detects the drift and recreates it from the committed state. The system self-heals to match the declared intent.

## 29. Service Mesh: Justify the Complexity First

**Problem:** Teams adopt service meshes because they are marketed as best practice, not because they solve a specific problem.
**Mainstream:** Install Istio or Linkerd for mTLS, observability, and traffic management.
**Their approach:** Service meshes add substantial operational complexity — sidecars, control planes, CRDs, performance overhead. Most teams do not need them. Identify the specific problem first; then evaluate whether a service mesh is the simplest solution.
**Example:** A startup adding Istio for mTLS is solving a compliance problem it doesn't have yet. The same startup adding mutual TLS at the application layer is solving the same problem with far less infrastructure to maintain.

## 30. The Four Golden Signals

**Problem:** Teams instrument everything or nothing, leaving them blind or drowning in irrelevant data.
**Mainstream:** Build dashboards with hundreds of metrics; alert on anything that changes.
**Their approach:** Four signals tell you everything you need to know about any service's health: latency, traffic, errors, saturation. Start with these. They diagnose most problems and reveal what kind of problem you have.
**Example:** Latency spike with low error rate: performance regression. Latency spike with rising error rate: code or dependency failure. Traffic spike with saturation climbing: scaling problem. Four signals, three diagnoses.

## 31. Toil Is an Investment Problem

**Problem:** Operational toil is accepted as the inevitable cost of running systems.
**Mainstream:** Hire more people to absorb more operational work.
**Their approach:** Toil is manual, repetitive, automatable work that scales with traffic but does not improve the system. Quantify it. When toil consumes more than half an engineer's time, they have no capacity left to make things better. Toil reduction is investment with compound returns.
**Example:** Manual certificate rotation taking four hours per month: six months to automate. After automation, those four hours are reclaimed every month forever. The investment breaks even in six months; after that it's pure gain.

## 32. Runbooks Should Be Executable

**Problem:** Runbooks are written as documents that drift away from reality before the next incident.
**Mainstream:** Write detailed step-by-step runbooks; update them after every incident.
**Their approach:** If a runbook exists as prose, it will be wrong when you need it. Runbooks should be executable scripts or automation. The best runbook is one that runs itself — and the best outcome is that the system heals before anyone reads it.
**Example:** A runbook for restarting a crashed service says "SSH to server X, run `systemctl restart app`." That should be a script in your automation repository, triggered by the alert itself. If you still need the runbook, the system is not reliable enough.

## 33. Blameless Postmortems Build Reliable Systems

**Problem:** Incidents produce blame, fear of failure, and cover-up — ensuring the same failures recur.
**Mainstream:** Identify who caused the incident and prevent them from doing it again.
**Their approach:** If someone made a mistake, the system allowed it. Blameless postmortems ask: why did the system make this mistake possible? Fix the system, not the person. Blame optimizes for self-protection; blameless analysis optimizes for reliability.
**Example:** A developer pushed bad config to production. Blameless question: why could a single unreviewed config push reach production? Fix: require approval for production config changes. The systemic fix prevents the class of errors, not just this instance.

## 34. Golden Paths Enable Good Defaults

**Problem:** Developer platforms either restrict developer autonomy by blocking alternatives or provide no direction at all.
**Mainstream:** Enforce standards by making non-compliant paths impossible.
**Their approach:** Build opinionated golden paths — well-supported workflows that make doing the right thing the easiest path. Logging, monitoring, and security come for free on the golden path. Don't block alternatives; just make them cost more effort than following the path.
**Example:** A platform team's deployment template gives teams logging, tracing, and security scanning automatically. Teams that need custom deploys can still have them — they just don't get those defaults for free. 90% of teams take the golden path; 10% customize when they genuinely need to.

## 35. Kubernetes Is an API, Not a Solution

**Problem:** Teams adopt Kubernetes expecting it to solve operational problems it was not designed to address.
**Mainstream:** Kubernetes is the platform; add everything on top of it.
**Their approach:** Kubernetes is fundamentally an API layer for declarative infrastructure. Its value is the API contract — declare what you want, and controllers figure out how to achieve it. Extend it with operators and custom resources to model your specific domain.
**Example:** A `kind: DatabaseCluster` custom resource defined by an operator lets application teams declare what they need. The operator handles provisioning details. Teams work with the API; the implementation is hidden.

## 36. Container Security Starts With Minimalism

**Problem:** Containers ship full operating systems as base images, running as root with tools nobody needs at runtime.
**Mainstream:** Start with a familiar full OS base image and configure from there.
**Their approach:** The attack surface is proportional to what is in the container. Start with the smallest possible base image. Run as a non-root user. Include only what your application needs at runtime. Every extra package is a potential vulnerability.
**Example:** An Alpine Linux base image is 5MB. A full Ubuntu base image is 75MB with hundreds of packages — each with its own CVE history. Smaller image: fewer vulnerabilities, faster pulls, smaller blast radius if compromised.

## 37. Right-Size Before You Scale

**Problem:** Teams over-provision in anticipation of load, then try to reduce costs after overspending at scale.
**Mainstream:** Allocate generously "just in case"; optimize later.
**Their approach:** Measure actual resource usage first, then provision with reasonable headroom. Auto-scaling handles genuine spikes. Over-provisioning wastes money linearly with scale; right-sizing saves money at every scale level.
**Example:** A service provisioned for 4 CPUs averaging 0.4 CPU in production. Right-size to 1 CPU with auto-scaling enabled. Cost drops 75%. The auto-scaler handles actual traffic spikes; the static provision no longer pays for unused capacity.

## 38. On-Call Should Be Boring

**Problem:** On-call shifts require heroic engineers who can navigate complex systems under pressure in the middle of the night.
**Mainstream:** Hire experienced engineers capable of handling complex production incidents.
**Their approach:** If on-call requires heroes, the system design is wrong. A well-built system makes on-call uneventful — low alert volume, clear runbooks, self-healing where possible. Reducing on-call pain is reliability investment, not a personnel problem.
**Example:** A team receiving 50 actionable alerts per week invests six months improving reliability and observability. Result: 5 actionable alerts per week, most auto-resolved. On-call becomes manageable. The team's burn rate drops proportionally.

## 39. Chaos Engineering Is Continuous Practice

**Problem:** Systems are tested for failure only when they actually fail — the worst possible time.
**Mainstream:** Run a chaos engineering exercise once to demonstrate resilience; move on.
**Their approach:** Chaos engineering is not an event — it is a continuous practice. Systems that are not regularly tested under failure conditions will fail unexpectedly when you cannot afford it. Schedule regular, controlled failure injection.
**Example:** Automated chaos experiments run weekly in production during low-traffic windows. Services that cannot tolerate a random pod restart get hardened before the failure happens in an uncontrolled way.

## 40. Master One Cluster Before Running Many

**Problem:** Teams add clusters to solve problems — isolation, availability, scale — that their existing single cluster cannot handle because they do not understand it.
**Mainstream:** Use multiple clusters for tenant isolation, regional deployment, and availability.
**Their approach:** Most teams should master operating one cluster reliably before adding cross-cluster complexity. Each additional cluster multiplies operational surface area. Solve the fundamental problems first.
**Example:** A team struggling with pod scheduling failures, persistent volume claims, and namespace sprawl on one cluster does not need a second cluster. They need to understand their one cluster better before multiplying the complexity.

## 41. Helm Templates Are Not Always the Answer

**Problem:** Helm chart templates become complex meta-programming exercises that are harder to debug than the Kubernetes YAML they generate.
**Mainstream:** Use Helm for all Kubernetes deployments; maintain one chart per application.
**Their approach:** Helm's template language is a powerful tool for a specific problem: distributing configurable Kubernetes manifests to unknown consumers. For internal teams deploying their own apps, simpler approaches — Kustomize overlays, raw YAML with environment patches — are often more readable and maintainable.
**Example:** A Helm chart with 400 lines of Go template logic to handle three internal environments is harder to debug than three YAML files with environment-specific patches. The chart's power is unnecessary when you own both the chart and every place it deploys.

## 42. Serverless for the Right Workloads

**Problem:** Teams run containers 24/7 for workloads that execute sporadically, paying for idle capacity.
**Mainstream:** Package everything in containers and run it continuously.
**Their approach:** Serverless is the right abstraction for event-driven, variable-load, short-lived workloads. The evolution from VMs to containers to serverless reflects trading operational control for operational simplicity — the right trade for the right workload.
**Example:** A webhook processor handling 20 requests per day does not need a container running around the clock. A serverless function handles each invocation, costs a fraction of a cent, and scales to zero automatically between requests.

## 43. Infrastructure Code Demands Code Review

**Problem:** Infrastructure changes are treated as configuration updates rather than code changes and bypass the review discipline applied to application code.
**Mainstream:** Apply infrastructure changes directly or with minimal review; they are "just config."
**Their approach:** Infrastructure-as-code changes carry the same risk as application code — a bad Terraform apply can destroy a production database as easily as a bad deploy can crash a service. Apply the same review rigor.
**Example:** An IaC pull request that accidentally removes a security group gets reviewed, flagged, and corrected before merging. Without review, it reaches production silently. Infrastructure changes without review are unexamined production risk.

## 44. Ship to Production on Day One

**Problem:** Teams spend months building in development before a production deployment, discovering operational problems only after significant feature investment.
**Mainstream:** Build thoroughly, then deploy.
**Their approach:** Get to production as early as possible — even if it is a single endpoint returning 200 OK. Deploying on day one forces you to build deployment pipelines, observability, and operational hygiene before you have complex code to debug.
**Example:** A new service's first commit deploys a health endpoint to production. Now the team has CI/CD, monitoring, alerting, and logging configured before writing any business logic. Everything built afterward inherits that operational foundation.

## 45. Developer Experience Is the Product

**Problem:** Platform teams measure success by existence of the platform and compliance metrics rather than developer outcomes.
**Mainstream:** Build the internal platform; require teams to use it; track adoption by mandate.
**Their approach:** If you must force developers to use your platform, it is not good enough. Developer experience is the product. Measure time-to-first-deployment, escape-hatch usage, and developer satisfaction. The workarounds developers build reveal what the platform is missing.
**Example:** A platform team's deployment tool has 60% voluntary adoption with developers building custom pipelines for the other 40%. Those custom pipelines are a direct specification of what the platform should become.

## 46. Self-Healing Over Manual Remediation

**Problem:** Incidents trigger humans to perform the same manual remediation steps repeatedly.
**Mainstream:** Document and refine incident response runbooks so humans execute them faster.
**Their approach:** If a failure mode is well-understood enough to be in a runbook, it is well-understood enough to automate. Systems should detect and heal common failure modes without waking anyone up. On-call humans should handle novel failures, not routine ones.
**Example:** A service that crashes on out-of-memory errors can be configured to restart automatically with a higher memory limit if headroom is available. The operator handles exceptions; the system handles known patterns.

## 47. Environment Parity Reduces Production Surprises

**Problem:** Applications that behave correctly in development and staging fail in production because the environments are fundamentally different.
**Mainstream:** Accept that dev, staging, and production will differ; document the differences.
**Their approach:** Close the gap between environments. Infrastructure configuration differences between dev and production are bugs. The more environments diverge, the less staging predicts production behavior.
**Example:** A service that works in staging against a local Redis instance fails in production against a Redis cluster because the staging environment didn't test cluster-mode behavior. Parity would have caught this before deployment.

## 48. Ownership Requires Visibility

**Problem:** Teams are told to own their services in production but lack the visibility to understand what their services are doing.
**Mainstream:** Ops teams own production monitoring; dev teams own code.
**Their approach:** You cannot own what you cannot see. Teams that own services in production must have direct access to their service's logs, metrics, and traces — not mediated through a centralized ops team. Visibility is a prerequisite of ownership.
**Example:** A development team on-call for their service needs to pull up a latency breakdown for their specific service without filing a request with a centralized monitoring team. If they cannot, they are nominally on-call but operationally blind.

## 49. Security Is Not the Last Gate

**Problem:** Security reviews happen at the end of the development cycle, when findings are expensive to fix and create delivery bottlenecks.
**Mainstream:** Submit completed work for security review before release.
**Their approach:** Security must be integrated throughout — from container base images to network policies to secret management — not bolted on at the end. Security review at the end is not a security practice; it is a security theater.
**Example:** A team building container images from minimal, regularly-updated base images, running as non-root, with secrets from a vault rather than environment variables has addressed most security concerns before the first line of business logic is written.

## 50. Learn the Layer Below Your Abstraction

**Problem:** Engineers operate tools without understanding the layer those tools abstract away, making debugging impossible when the abstraction leaks.
**Mainstream:** Use the managed service or tool; read the documentation for your use case.
**Their approach:** Know one layer below where you work. If you use Kubernetes, understand Linux namespaces and cgroups. If you use a managed database, understand the query planner. When abstractions leak — and they always do — this knowledge is the difference between hours and days of debugging.
**Example:** An engineer who understands that containers are Linux namespaces and cgroups can diagnose a container networking issue by inspecting `iptables` rules directly. An engineer who only knows Kubernetes abstractions cannot get below the layer that is failing.
