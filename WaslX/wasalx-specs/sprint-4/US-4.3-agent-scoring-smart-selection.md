# US-4.3 — Escalation Target Scoring & Smart Selection

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-05) |
| ClickUp | https://app.clickup.com/t/86caddykf |
| Status | Not started |

## 1. User Story
> **As a** system, **when a conversation must escalate**, **I want** to select the best-suited
> **senior agent / supervisor** by combining performance, workload, and client state, **so that** critical
> cases reach the right person fast.

> **⚠️ Escalation only — not normal routing.** This scoring runs **only when the classification sets
> `escalate=true`** (US-4.2). Normal assignment of ordinary conversations stays on the existing distribution
> systems (Round Robin / By Admin / working-hours). The AI's distribution role is limited to critical cases.

## 2. Context
Part of **Sprint 4 — AI Pipeline** — **Component 3 (Classification & Escalation)**. See `PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] When `escalate=true`, select the best senior agent/supervisor from **performance + workload + client state**
- [ ] Respect workload-balancing **tolerance** (don't overload one senior agent)

## 4. Acceptance Criteria (the test plan)
- [ ] The chosen escalation target reflects performance, workload, and client state
- [ ] Balancing prevents disproportionate accumulation on a single senior agent

## 5. Out of Scope
- Normal assignment of ordinary conversations (existing distribution systems).
- UI/presentation (covered by `FE-4.2`).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.2`
- `US-3.3`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Consumes `AgentPerformance` (produced by US-4.8). Emit real-time updates via SignalR; log to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 8. Notes & Open Questions
Performance-metric formula/weights are **(TBC)**; default = resolution rate, response time, workload.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
