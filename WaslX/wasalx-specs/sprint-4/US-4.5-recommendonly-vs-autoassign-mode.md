# US-4.5 — Escalation: Recommend vs Auto-Assign Mode

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-07) |
| ClickUp | https://app.clickup.com/t/86caddymt |
| Status | Not started |

## 1. User Story
> **As an** Admin/Manager, **I want** to choose whether an **escalation** is auto-assigned to the chosen
> senior agent or only **recommended** for me to confirm, **so that** I control the AI's autonomy over the
> critical cases.

> **⚠️ Applies to escalation only.** Normal distribution of ordinary conversations is unchanged (existing
> systems). This toggle governs what happens when a case escalates (US-4.4).

## 2. Context
Part of **Sprint 4 — AI Pipeline** — **Component 3 (Classification & Escalation)**. See `PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] Configurable **escalation** mode: **recommend** (needs human confirmation) or **auto-assign**

## 4. Acceptance Criteria (the test plan)
- [ ] Recommend mode suggests the escalation target but doesn't change ownership until confirmed
- [ ] Auto mode assigns the escalated conversation automatically

## 5. Out of Scope
- Normal assignment of ordinary conversations (existing distribution systems).
- UI/presentation (covered by `FE-4.2`).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.3`

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
