# US-3.1 — Manual Assignment & Reassignment with History

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-3.1` |
| Track | Backend / Full-stack |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Must (High) |
| FR Traceability | FR-ASSIGN (ASG-01,03,05) |
| ClickUp | https://app.clickup.com/t/86caddy6k |
| Status | Not started |

## 1. User Story
> **As a** Manager/Admin, **I want** to manually assign and reassign conversations with a recorded reason and full history, **so that** ownership is always clear and auditable.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Manually assign to a specific Agent
- [ ] Reassign with reason recorded
- [ ] Retain full assignment history (who, by whom, when, why)

## 4. Acceptance Criteria (the test plan)
- [ ] Every assignment/reassignment is recorded with actor, time, and reason

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.8`

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
