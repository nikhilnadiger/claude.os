---
expert: Kailash Nadh (Indian)
council: SOFTWARE ENGINEERING
learnings: 25
---

# Kailash Nadh (Indian) — Full Learnings

## 1. Simple Scales. Complex Breaks.

**Problem:** Teams equate complexity with sophistication. Over-engineer early thinking it prepares them for scale.
**Mainstream:** Adopt Kubernetes, microservices, distributed systems from the start. Design for Google-scale.
**Their approach:** Start simple. Add complexity only when a concrete, rational reason demands it — not a vague idea of future scale. Simple systems are easier to debug, cheaper to run, and faster to iterate on.
**Example:** Zerodha ran India's largest stock broker for years on simple infrastructure before adopting K8s — and only adopted it to make deployments uniform, not for performance.

---

## 2. Boring > Cool. Always.

**Problem:** Engineers chase new technologies for credibility or FOMO, not because the technology solves a real problem.
**Mainstream:** Adopt the latest framework, tool, or paradigm to appear advanced and attract talent.
**Their approach:** Boring is battle-tested and well-understood. New technology solves specific organisational problems — not generic technical ones. The cost of novelty is real.
**Example:** Zerodha's stack is Go, Postgres, Redis, Kafka, Nginx — none of it flashy, all of it deeply reliable and operationally understood by the team.

---

## 3. The Bottleneck Is Almost Always the Database

**Problem:** Developers micro-optimise application code — data structures, string handling, function calls — while the actual bottleneck sits in the database.
**Mainstream:** Profile the application layer. Add more app servers. Blame the framework.
**Their approach:** Exhaust all database optimisations first: schema design, indexing, query planning, DB configuration. Only then look elsewhere. An SQL EXPLAIN is always the starting point.
**Example:** A web framework capable of 500k req/s connected to a DB handling 1000 queries/s is a 1000 req/s system. Every other optimisation is noise until the DB is fixed.

---

## 4. RDBMS Handles Almost Every Business Problem. Default to It.

**Problem:** Teams reach for NoSQL, distributed stores, or specialised databases prematurely, sacrificing ACID guarantees for scale they may never need.
**Mainstream:** Pick a "web-scale" database early. MongoDB, Cassandra, DynamoDB for growth readiness.
**Their approach:** A Postgres node with one replica, proper indexes, and logical partitions holds hundreds of billions of rows and terabytes of data with strong performance. Default to RDBMS. Migrate only when you've genuinely hit its limits.
**Example:** Zerodha runs hundreds of billions of investment records on self-managed Postgres. They haven't needed to abandon it.

---

## 5. ORMs Are a Trap at Scale. Learn SQL Instead.

**Problem:** ORMs abstract away SQL but generate sub-optimal queries, hide performance problems, and create painful lock-ins as usage grows complex.
**Mainstream:** Use an ORM for developer productivity. Avoid premature optimisation.
**Their approach:** Learn SQL. Move business logic into the database where it belongs. ORMs force you to either accept bad queries or contort the ORM to produce good ones. Neither is worth it.
**Example:** Zerodha uses raw parameterised SQL (pg Pool) across their NestJS services — no TypeORM, no Sequelize. Queries are explicit, readable, and optimisable.

---

## 6. Minimise Networked Dependencies. Microservices Are Self-Inflicted Pain.

**Problem:** Microservice architectures compound failures through network complexity: retries, timeouts, service discovery, packet drops, serialisation overhead.
**Mainstream:** Build a service per domain. Use a service mesh for orchestration. Isolate concerns.
**Their approach:** As few services and networked interactions as possible, especially on hot paths. Every new networked dependency is a new category of failure. Have a concrete reason before adding one.
**Example:** Zerodha deliberately avoided microservice meshes. "Micro-service hells" are described as a form of self-inflicted penance — complex by accident, not necessity.

---

## 7. Latency Consistency Is the Only Scaling Metric That Matters

**Problem:** Systems optimise for peak throughput but ignore latency variance. Unpredictable response times make capacity planning impossible.
**Mainstream:** Benchmark for max requests per second. Add capacity when peak is hit.
**Their approach:** Consistent latency is what enables scale. If a service sometimes takes 1s and sometimes takes 5s, you cannot build reliable capacity around it. Engineer for consistency first.
**Example:** Zerodha maintains a 40ms client-side roundtrip latency baseline for Kite. Any fluctuation from this triggers investigation — not just alerting.

---

## 8. Cache Aggressively. Dumb Caches Are Best.

**Problem:** Expensive DB queries and computations repeatedly hit the hot path on every request, even when underlying data rarely changes.
**Mainstream:** Add Redis for frequently queried data. Keep cache logic smart — aware of data structure and semantics.
**Their approach:** Cache everything feasible. The best cache is a dumb one: bytes in, bytes out, no parsing or reconstruction. Caching even for a few seconds makes a measurable difference.
**Example:** Every bit of data on Kite — orders, positions, portfolio — is served from hot Redis cache as pre-serialised byte blobs. O(1) lookup, bytes dumped directly to HTTP response. No JSON parsing on the hot path.

---

## 9. Scaling Starts From Good Code, Not Infrastructure

**Problem:** Teams reach for infra solutions — more servers, K8s, CDNs — before fixing the application code causing the bottleneck.
**Mainstream:** Scale horizontally when traffic grows. Cloud-native elasticity handles it.
**Their approach:** Optimise the application first. A well-written service handles the same load as a poorly-written one at a fraction of the resource cost. Scale vertically before going horizontal.
**Example:** A poorly-written Python service at $100/month handling 1000 req/s. A well-written one at $25/month handling the same. Same numbers, fundamentally different systems.

---

## 10. Always Pool Connections. More Connections ≠ More Throughput.

**Problem:** Teams set high connection limits hoping for better throughput. This wastes resources and overloads upstream services instead of improving performance.
**Mainstream:** Increase connection pool size when services slow down. More connections = more parallelism.
**Their approach:** A database with 10 concurrent workers processes 10 queries/sec regardless of how many connections are open. The rest are resource hogs. Pool and right-size based on measured latency and throughput — not instinct.
**Example:** Zerodha handles hundreds of thousands of req/s using a few hundred keep-alive connections in a pool — not thousands. When upstream latency spikes, pools overload and cascade. The fix is fixing upstream, not adding connections.

---

## 11. HTTP APIs Should Use E-Tags for Client-Side Caching

**Problem:** APIs return full responses on every request even when the underlying data hasn't changed, wasting bandwidth — especially on mobile networks.
**Mainstream:** Return full response on every GET. Let the client decide whether data changed.
**Their approach:** Send E-Tags with all HTTP API responses. Client caches the response and sends the E-Tag back. If data hasn't changed, server returns 304 with no body. Works for JSON APIs exactly as it does for static assets.
**Example:** Zerodha sends E-Tags with all Kite API responses. This saves terabytes of bandwidth monthly with significant speed improvements, especially for mobile users on 3G/4G.

---

## 12. Serialisation Is Expensive at Scale. Don't Ignore It.

**Problem:** JSON serialisation looks trivial in isolation but becomes a real CPU and garbage collection bottleneck at high throughput.
**Mainstream:** `json.dumps(data)` and move on. The GC handles cleanup.
**Their approach:** On hot paths, be conscious of serialisation cost. In GC languages, large payloads generate significant garbage. Prefer pre-serialised byte blobs in cache. Minimise payload size where possible.
**Example:** Kite's Redis cache stores pre-serialised byte blobs. The hot path reads bytes and dumps them directly to the HTTP connection — no deserialisation, no re-serialisation, no GC pressure.

---

## 13. Memory Allocation on Hot Paths Kills Performance in GC Languages

**Problem:** Frequent allocations on hot paths generate GC pressure, causing stop-the-world pauses and global slowdowns that aren't obviously attributed to allocation.
**Mainstream:** Let the GC handle it. Modern runtimes are well-optimised.
**Their approach:** On hot paths: allocate as little as possible, reuse byte buffers, avoid unnecessary byte-string conversions and heap escapes. Know your GC's behaviour before assuming it's not the problem.
**Example:** Zerodha's high-throughput Go services are designed to be IO-bound rather than memory-bound, structurally minimising GC pressure from the start.

---

## 14. Use the Right Technology for the Job. Some Languages Are Genuinely Slow.

**Problem:** Teams pick a language for familiarity or team preference, then fight it endlessly trying to hit performance targets it isn't designed for.
**Mainstream:** Optimise what you have. Rewriting is expensive. Language choice is premature optimisation.
**Their approach:** Evaluate objectively. If a language is slow by design, no amount of optimisation makes it right for high-throughput, low-latency services. Picking the right tool early — even if it means learning something new — pays back compoundly.
**Example:** Kailash evaluated Python, C++, Java, NodeJS, and Erlang before choosing Go for Zerodha's WebSocket ticker in 2014. That single binary now serves hundreds of thousands of concurrent connections broadcasting millions of market quotes per second.

---

## 15. Scale Vertically Before Scaling Horizontally

**Problem:** Teams jump to horizontal scaling (more nodes, load balancers, service meshes) prematurely, adding significant networking complexity for gains achievable with better code or a bigger machine.
**Mainstream:** Design for horizontal scaling from day one. Cloud-native means stateless and horizontally elastic.
**Their approach:** Optimise the application. Then scale vertically. Only go horizontal when vertical is genuinely exhausted — because every horizontal hop adds networking pain that has to be managed forever.
**Example:** "Industry-leading enterprise-grade" applications needing 128 CPUs and 512 GB RAM to service 2000 req/s are scaling "enterprisely" — not sensibly.

---

## 16. Clever Code Is an Anti-Pattern. Dumb, Explicit Code Is Future-Proof.

**Problem:** Developers write clever one-liners, deep abstractions, and multi-layered magic that they themselves cannot parse weeks later.
**Mainstream:** DRY, abstraction, elegance. Complex code signals engineering sophistication.
**Their approach:** Simple, almost dumb, explicit code. Comments explain why, not what. Code should be parseable by the original author months later at 11pm under production pressure.
**Example:** Zerodha's code reviews explicitly flag "clever code" even when it's functionally correct. Readability and maintainability are treated as hard requirements, not nice-to-haves.

---

## 17. Technical Debt Compounds. Address It Proactively, Even at Feature Cost.

**Problem:** Teams defer technical debt indefinitely. It accumulates silently until the cost of fixing it exceeds the cost of starting over.
**Mainstream:** Ship features. Clean up later. Technical debt is the price of velocity.
**Their approach:** Regular debt clearance cycles, even at the cost of pausing new development. Cleaner software has higher odds of being future-ready. The older the debt, the harder it is to service.
**Example:** Zerodha has scrapped and rewritten Kite (backend, frontend, mobile) multiple times, Console from scratch, and the ticker 5+ times — all planned proactively, not forced by failure.

---

## 18. Slow Down to Speed Up. Feature Freezes Pay Off.

**Problem:** Constant shipping creates compounding technical debt that eventually slows everything. Teams feel they cannot stop.
**Mainstream:** Ship continuously. Technical debt is refinanced by future velocity.
**Their approach:** Periodically pause new development to clean up existing systems. The resulting codebase enables faster iteration, higher feature throughput, and significantly lower risk in the long term.
**Example:** Zerodha regularly delays features by weeks or even months to refactor. This approach has enabled them to ship faster than industry counterparts who never stopped.

---

## 19. Software Estimation Is Structurally Wrong. Build In Slack Explicitly.

**Problem:** Estimates are almost always wrong. Teams commit to them anyway, creating delivery pressure that compounds into rushed, buggy code.
**Mainstream:** Estimate carefully. Add a buffer. Commit to the date.
**Their approach:** Writing code is a fraction of total time. Figuring out what to write, navigating dependencies, and handling unexpected side effects dominate. Factor this in structurally — not as an apology after the fact.
**Example:** A "trivial change" Kailash estimated at a few hours took four days in production due to subtle edge cases across multiple interdependent systems he couldn't foresee upfront.

---

## 20. Self-Host FOSS. It Is the Most Underrated Engineering and Cost Moat.

**Problem:** Teams outsource everything to managed SaaS. Costs balloon. Vendor lock-in makes change expensive. Compliance becomes a fire drill.
**Mainstream:** Use managed services. Don't maintain infrastructure. Focus on product.
**Their approach:** Self-host battle-tested FOSS. Full control, dramatically lower costs, no vendor lock-in. When regulations change or systems need replacing, you can move fast because you own the stack.
**Example:** Zerodha self-hosts Postgres, Redis, Kafka, GitLab, Grafana, Sentry, Discourse, CRM, support ticketing, mail servers. Their IT costs are negligible relative to operation size. Their SEBI compliance setup was ready on day one because they owned and understood every layer.

---

## 21. Stable Interfaces Are Worth More Than Clean Internals

**Problem:** Internal APIs receive less design attention than public ones, accumulating inconsistencies that become expensive to unwind as systems grow.
**Mainstream:** Public APIs get design care. Internal APIs are plumbing — iterate freely.
**Their approach:** Design internal interfaces with the same rigour as public APIs. When internals must be rewritten, a stable interface means only one system changes at a time. Separation of concerns is only real when the interface is stable.
**Example:** Kite Connect started as an internal API wrapper over a messy vendor SOAP API. Because the interface was designed cleanly, it accidentally became Zerodha's B2B platform and a profitable vertical — without changing the interface.

---

## 22. Connect Systems by Disconnecting Them. PubSub Over API Mesh.

**Problem:** Systems wired together via direct API calls create brittle, tangled dependencies. One change ripples everywhere. Removing a system breaks others.
**Mainstream:** Build APIs between services. Handle retries, failures, and versioning per integration.
**Their approach:** Use a message bus. Source-of-truth systems publish events on standard topics. Consumers subscribe and do what they need. Systems don't know about each other. Removing one causes zero disruption to the rest.
**Example:** Zerodha's Kafka bus connects CRM, trading platform, mailing list, and HR systems — none directly wired. When a user deactivates their account, the mailing list unsubscribe happens instantly with zero custom integration code.

---

## 23. Computing Concepts Change Slowly. Implementations Change Fast. Bet on Concepts.

**Problem:** Teams build on fashionable frameworks and paradigms that age quickly, forcing rewrites as the ecosystem moves on.
**Mainstream:** Use the latest framework and paradigm. Staying current is staying relevant.
**Their approach:** Understand the underlying computing concepts: CRUD, stateless services, API design, message queues, relational data modelling. These rarely change. Their specific implementations do. Evaluate new tech against whether the concept is actually new — or just re-packaged.
**Example:** Server-side HTML rendering, stateless "functions", RDBMS — all old concepts currently back in fashion. Kailash's bet on Flutter in 2018 (alpha) was grounded in understanding the concept, not the hype.

---

## 24. Pragmatism Over Perfection. Ship When Good Enough, Not When Done.

**Problem:** Developers chase a "perfect" state that never arrives. In fast-changing or regulated environments, this delays everything and still doesn't prevent breakage.
**Mainstream:** Ship when done. Done means complete and polished.
**Their approach:** Develop the intuition for when something is good enough by all practical means. Build, observe, iterate. Chasing perfection in rapidly changing environments is often a fool's errand.
**Example:** SEBI required Zerodha to completely rebuild the equities-selling flow in four weeks — cascading changes across web, two mobile platforms, and external systems. Pragmatism was not a choice; it was the only option. And it shipped.

---

## 25. Don't Just Fix What's Broken. Fix What Might Soon Break.

**Problem:** Teams only address failures reactively. Proactive rewrites feel risky, unjustifiable to management, and are perpetually deferred.
**Mainstream:** If it ain't broke, don't fix it. Rewrite only when forced.
**Their approach:** When code smell or impending performance bottlenecks are detected, assess criticality and rewrite proactively — before the system breaks in production under pressure.
**Example:** Zerodha's real-time market data ticker has been refactored and rewritten at least five times in six years, each time before the bottleneck materialised. Its streaming technology evolved from custom TCP → ZeroMQ → Nanomsg → NATS — all planned moves, never emergency ones.
