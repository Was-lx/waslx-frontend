# WasalX — Project Context (Spec-Kit Constitution)

> **Read this first.** Every per-story spec in this bundle assumes the shared context below.
> This is the single source of truth for architecture, actors, stack, and conventions.

## 1. Product Vision
WasalX is a **multi-tenant, AI-powered WhatsApp team inbox** for customer-facing teams,
**Arabic-first** (including Egyptian dialect) with full English support. Multiple agents share
one WhatsApp Business number through a centralized inbox. An AI pipeline adds per-customer memory
(RAG), smart routing, and reply suggestions. **The AI never sends autonomously** — agents stay in control.

## 2. Actors / Roles
- **Agent** — handles assigned conversations only.
- **Manager** — sees all conversations, assigns/reassigns, views team reports.
- **Admin (Tenant Owner)** — full tenant control: users, roles, settings, billing view, audit.
- **Platform Owner / Super Admin** — operates the SaaS across all tenants (Sprint 6). Isolated from tenant UIs.
- **Customer** — the WhatsApp end-user (external; not a system login).

## 3. Architecture
Angular SPA → **API Gateway** (auth + RBAC + rate limiting) → backend services → SQL Server.
Real-time via **SignalR**. Inbound WhatsApp via **Cloud API webhook**; outbound via Cloud API.
On each inbound message a **Backend Orchestrator** runs **RAG** + **Routing** in parallel, then the
**Reply Engine** produces 1–3 suggestions. Target end-to-end latency **< 2s** (routing **< 1s**).

## 4. Tech Stack
- **Frontend:** Angular (TypeScript), SignalR client, RTL/i18n (Arabic/English).
- **Backend:** ASP.NET Core (C#), EF Core, SignalR.
- **Database:** SQL Server with **native vector search** for embeddings.
- **AI:** OpenAI — `text-embedding-3-large` (embeddings), `gpt-4.1` (summarization),
  `gpt-4.1-mini` (reply generation). Classification for routing.
- **Channel:** WhatsApp Business **Cloud API** (official).

## 5. Cross-Cutting Rules (apply to every story)
1. **Tenant isolation** — every record is tenant-scoped; cross-tenant access is impossible.
2. **RBAC** — enforced server-side at the gateway per the Role × Permission matrix; the UI mirrors it (defense in depth).
3. **Encryption** — TLS in transit, encryption at rest.
4. **WhatsApp compliance** — respect the 24-hour window; outside it, only pre-approved templates; task-specific automation only.
5. **AI safety** — suggestions only; a human accepts/edits/sends.
6. **Auditability** — key actions are logged immutably.
7. **Localization** — Arabic-first; handle Arabic, English, and natural mixes.

## 6. Non-Functional Targets (NFRs)
- **PERF:** pipeline < 2s; routing < 1s. **SCAL:** 10,000+ conversations/day per tenant.
- **AVAIL:** graceful degradation — if AI or Cloud API is down, fall back to manual / Round Robin.
- **SEC:** RBAC, encryption, tenant isolation, data-retention policy.
- **LOC:** Arabic (incl. Egyptian dialect) + English. **COST:** monitor AI token spend per tenant.

## 7. Conventions for AI Agents Implementing These Specs
- Each spec has a stable **Story ID** (`US-x.y` backend / full-stack, `FE-x.y` frontend) and a **ClickUp** link.
- **Functional Requirements** and **Acceptance Criteria** are written as checkable items — treat them as the test plan.
- Respect **Dependencies** ordering. Don't implement a `FE-*` screen before its backing `US-*` endpoint exists (or stub it).
- Items marked **(TBC)** are open decisions — surface them, don't silently invent business rules.
- Traceability IDs (e.g., `AUTH-01`, `RAG-03`) map back to the Functional Requirements Specification.

## 8. Open Questions (TBC — from FRS §8)
- Agent **performance-metric formula/weights** for routing (default: resolution rate, response time, workload).
- **FAQ source** and **confidence threshold** for auto-resolve.
- **Subscription tier → feature** mapping.
- **Data-retention** periods (messages, vectors, audit logs).
