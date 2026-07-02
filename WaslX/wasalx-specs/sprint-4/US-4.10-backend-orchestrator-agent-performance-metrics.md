# US-4.10 — Backend Orchestrator & Agent Performance Metrics

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.10` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | Sprint 4 · Orchestrator · NFR-PERF |
| ClickUp | https://app.clickup.com/t/86caddyqc |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** an orchestrator that runs RAG and Routing in parallel then the Reply Engine, **so that** the end-to-end pipeline stays under two seconds.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Trigger RAG + Routing in parallel on each inbound; Reply Engine waits only for RAG
- [ ] Compute agent performance metrics that feed routing

## 4. Acceptance Criteria (the test plan)
- [ ] Inbound → context + decision + 1–3 suggestions in < ~2s
- [ ] Performance metrics are produced and consumed by routing

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.1`
- `US-4.3`
- `US-4.8`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
