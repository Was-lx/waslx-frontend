# US-4.4 — Agent Scoring & Smart Selection

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-05) |
| ClickUp | https://app.clickup.com/t/86caddykf |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** to select the best-suited agent by combining classification with performance, workload, and client state, **so that** conversations reach the right person.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Select recommended agent from content + performance + workload + client state
- [ ] Respect workload-balancing tolerance

## 4. Acceptance Criteria (the test plan)
- [ ] Recommendation reflects all four factors
- [ ] Balancing prevents disproportionate accumulation

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.3`
- `US-3.3`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 8. Notes & Open Questions
Performance-metric formula/weights are **(TBC)**; default = resolution rate, response time, workload.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
