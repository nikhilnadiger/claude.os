---
expert: Pramod Varma (Indian)
council: SOFTWARE ENGINEERING
learnings: 25
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
