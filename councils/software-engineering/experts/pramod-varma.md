---
expert: Pramod Varma (Indian)
council: SOFTWARE ENGINEERING
learnings: 50
---

# Pramod Varma (Indian) — Full Learnings

## 1. Protocols Over Platforms

**Problem:** Centralized platforms become bottlenecks. Fragile, controlling.
**Mainstream:** Build all-in-one platform. Vertical integration.
**Their approach:** Design open protocols instead of proprietary platforms. Protocol: thin layer, interoperable, decentralized.
**Example:** Beckn Protocol: not an app, but HTTP for commerce. Any app can plug in. Infinite permutations.

## 2. Unbundling Through APIs

**Problem:** Monolithic systems can't adapt. Lock-in vendor.
**Mainstream:** Full-stack proprietary solution. Everything in-house.
**Their approach:** Unbundle functionality into modular APIs. Third parties build on your API. You control protocol, not the ecosystem.
**Example:** Instead of building delivery app, provide order API. Others build logistics. You orchestrate.

## 3. Scalability Starts With Architecture

**Problem:** System designed for 1M users. Doesn't scale to 100M.
**Mainstream:** Optimize performance gradually. Rewrite when needed.
**Their approach:** Architecture for scale from day one. Stateless services, distributed systems, no single points of failure.
**Example:** Every component designed to be distributed. Add nodes, not redesign.

## 4. Standards as Infrastructure

**Problem:** Every vendor has different format. Incompatibility.
**Mainstream:** Build proprietary standard. Network effect locks customers.
**Their approach:** Adopt open standards. Interoperability over lock-in. Your value is in the service, not the standard.
**Example:** Use HTTP, JSON, REST. Not proprietary protocol. Easier integration means more partners.

## 5. The Thin Layer Philosophy

**Problem:** Government builds complex systems. Slow, brittle, can't evolve.
**Mainstream:** Government owns entire solution.
**Their approach:** Government provides only the thin layer: identity, authenticity, basic infrastructure. Private sector builds on top.
**Example:** Aadhaar: thin identity layer. Millions of services built on top. Unbundling works.

## 6. Decentralization Requires Design

**Problem:** Decentralized systems seem chaotic. Hard to govern.
**Mainstream:** Centralize to control quality.
**Their approach:** Decentralization requires better design: clear protocols, incentives, governance. Hard upfront, powerful long-term.
**Example:** GATT protocol enables global trade without central authority. Design of protocol enables decentralization.

## 7. API-First Thinking

**Problem:** Build product, then expose API. API is afterthought.
**Mainstream:** Product is primary. API is convenience.
**Their approach:** Design API first. Entire product built on your own API. Forces good design.
**Example:** Your team uses public API for product development. If API is bad, you know immediately.

## 8. Interoperability Over Integration

**Problem:** Systems need to integrate. Custom bridges break constantly.
**Mainstream:** Build integrations. Hire integration team.
**Their approach:** Design systems to be interoperable. Standard data formats, standard protocols. No custom bridges.
**Example:** If two systems use same protocol, they work together without custom integration.

## 9. The Public Utility Model

**Problem:** Private monopolies own critical infrastructure. Exploit customers.
**Mainstream:** Sell service to customers. Maximize lock-in.
**Their approach:** Position as public utility: open, interoperable, regulated, fair. Better long-term business.
**Example:** Payment system: treat as utility. Open access. Everyone wins. More transaction volume.

## 10. Network Effects Through Openness

**Problem:** Network effects require lock-in. Closed ecosystem.
**Mainstream:** Proprietary network. Control user switching.
**Their approach:** Network effects through openness: bigger network means more possibilities. Open = faster growth.
**Example:** Open identity system: more organizations participate, more valuable for everyone.

## 11. Design Space Before Implementation

**Problem:** Engineers code features without understanding system design.
**Mainstream:** Code and figure it out.
**Their approach:** Before any code, design the protocol: what are the primitives? What are the rules?
**Example:** Before building delivery system, design the protocol: order format, fulfillment steps, exceptions.

## 12. Technology Neutrality

**Problem:** System locked to specific technology. Becomes obsolete.
**Mainstream:** Choose best technology today.
**Their approach:** Protocol/standard independent of technology. Implementations can change. Protocol endures.
**Example:** HTTP works with any underlying transport. Originally TCP, now HTTP/2, HTTP/3. Protocol unchanged.

## 13. The Role of Standards Bodies

**Problem:** Standards created by one company. No buy-in.
**Mainstream:** Company leads standard development.
**Their approach:** Multi-stakeholder standards bodies. Competitors collaborate on standards. Competition on implementation.
**Example:** FIDO2 standard: competing security companies collaborated. Now industry standard.

## 14. Backwards Compatibility as Design

**Problem:** New versions break old systems. Upgrade required.
**Mainstream:** Version. Force upgrades.
**Their approach:** Protocol designed for backwards compatibility. New versions layer on top. Old clients still work.
**Example:** HTTP/1.1 and HTTP/2 can coexist. Clients don't need to upgrade.

## 15. Simplicity Enables Adoption

**Problem:** Complex standard. Few vendors implement.
**Mainstream:** Comprehensive standard covers everything.
**Their approach:** Start simple. Add complexity only when necessary. Simple to implement = faster adoption.
**Example:** REST simpler than SOAP. More adoption. Better ecosystem.

## 16. The API Economy Thinking

**Problem:** Value locked in proprietary systems. Hard to extract.
**Mainstream:** Keep value in proprietary platform.
**Their approach:** Enable others to build value on your APIs. You monetize ecosystem, not just product.
**Example:** Provide identity API. Others build on it. You get transaction fees. Better business model.

## 17. Governance at Scale

**Problem:** Decentralized system needs governance. Who decides?
**Mainstream:** Central authority decides.
**Their approach:** Distributed governance: stakeholders participate, standards bodies govern. Balance central direction and decentralization.
**Example:** ICANN governs internet domains. Multiple stakeholders. Not perfect but works.

## 18. Data Portability as Feature

**Problem:** Vendor lock-in through data. User trapped.
**Mainstream:** Keep user data proprietary.
**Their approach:** Design system where users can export data, switch vendors. Data portability is feature.
**Example:** User can export all data to CSV. Switch to competitor anytime. Forces you to compete on service.

## 19. The Modularity Imperative

**Problem:** Monolithic systems can't adapt. Everything breaks together.
**Mainstream:** Build cohesive whole.
**Their approach:** Everything modular. APIs between modules. Modules can be swapped, upgraded independently.
**Example:** Payment module replaceable. Logistics module replaceable. System still works.

## 20. Evolution Through Versioning

**Problem:** System changes break everything. Fragile.
**Mainstream:** Version carefully. Deprecated things are painful.
**Their approach:** Version APIs and protocols. Multiple versions can coexist. Clients upgrade at own pace.
**Example:** API v1 and v2 both live. Old clients use v1. New clients use v2.

## 21. The Cost of Proprietary

**Problem:** Proprietary systems seem cheaper. Hidden costs.
**Mainstream:** Build proprietary. Own everything.
**Their approach:** Calculate total cost of proprietary: development, integration, maintenance, lock-in. Often more expensive.
**Example:** Proprietary format: engineer cost to integrate with every vendor. Open standard: zero integration cost.

## 22. Design for Developers

**Problem:** APIs hard to use. Developers hate your product.
**Mainstream:** API is technical. Developers figure it out.
**Their approach:** API design as important as product design. Developer experience is customer experience.
**Example:** Stripe success: beautiful API design. Developers want to build with Stripe.

## 23. Standards Breed Competition

**Problem:** Standard limits differentiation. Everyone same.
**Mainstream:** Proprietary advantage.
**Their approach:** Standards enable competition: competitors on features, not on lock-in. Healthier market.
**Example:** HTTP standard. Competing browsers. Competition on features, not protocol.

## 24. Ecosystem Thinking

**Problem:** Success of platform depends only on you.
**Mainstream:** Build everything yourself.
**Their approach:** Success depends on ecosystem. Enable partners. Bigger ecosystem = bigger success for everyone.
**Example:** AWS success: not about AWS services, but about partners building on AWS.

## 25. The Long Game

**Problem:** Proprietary works in short-term. Fails long-term.
**Mainstream:** Maximize quarterly revenue.
**Their approach:** Open, interoperable systems win long-term. Short-term costs, long-term dominance.
**Example:** Google Maps: closed. OpenStreetMap: open. OpenStreetMap growing as more data contributed.

## 26. If It Can't Be Reused, It's Not DPI

**Problem:** Governments digitize services but create siloed platforms that serve only one purpose or one agency, calling the result infrastructure.
**Mainstream:** Build a comprehensive digital service per government function. Each ministry owns its solution.
**Their approach:** The one-line test for Digital Public Infrastructure: "If it can't be reused by others, it's not DPI." DPI must be formally defined as technology building blocks powered by open standards, enabling rules, and participatory governance — with reusability as the non-negotiable criterion.
**Example:** Aadhaar authentication is DPI — every ministry, bank, and app can reuse it. A government e-service portal that only serves one ministry's citizens is not DPI, however sophisticated.

## 27. Data Minimalism Is Privacy Architecture, Not Policy

**Problem:** Systems collect as much data as possible "for future use," creating massive attack surfaces and making breaches catastrophic.
**Mainstream:** Capture everything while you have people's attention. Data is the new oil — collect now, decide later.
**Their approach:** "Minimalism was an argument towards privacy. If you don't capture data, you don't have to worry about security leaks because you don't have the data for anything." Cut to the absolute minimum: Aadhaar captured only four fields — name, date of birth, gender, address — plus core biometrics, despite having a billion people in enrollment queues.
**Example:** Researchers repeatedly asked why not capture more data "while we had a billion people standing in line." He refused every time. "The more you have, the less chance you're going to succeed." Minimalism is not a policy aspiration — it is the security design.

## 28. Trust-No-One Architecture for Critical National Systems

**Problem:** Identity systems assume that authorized users — including insiders — can be trusted with raw data access once credentialed.
**Mainstream:** Restrict access through role-based permissions. Trusted employees with proper clearance can access data for legitimate operations.
**Their approach:** "Never centralise. Never have a mothership to attack." Every column in the Aadhaar database is encrypted with different keys — millions of keys total — so even Aadhaar's own officers cannot search the database. Data is encrypted with public cryptography before it reaches the hard disk. "Trust-no-one architecture" treats even internal actors as untrusted zones.
**Example:** "Even insiders can't tamper with them. Even Aadhaar officers can't search the Aadhaar database." The enrollment operators at the edges of India are explicitly not treated as trusted zones — the architecture enforces this, not policy.

## 29. Build Rails, Not Trains

**Problem:** Governments build end-to-end digital solutions, becoming the operator of every citizen service rather than the enabler of a service ecosystem.
**Mainstream:** Government designs and delivers the full service. Private sector participates but on government platforms and terms.
**Their approach:** "Just as governments build highways but not cars, DPI is a digital highway. The idea behind DPI was like laying down a rail track. It is up to the innovators to imagine what kind of trains can utilise that facility and cater to the needs of the people."
**Example:** UPI is the payment rail. Government built it. PhonePe, Google Pay, and 500+ apps built the trains. Government did not need to know what trains would run when it laid the track — and the trains that emerged were ones no government planner would have designed.

## 30. The Three-Layer Digital Stack: Identity, Assets, Transactions

**Problem:** Digital inclusion initiatives jump to services without establishing the foundational layers those services depend on.
**Mainstream:** Build citizen-facing digital services. Workarounds exist for users without identity.
**Their approach:** Every digital empowerment story distils to three sequential layers: (1) Digital identity ("who I am" — Aadhaar, PAN, GST); (2) Digital assets and credentials ("what I have" — money, property records, verifiable certificates); (3) Digital transactions ("what I do" — applying for a loan, buying goods). Government's role is exclusively to build and maintain layer one. Everything else follows from it.
**Example:** Without Aadhaar (layer 1), PMJDY bank accounts (layer 2) could not be opened instantly. Without both, digital credit (layer 3) could not flow to the unbanked. Each layer was a prerequisite — the sequence could not be skipped.

## 31. Population Scale Demands Federated Architecture

**Problem:** Systems designed for small populations fail at national scale — not because of compute, but because centralization creates single points of failure and attack surfaces that become catastrophic at scale.
**Mainstream:** Scale infrastructure vertically then horizontally. Centralized management is simpler and more controllable.
**Their approach:** "Anything centralized potentially can harm people and have resilience issues. Anything centralized potentially can get attacked." At population scale, federation is not a preference — it is a security and resilience requirement. Data stays at source. Each node is independent. Protocol connects them without creating a central data pool.
**Example:** The Account Aggregator network is federated — financial data stays at the source bank, moves only on per-transaction consent, and is never centralized in a single repository that could be breached.

## 32. The Plus-One Theory: Design for Irreversible Behavioral Shifts

**Problem:** Adoption campaigns spend enormous resources getting populations to try new digital systems, then lose them when the habit does not form.
**Mainstream:** Maximize outreach, subsidize initial adoption, run awareness campaigns. Re-campaign when users drop off.
**Their approach:** "What is +1 for them is more important than what is +1 for us. What do they already do? What are their visual imaginations? What is that one thing you can do from which they will say, 'Aha, I never feel like going back to the previous equilibrium?'" Find the irreversible behavioral step and the system self-propagates without campaigning.
**Example:** AEPS (Aadhaar Enabled Payment System) during COVID lockdown: people used fingerprints at their doorstep for banking. Transactions doubled. "You can do at-scale shifts, without actually ever going back." The introduction of mobile phones was all Plus-One — the world never asked for the internet but never returned to life without it.

## 33. UPI Is Like SMTP — Built With Everything SMTP Got Wrong, Corrected

**Problem:** Financial systems digitize existing bank transfer models, preserving their friction and delays in digital form.
**Mainstream:** Build a digital version of SWIFT or NEFT with better UX. Improve the interface, keep the underlying protocol.
**Their approach:** "When I wrote the first UPI protocol, it sort of did what SMTP did to e-mail." But with three critical improvements over SMTP's design: real-time settlement (no store-and-forward), end-to-end encryption, and explicit trust establishment between parties. Money cannot work like email — the protocol divergences are non-negotiable.
**Example:** Email is store-and-forward with no guaranteed delivery time. Money cannot tolerate this. UPI enforces real-time settlement from the protocol level, which is why 300 million UPI transactions occur on devices that are not smartphones — via fingerprint at a merchant touchpoint, device-agnostic and authentication-agnostic by design.

## 34. The Financial Inclusion Chain: Identity Unlocks Every Subsequent Layer

**Problem:** Financial inclusion initiatives address symptoms — no bank account, no credit — without addressing the root cause: absence of verifiable identity.
**Mainstream:** Build microfinance programs, open banking kiosks, create targeted loan schemes. Address each gap directly.
**Their approach:** The chain is sequential and each layer depends on the prior one: verifiable identity (Aadhaar) → instant bank account opening with no paperwork → digital financial footprint → that footprint as a verifiable asset for credit. Skip a layer and the chain fails. "We went from nobody having an ID to a billion people having ID, all in that span of eight years."
**Example:** "In 2009, less than 17 percent of Indians had bank accounts." Aadhaar-linked PMJDY opened 500 million accounts. Account Aggregator then made those account histories usable as credit credentials. Each layer was built sequentially — and each one was only possible because the prior one existed.

## 35. The Transaction Cost Is the Barrier to Sachet Credit, Not the Capital

**Problem:** Banks cannot profitably serve small-ticket loans to informal businesses and individuals. The narrative is that capital is constrained.
**Mainstream:** Subsidize small business loans through government schemes. Direct lending programs at underserved segments.
**Their approach:** "For banks, expending so much time and effort for sachet loans doesn't seem worth it." The real barrier is not capital — it is the cost of verifying creditworthiness. OCEN reduces KYC cost from $50–100 per customer to under $1 by creating a common API language where Account Aggregator delivers verified financial history on demand, making "$1,000 for five days" economically viable for a lender.
**Example:** A loan of $1,000 for five days earns perhaps $2 in interest. At $100 KYC cost, the economics collapse. At $1 KYC cost — made possible by digital financial footprint via Account Aggregator — the same loan is commercially viable. The infrastructure change makes the economics work without subsidy.

## 36. Consent Architecture as the Third Pillar of India Stack

**Problem:** Digital systems enable powerful data flows between institutions but give citizens no technical control over who accesses their data and for what purpose.
**Mainstream:** Privacy policies and terms of service govern data use. Users accept or don't use the service.
**Their approach:** After identity (Aadhaar) and payments (UPI), the third layer is consent: an Electronic Consent Architecture that gives individuals granular, revocable control over their digital footprints. DEPA (Data Empowerment and Protection Architecture) makes consent a technical primitive enforced cryptographically — not a legal formality buried in terms of service.
**Example:** In the Account Aggregator network, a user authorizes their bank to share 12 months of statements with a lender — for a specified duration, for a specific purpose, revocable at any time. The consent is cryptographically enforced. The lender cannot exceed the authorization without a new consent. This is structurally different from checkbox consent.

## 37. The Transaction Internet: Extending Protocol-Based Design Beyond Content

**Problem:** The internet created an open content economy but left commerce, logistics, healthcare, and services in platform silos controlled by a handful of large players.
**Mainstream:** Build platforms for each sector. Aggregators for food, ride-hailing, e-commerce. Each is a walled garden where the platform captures value.
**Their approach:** "The internet opened up a content economy, and what we want to create is a transaction economy." Beckn Protocol extends the internet's HTTP logic to transactions: open, interoperable, not controlled by any single platform. "We are not setting up one more platform. If you have a learning platform, if you have money, you can connect to the grid."
**Example:** Namma Yatri in Bangalore runs on Beckn — drivers are discovered through an open protocol, not Ola's or Uber's proprietary systems. Any app can discover any auto-rickshaw driver through the same protocol. In The Gambia, the same protocol runs agri-commerce. In the Netherlands, EV charging. One protocol, infinite local implementations.

## 38. Each DPI Piece Must Do One Thing Exceptionally Well

**Problem:** DPI initiatives try to solve multiple problems in a single system, creating bloated infrastructure that serves each purpose poorly and cannot compose with other systems.
**Mainstream:** Design comprehensive systems. Bundle related functions to reduce integration overhead and simplify deployment.
**Their approach:** "The fox knows many things, but the hedgehog knows one big important thing. Any DPI should be like a hedgehog, doing one thing really well." Composability across well-defined hedgehog systems creates the full solution — not breadth within a single monolithic system. Breadth in DPI is how you get fragile, over-specified infrastructure.
**Example:** Aadhaar does identity only. UPI does payments only. DigiLocker does document storage only. ABDM does health data linkage only. None tries to do the other's job. They compose into India Stack — and each is replaceable independently.

## 39. Open Source and Commodity Computing Enable National Infrastructure at a Fraction of Proprietary Cost

**Problem:** National digital infrastructure gets locked into proprietary enterprise vendors, creating architectural dependencies that compound in cost and are eventually impossible to exit.
**Mainstream:** Use enterprise vendors for critical national infrastructure. Reliability and support require established commercial players.
**Their approach:** Deliberately chose open source and commodity computing for Aadhaar — accepting apparent short-term risk — to avoid long-term architectural lock-in. The outcome: total cost of the entire UIDAI system came to Rs 70 per enrolled person, covering hardware, datacentres, salaries, and offices, compared to $100+ per person in the US and UK for equivalent national ID systems.
**Example:** The enrollment, workflow, deduplication, authentication, error handling, and manual quality check systems each came from different vendors — all on commodity hardware. This deliberate unbundling prevented any single vendor from holding the national identity system hostage to a contract renewal.

## 40. Unified, Not Uniform

**Problem:** National infrastructure initiatives enforce a single standard implementation that cannot accommodate regional diversity, language differences, or contextual variation.
**Mainstream:** Standardize implementation. One solution for all use cases ensures consistency. Uniform = interoperable.
**Their approach:** "Think unified, not uniform." Shared infrastructure creates unity — common standards, common interoperability, shared rails — while diverse implementations create fitness for local context. The goal is the ability for diverse solutions to coexist on shared infrastructure, not to impose one solution on every context.
**Example:** UPI is unified — any bank, any app, any merchant, one protocol. But implementations are radically non-uniform: WhatsApp Pay, Google Pay, PhonePe, BHIM, and dozens of bank apps are completely different UPI interfaces on identical rails. The unity is in the protocol, not the experience.

## 41. DPI Balances Government and Market Where Neither Alone Solves Inclusion

**Problem:** Digital inclusion initiatives fail because they are run either entirely by government (slow, over-specified, not market-responsive) or entirely by market (exclusionary by default, optimized for profitable segments).
**Mainstream:** Either government builds and operates everything, or government funds private operators to do it.
**Their approach:** "There was a stark contrast in how government would approach an inclusion agenda versus how market approaches profit or a growth agenda, and they were not coming together. DPI fundamentally differs in that we are getting the best of government to create interoperability and the fabric, and leaving it for the society as a whole — market actors, NGOs, philanthropies — to rise up."
**Example:** Government built Aadhaar authentication (interoperability fabric). Private fintechs built the credit products. NGOs built enrollment camps for remote populations. Each actor did what it is structurally suited for. No single actor could have done all three. DPI is the coordination mechanism that makes all three possible simultaneously.

## 42. Health Data Must Remain at Its Source

**Problem:** Health data interoperability is pursued through central health data repositories, which carry enormous privacy and security risks and create single points of failure.
**Mainstream:** Build a national health data repository. Aggregate patient records centrally so authorized parties can access them for care coordination.
**Their approach:** Health data must follow a federated model: records always reside at the source where they were generated (the lab, the hospital, the diagnostic center), or in a health application the user explicitly chooses. Data moves only with per-transaction, granular, revocable consent. The Unified Health Interface runs on Beckn Protocol, making healthcare discovery and delivery interoperable without centralizing the underlying records.
**Example:** Under ABDM, a diagnostic lab's records stay with the lab. An insurance company can request them only with the patient's explicit consent for that specific transaction — processed through the same consent architecture as Account Aggregator. There is no central national health record database with a complete picture of any patient.

## 43. Every Manual Repeated Task Is Debt Against Scale

**Problem:** Teams accept operational repetition as the cost of running complex systems, without recognizing it as technical debt that compounds when user volume grows.
**Mainstream:** Automate the critical path. Manual processes are acceptable for exception handling and operations.
**Their approach:** "Adopt extreme automation — every repeated task and API testing must be automated." At population scale, any manual process that runs even occasionally becomes a throughput bottleneck. Operational automation is not a feature — it is infrastructure debt that must be paid before scale is attempted.
**Example:** In Aadhaar's enrollment system, every workflow exception, every API test, and every quality check had to be automated before the system could process a billion enrolments in eight years. Manual spot-checks at that volume would have created years of backlog with no path to clearance.

## 44. Lego Block Composability Unlocks Access, Affordability, and Agency Together

**Problem:** Systems built as integrated vertical solutions can only deliver one fixed combination of access level, cost structure, and user choice.
**Mainstream:** Build a complete solution for your target users. Vertical integration gives control over the experience and quality.
**Their approach:** "The underpinning construct of a digital infrastructure is to provide reusable Lego blocks that can be used by the market, by the society, by the government to rapidly construct and reconstruct solutions that are affordable, accessible, and give choice." All three outcomes — access, affordability, and agency — fail simultaneously when you build a monolithic vertical instead of composable blocks.
**Example:** Aadhaar (identity block) + eKYC API (verification block) + PM Jan Dhan Yojana (banking scheme) compose into instant account opening at near-zero cost. Any block can be independently replaced or combined differently for a new use case. No monolith would have produced 500 million accounts opened in five years.

## 45. Design for Retractability: Systems Must Be Able to Die Gracefully

**Problem:** Systems are designed only for deployment and growth, with no engineering thought given to how they will eventually be decommissioned or replaced.
**Mainstream:** Build to last. Upgrades and replacements are future problems. Optimize for deployment and operation.
**Their approach:** "Design for retractability and build observability through telemetry." Digital public systems, especially, must be designed from the beginning to be replaceable — with clear API boundaries, observable behaviour through telemetry, and no hidden dependencies that make shutdown or module replacement impossible.
**Example:** Because Aadhaar's subsystems were cleanly bounded by APIs, specific modules — enrollment hardware, biometric matching engines — have been replaced multiple times without disrupting the live authentication service running at a billion-user scale. The system can evolve because it was designed to be retractable at the component level.

## 46. Infrastructure Distributes the Ability to Solve; It Does Not Solve

**Problem:** Infrastructure builders try to solve the problems they imagine their users face, designing solutions from distant offices for contexts they do not understand.
**Mainstream:** Research user needs. Design solutions. Deploy at scale. Assume the solution matches the problem.
**Their approach:** "Digital infrastructure is not about solving; it is about distributing the ability to solve. We almost always are wrong when we imagine solutions for people from a Bangalore office. The job of DPI builders is to unbundle, not to actually build the solution." Make composable building blocks available to local entrepreneurs, NGOs, and community members who hold the real contextual knowledge.
**Example:** EkStep did not build educational content. It built an open learning infrastructure so that teachers in Tamil Nadu and community educators in tribal Jharkhand could build for their own contexts — in their own languages, for problems a Bangalore office could not have correctly specified.

## 47. Anything Centralized Can Be Attacked

**Problem:** Centralized digital systems are presented as more manageable and more secure than distributed alternatives, with a smaller operational perimeter to defend.
**Mainstream:** Centralize for operational control. Distributed systems are complex to secure and coordinate.
**Their approach:** "Anything centralized potentially can harm people and have resilience issues. Anything centralized potentially can get attacked." Decentralization is not a governance preference — it is a security architecture. The attack surface of a distributed network where each node holds partial, encrypted data is orders of magnitude smaller than a central repository that, if compromised, exposes everything.
**Example:** Aadhaar's deduplication engine — the most computationally sensitive component — is operationally separated from authentication. The authentication API never exposes the underlying biometric database. No single breach point contains a complete, actionable record set for the system's 1.4 billion users.

## 48. DPGs Are Raw Material; DPI Is the Governance Purpose

**Problem:** Policymakers conflate open-source software projects (Digital Public Goods) with the digital infrastructure vision (Digital Public Infrastructure), treating them as interchangeable.
**Mainstream:** Adopt open-source software and you have built digital public infrastructure. Open-source is the DPI strategy.
**Their approach:** Digital Public Goods are "well-designed assets — specifications, software, data, content — made freely available, having their own lifecycle and governance." DPI is the governance and infrastructure objective: the system that generates network effects and enables both public and private innovation at scale. DPI can be built without DPGs if interface specifications are open and the system is reusable by others. The test is not open-source; the test is reusability.
**Example:** NPCI's UPI payment infrastructure runs on proprietary systems but qualifies as DPI because the protocol specifications are open, the network is reusable by any bank or app, and it generates network effects across hundreds of millions of users. Open-source implementation is not the criterion.

## 49. Open Specifications Without Open Source Still Create Digital Infrastructure

**Problem:** Technology policy debates conflate open-source implementation with open interface specifications, concluding that DPI requires all participants to use open-source software.
**Mainstream:** For public infrastructure, open-source is the only trustworthy model. Proprietary implementation creates vendor lock-in and opacity.
**Their approach:** Open interface specifications are the non-negotiable requirement for DPI. Whether the underlying implementation is open-source or proprietary is secondary. Specifications being open means anyone can build a compatible implementation, audit expected behaviour, and build services on top — regardless of what runs underneath any participant.
**Example:** UPI's protocol specifications are public. Individual banks and apps implement the spec using their own internal software stacks, many of which are proprietary. The ecosystem interoperates because the spec is open — not because every participant uses open-source. The spec is the public good; the implementation is the private choice.

## 50. Export Rails, Not Solutions: Global DPI Replication Requires Local Innovators

**Problem:** Countries trying to replicate India's digital infrastructure journey attempt to copy specific implementations, failing to account for local context, capacity, and regulatory environment.
**Mainstream:** Export the implementation. License the platform. Provide the same technical solution that worked in India.
**Their approach:** "I hope this inspires people to create their own journey for their own countries." The rails are what can be exported — the open specifications, architectural principles, and governance models. Local entrepreneurs, NGOs, and government teams must build the trains for their own context. "Unless we come together and hold hands… one government can't solve, one small civil society can't solve, one private company can't solve. It's a collective effort."
**Example:** The Gambia adopted Beckn Protocol for agri-commerce, the Netherlands for EV charging, Brazil for reskilling, Bangalore's Namma Yatri for mobility. Each adapted the same protocol rail to an entirely different local context — none copied India's implementation. The protocol was the export; the solution was built locally.
