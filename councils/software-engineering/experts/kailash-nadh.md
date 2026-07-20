---
expert: Kailash Nadh (Indian)
council: SOFTWARE ENGINEERING
learnings: 50
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

---

## 26. Language Selection by Elimination, Not Fashion

**Problem:** Engineering teams adopt programming languages based on ecosystem trends, conference talks, or what comparable companies use — not on systematic evaluation against a specific problem.
**Mainstream:** Follow the industry toward what is popular, well-supported, and easy to hire for. Language choice is often defaulted, not decided.
**Their approach:** Evaluate languages against a specific, concrete technical requirement. In 2014, he evaluated Python, C++, Java, NodeJS, and Erlang for a specific problem — serving large numbers of concurrent WebSocket connections with low GC overhead. Each was ruled out on specific grounds. "Go here is a placeholder and it can be any technology that fits a job." The language was chosen by elimination and evaluation, not fashion.
**Example:** The single binary Go ticker that emerged from this evaluation now serves hundreds of thousands of concurrent WebSocket connections broadcasting millions of market quotes per second — a performance profile that no other evaluated language would have made straightforward.

---

## 27. The Triangle of Fulfilment: Intent Must Be Intrinsic

**Problem:** Engineers build open-source projects or internal tools motivated by external validation — recognition, compensation, career advancement — and abandon them when the external motivation fades.
**Mainstream:** Build what the market needs. Align personal projects with career advancement. Communities sustain what is worth sustaining.
**Their approach:** "The triangle of fulfilment" intersects three vertices: intent, skills, and resources. Intent is the special vertex: "It has to be intrinsic. It has to emanate from within... Nor can intent be developed via practice like skills can be." Neither the ubiquity of a problem nor market opportunity guarantees anyone will solve it well. Only intrinsic intent does.
**Example:** Mailing list managers are a ubiquitous need but perpetually underserved in FOSS. Listmonk was built because he personally exhausted every available option and could not accept throwing money at the problem as the first option. Intrinsic intent, not market gap analysis, created it.

---

## 28. Non-Technical "Tech Leaders" Are the Biggest Engineering Risk

**Problem:** Technology organizations place managers without current technical expertise in authority over technical decisions, creating systematic misalignment between technical reality and organizational direction.
**Mainstream:** Technical expertise and managerial authority are separable. Strong managers can lead technical teams without being technical themselves.
**Their approach:** "'Tech leaders' with no current hands-on experience or expertise in technology who hold the reins of tech teams, actively calling technical shots, have to be the biggest impediment to writing good software and building good tech teams. Far worse than technical incompetence, which at least in the right environment, can be addressed."
**Example:** "People who stopped being hands-on with technology decades ago, still making nuanced decisions on technical minutiae backed by nothing but ego and delusion of expertise — a total lack of self-awareness and a strong case of intellectual dishonesty." His prescription: "the leadership should be self-aware enough to trust, and delegate technical decision-making to hands-on technical people."

---

## 29. Comments Must Explain Why, Not What

**Problem:** Code comments describe what the code does — information the code itself already conveys — while the reasoning behind decisions is left undocumented and permanently lost.
**Mainstream:** Comment code for readability. Describe functions, loops, and operations so others can understand the implementation.
**Their approach:** "Writing comments that explain the intention of the developer, why something is being done in a program, is significantly more valuable than the comments that explain the what, which explicit, self-explanatory code will do anyway." Self-explanatory code makes "what" comments noise. "Why" comments are irreplaceable once the original author has moved on.
**Example:** A function that sorts trades by settlement date needs no comment saying "// sorts by settlement date." It needs a comment explaining why settlement date — not trade date — is the relevant sort key for the specific regulatory report downstream. That reasoning is invisible from the code.

---

## 30. User Engagement Is Usually User Entrapment

**Problem:** Product teams measure success through engagement metrics — time on platform, return visits, notification click rates — without questioning whether engagement represents genuine user value.
**Mainstream:** Maximize engagement. Engaged users are retained users. Retention drives revenue. All standard product metrics optimize toward more engagement.
**Their approach:** "The term user 'engagement' in software, more often than not, is a thinly veiled proxy for user entrapment." The two legitimate product principles: "Only do what is truly useful and meaningful to end users. Don't do unto others, what you don't want done unto you."
**Example:** Zerodha has never run re-engagement campaigns, never sent trading suggestion notifications, charges a fee to sign up (creating deliberate friction), and enables instant account closure. The Kill Switch — letting users lock themselves out of trading entirely — is the opposite of engagement optimization, and was built anyway because users asked for it.

---

## 31. FOSS Is Not Broken; the For-Profit Economic System Is

**Problem:** After incidents like log4j — critical infrastructure maintained by volunteers with no resources — the technology industry declared open source "broken" and proposed foundation models, corporate contributions, and paid maintainers as fixes.
**Mainstream:** FOSS needs to be professionalized. Community maintainer models cannot sustain critical infrastructure. The model is broken and needs reform.
**Their approach:** "FOSS as a system has certain fundamental freedoms at its core... This has worked beautifully to create today's thriving technological landscape." The problem is not FOSS: "For-profit corporations exist to maximise profits for their shareholders at any (generally legal) cost. Where is the spirit or goodwill to contribute to a resource that cost the corporation $0? Paying $X for things that cost $0 is fundamentally incompatible with the very nature of for-profit corporations. The system is broken, not FOSS."
**Example:** "I have never written FOSS in expectation of monetary returns, even when I was barely making a living. I did it because I liked it." FLOSS/fund is his structural answer — an explicit commitment of $1M/year from Zerodha as reciprocity from a for-profit that built its business on FOSS, not as charity.

---

## 32. Hire Hackers Who Tinker for Fun, Not Credentials

**Problem:** Technical hiring screens for institutional credentials, domain-specific experience, and familiarity with current industry tools — proxies that correlate poorly with engineering quality.
**Mainstream:** Hire from top colleges, prioritize relevant professional experience, assess familiarity with your tech stack.
**Their approach:** "I have only hired hackers — people who have tinkered around. If you want to be a good developer, embrace the hacker culture, build, break, and tinker things for fun." College affiliation is never asked for or tracked. Evidence of genuine curiosity expressed through things built outside of work obligations is the signal.
**Example:** "What colleges, neither do we ask, nor do we keep a track of." The interview is a simple real-world task of 100–300 lines. "From this really simple task, you can tell a lot: how someone structures classes, how someone writes their functions, how someone writes the readme. These are all flags."

---

## 33. Absurdism as an Engineering Decision Framework

**Problem:** Engineers defer to industry convention on technical and design decisions, treating the existence of a dominant pattern as validation of its correctness.
**Mainstream:** Follow established patterns. Industry convention reflects accumulated learning. Novel approaches require justification; convention does not.
**Their approach:** Absurdism as an operational philosophy: "It helps you overcome FOMO and it lets you disregard status quo completely sometimes... It's really about questioning everything and just arriving at decisions objectively. You have to operate within a framework of reason and ethics." Question the convention from first principles, then decide.
**Example:** Every trading platform in 2014 was black with 20×20 grids of flashing numbers. He rejected this: "It's not possible for a human being to process a 20 by 20 grid of flashing numbers that flash every second. It just makes no sense whatsoever." Kite launched white, with two columns — name and price. Everyone said it would not work. It became India's most used trading platform.

---

## 34. Bootstrapping Preserves Technical Integrity That External Capital Destroys

**Problem:** Funded engineering organizations face investor pressure to prioritize growth metrics, accumulating technical debt as speed is substituted for quality at every decision point.
**Mainstream:** Raise capital, grow fast, address technical debt later when revenue covers cleanup. Investors accept technical shortcuts when growth targets are met.
**Their approach:** "Let's say you are at 10 million in revenue this year. Why should you grow to 30 million to prove what to whom? Generally to investors, but we don't have any investors. This freedom of doing things with common sense, being grounded, doing things the right way, doing things slowly and sensibly, in no rush to become number one, has really shaped how we've built Zerodha."
**Example:** "This burn money, you know, fail fast — we just don't get it." Zerodha became India's largest brokerage on 30–33 engineers with zero external funding. "Nobody is forced to answer to investors. It's fun, it's like a hobby." The engineering quality that produced this outcome was only possible because no investor was setting growth targets that required shortcuts.

---

## 35. FOSS Reciprocity Is Common-Sense Business Strategy

**Problem:** Companies consume FOSS infrastructure extensively — Postgres, Linux, Redis, Kafka — but do not contribute funding, time, or code, leaving critical shared infrastructure chronically under-resourced.
**Mainstream:** FOSS is free. Budget for licences, not open-source contributions. Contributing to upstream is someone else's problem.
**Their approach:** "FLOSS/fund is about hacker goodwill, reciprocity, and common sense business strategy... Without the high-quality FOSS projects that we have freely downloaded and used to build our organisation, products, and services, we would not exist as we do today." This is not altruism — it is logical reciprocity from an organization built entirely on FOSS.
**Example:** Zerodha commits $1M/year through FLOSS/fund to FOSS projects. "When many startups have advertising and marketing budgets that often put public spending to shame, one would be hard-pressed to find a reason not to give a bit of money to the projects they depend on for their very existence."

---

## 36. Software Has Infinite Implementation Paths — This Is Why It Keeps Failing

**Problem:** The software industry treats major failures — widespread outages, security vulnerabilities, cascading dependencies — as fixable through better processes, tools, or regulation.
**Mainstream:** Improve testing, code review, deployment practices, and regulatory oversight. Add more safety layers. The discipline just needs more rigor.
**Their approach:** "Software as a technology and a discipline must probably be at the same point as the printing press was in the 16th century. It will be decades, if not centuries, before it is truly mastered." The structural problem: "How many ways are there to construct a bridge? Or to perform heart surgery? How many complex systems out there have infinite valid and practical ways of constructing, apart from software?" Infinite implementation paths combined with zero replication cost creates inevitable and structural failure — not a process failure.
**Example:** "Infinite possibilities of making subtle mistakes with unpredictable consequences exist." The specific failure modes he names — rampant centralization, proprietary walled gardens, forced digitization, data amassing that devalues privacy — are symptoms of a civilization-level discipline that is not yet mature enough to reliably govern its own consequences.

---

## 37. After LLMs: Articulation Is Now More Valuable Than Execution

**Problem:** Technical execution — writing code — has historically been the scarce, valued skill in software development. The constraint was "can I write this?"
**Mainstream:** Strong engineers produce good code quickly. Value is measured in implementation speed and code output quality. Code is the primary artifact.
**Their approach:** "Software development, as it has been done for decades, is over." LLMs have eliminated the physiological and cognitive cost of translating plans into code. "For the first time ever, good talk is exponentially more valuable than good code." The inversion of the Torvalds dictum: from "Talk is cheap. Show me the code" to "Code is cheap. Show me the talk."
**Example:** "An experienced developer who can talk well — that is, imagine, articulate, define problem statements, architect and engineer — has a massive advantage over someone who cannot, more disproportionately than ever." The constraint has shifted from "can I write this?" to "can I correctly specify this, verify the output, and architect what I cannot yet see?"

---

## 38. Deconstruct From the Crux, Not From Available Tools

**Problem:** Engineers reach for frameworks, platforms, and toolchains first, then reverse-engineer the problem statement to justify the chosen stack.
**Mainstream:** Start with what you know. Choose familiar tools and adapt the approach to them. Stack familiarity reduces risk.
**Their approach:** "When there is a requirement to build a website, the first response should not be 'let's use Jamstack! and Tailwind! and GitHub actions! and Netlify!' It should be along the lines of 'Why? What is it for?'" Deconstruct from the crux of the actual requirement outward, adding tools (peels of the onion) only when they solve a specific identified problem.
**Example:** His Olam Malayalam dictionary has run on the same scripts and database for 12 years, serving millions of users — no framework upgrade nightmares, no dependency chain failures. The crux (language lookup) determined the architecture (simple scripts + simple database), not the tooling landscape at the time of building.

---

## 39. Async DNA Cannot Be Retrofitted Into Synchronous Organizations

**Problem:** Organizations attempt to shift to remote-first work by moving communication from in-person to online equivalents — meetings to Zoom, whiteboards to Miro, stand-ups to Slack — treating remote as a delivery medium for the same synchronous culture.
**Mainstream:** Remote is the same work, different medium. Move the collaboration tools online and the organization follows.
**Their approach:** "Effective, long term remote work requires specific skill sets and DNA to pull off." Zerodha experienced strong war-time productivity in remote year one, visible erosion in year two, and genuine detriment in year three — as synchronous communication patterns proved incompatible with asynchronous infrastructure.
**Example:** "As communication became increasingly task-oriented, terse, and transactional... as spontaneity became rare... a part of me burnt out." After returning to hybrid mode, approximately 90% of the team reported doing well mentally versus 80% not being in a good place the prior year. "Breakthroughs stemming from spontaneous ideas and overheard conversations... returned." The DNA was synchronous and could not be retrofitted.

---

## 40. India's FOSS Paradox: Massive Developer Pool, Minimal FOSS Creation

**Problem:** India's enormous developer population contributes disproportionately to consuming and deploying FOSS but produces almost no significant FOSS projects in return.
**Mainstream:** India is a global software power — this will self-correct over time as the ecosystem matures.
**Their approach:** "Despite having one of the largest developer pools in the world, one that represents a significant percentage of active traffic on global developer portals such as GitHub and StackOverflow, one would be hard pressed to name even a handful of significant FOSS projects that have originated in India. We seem to have fostered a culture of consuming FOSS technology and turning it into numerical valuations instead of creating sustainable value for society."
**Example:** "If we genuinely want to see a technologically Atmanirbhar India with abundant local expertise, capacity, and innovation — a society that not just consumes, but produces high quality technology for itself and the world — as an industry, we ought to begin by publicly acknowledging the importance of FOSS in our enterprises, followed by investing time, effort, and resources into it."

---

## 41. The Hundred-Line Interview Task Reveals Architecture Thinking

**Problem:** Technical interviews rely on algorithmic puzzles, whiteboard exercises, or domain-specific questions that reveal problem-solving under artificial conditions unrelated to the actual work.
**Mainstream:** Ask data structures and algorithms questions. Use take-home projects with defined specifications. Assess domain knowledge directly.
**Their approach:** Give a simple, real-world task of 100–300 lines: fetch a zip file over HTTP, extract a CSV, process it in a specified way. The task itself is trivial. What it reveals is not: how the candidate structures classes, writes functions, names things, and writes a README. "These are all flags."
**Example:** A candidate who writes clean, readable function signatures and a helpful README on a "trivial" task demonstrates architecture thinking that no algorithmic puzzle would surface. A candidate who writes the entire task as a single function with five parameters exposes a different thinking style — one that scales badly as complexity grows.

---

## 42. Reject Industry Visual Convention When It Defies Human Cognition

**Problem:** Product design follows category conventions, treating existing interface patterns as validated user experience rather than inherited habits that were never rigorously questioned.
**Mainstream:** Follow category conventions. Users expect interfaces that resemble competitors. Diverging from convention creates friction and reduces trust.
**Their approach:** Apply first-principles reasoning to UI: "It's not possible for a human being to process a 20 by 20 grid of flashing numbers that flash every second. It just makes no sense whatsoever." If the dominant convention defies how human cognition actually functions, reject the convention rather than conform to it.
**Example:** Every trading platform in 2014 was black with dense grids of flashing data. Kite launched white, with minimal columns. Every competitor said it would not work. Users who had never traded before could use Kite without training — and it became India's most used trading platform. The convention had been inherited, not validated.

---

## 43. Empathy Outweighs Raw Engineering Skill in Team Composition

**Problem:** Engineering teams are built by optimizing for individual technical capability, then managing the interpersonal friction that results as a separate organizational problem.
**Mainstream:** Hire the strongest engineers available. Culture and collaboration can be developed separately after the team is assembled.
**Their approach:** "If there is someone who's supremely skilled, like a 100x programmer, but if they can't work well with the rest of the team, that's a no-go." Technical skill is table stakes. Empathy — the ability to understand colleagues, communicate clearly, give and receive feedback — is the multiplier that determines whether a team compounds or cancels out its individual capabilities.
**Example:** A 100x engineer who cannot collaborate effectively creates negative leverage across a team of 33: every communication failure, every blocked decision, every morale drain reduces the output of everyone around them. The "team API" determines aggregate throughput more than any individual's raw ability.

---

## 44. Burnout Comes From Communication Failure, Not Technical Overload

**Problem:** Engineering burnout is attributed to overwork, excessive feature pressure, or technical complexity — and addressed through workload reduction, headcount additions, or protected engineering time.
**Mainstream:** Burnout is a workload problem. Reduce scope, add engineers, protect focus time.
**Their approach:** His personal burnout during Zerodha's remote period came not from the technical work itself but "from donning the hat of a counsellor" — trying to repair the communication and connection gaps created by flattened asynchronous interaction. When communication infrastructure degrades, the emotional labor of maintaining human cohesion falls on specific individuals.
**Example:** "As fun, lively voices and banter faded into silence of matter-of-fact chat rooms and soulless scheduled video calls with pixelated faces... a part of me burnt out." The technical workload was unchanged. The communication infrastructure had degraded and the cost of patching it was personal and disproportionate.

---

## 45. Build Only Features You Would Want as a User Yourself

**Problem:** Product teams build features to maximize retention, engagement, or monetization metrics without considering whether those features are genuinely beneficial to the people using them.
**Mainstream:** Use data to drive feature decisions. A/B test for engagement. Build what metrics show users respond to. Product-market fit validates the feature.
**Their approach:** The ethical test for every feature: "Would I want this for myself as a user?" Only build features that pass this test. "Only do what is truly useful and meaningful to end users. Don't do unto others, what you don't want done unto you."
**Example:** The Kill Switch — allowing users to lock themselves out of trading entirely — inverts every engagement metric Zerodha could optimize for. They built it because traders asked for it. The feature acknowledges that trading platforms can enable harmful behavior and that a responsible product gives users direct control over their own behavior.

---

## 46. Machine-Readable FOSS Funding Manifests as Infrastructure for Sustainability

**Problem:** FOSS projects that need funding have no standard way to signal that need. Funders who want to contribute have no standard way to discover who needs support. The matching problem is solved by awkward personal emails and reputation networks.
**Mainstream:** Maintainers add GitHub Sponsors buttons, post on social media, reach out via email. Funders assess projects through reputation and personal networks.
**Their approach:** A machine-readable `funding.json` manifest file — analogous to `robots.txt` or `package.json` — that FOSS projects embed in their repositories to declare funding needs, entity details, and project context. "This process of arriving at numbers over personal e-mails is awkward for both parties." Infrastructure for funding discovery changes the systemic economics of FOSS support.
**Example:** FLOSS/fund built tooling to crawl `funding.json` manifests across the FOSS ecosystem, enabling automated discovery of underfunded projects. The manifest standard is proposed as a universal spec — not Zerodha-specific — so any funder and any project can participate without the current social overhead.

---

## 47. LLMs Risk Robbing Junior Developers of Foundational Expertise

**Problem:** Junior developers who use LLMs to write code skip the cognitive process of acquiring deep programming intuition built through error, iteration, and debugging.
**Mainstream:** LLMs raise the floor for all developers. Juniors can be more productive earlier. Foundational understanding can be built alongside AI assistance.
**Their approach:** "The real concern is for generations of learners who are being robbed of the opportunity to acquire the expertise to objectively discern what is slop and what is not." LLMs make execution cheap — but without foundational depth, developers cannot evaluate LLM output, catch structural mistakes, or architect systems that require understanding beyond the immediate task.
**Example:** A junior developer who uses LLMs to ship code without understanding database indexing, connection pooling, or serialization costs cannot recognize when the LLM has produced something subtly wrong. At production scale, subtly wrong is the most dangerous category of wrong — it passes review, ships, and fails in ways that are difficult to diagnose.

---

## 48. Set the Expectation Upfront That Most Engineering Work Is Boring

**Problem:** Technical hiring materials and onboarding emphasize interesting problems, novel challenges, and opportunities for innovation — setting expectations that collide with the reality of day-to-day engineering work.
**Mainstream:** Sell the role. Emphasize interesting technical challenges. Top engineers expect difficult and stimulating work.
**Their approach:** "I tell people that most of the time you'll be doing really boring stuff, you know, processing CSVs." Set the correct expectation before the hire. People who join expecting complex engineering problems and find CSV processing will leave. People who are told it is mostly CSV processing and stay are the right hire for a team that values reliability over novelty.
**Example:** Zerodha's engineering team of 30–33 people runs India's largest brokerage because those engineers are oriented to find clarity and professionalism in unglamorous work. "Boring is generally battle-tested and well-understood sans novelty." Hiring people who want boring pays compounding returns.

---

## 49. Code Reviews Cross Team and Project Boundaries

**Problem:** Code reviews are treated as a gatekeeping function within the project team — the author and the team's senior engineer. Cross-functional participation is seen as overhead for reviewers without domain context.
**Mainstream:** Code review within teams. Domain experts review domain-specific code. Outsiders lack the context to add value.
**Their approach:** At Zerodha, code review sessions are open to anyone in the company regardless of their primary project. "These code review sessions where anyone in the team can participate irrespective of their primary projects help us keep ourselves in check." An outsider to the project who asks "why is this so complicated?" surfaces legitimate design debt that domain familiarity has normalized.
**Example:** A cross-team reviewer unfamiliar with trading platform internals who cannot follow what a function does without a comment is surfacing exactly the right signal. Their unfamiliarity is not a limitation — it is the perspective that catches what domain experts have stopped seeing.

---

## 50. Engineering Frugality Compounds Into Organizational Independence

**Problem:** Engineering teams treat infrastructure costs as an expense to optimize at specific intervals — migration projects, re-architecture cycles — rather than as a compounding advantage.
**Mainstream:** Optimize costs when they become painful. Managed services are worth the premium for operational simplicity. Spend engineering time on product, not infrastructure.
**Their approach:** "One of the reasons Zerodha is a profitable, low-cost but high-margin business and we've never had to raise funds is because of these early decisions. Because of the frugality component that we incorporated into all our tech and product decisions." Engineering frugality is not cost-cutting — it is the accumulation of independent decisions that collectively determine whether an organization needs external capital to survive.
**Example:** Self-hosting a support ticketing system costs under $10,000/year for 1,000+ users; equivalent SaaS costs over $1M/year. Multiplied across Postgres, Redis, Kafka, GitLab, Grafana, Sentry, and mail servers — the compounded difference funds years of engineering salaries without a single rupee of external investment. The frugality is the moat.
