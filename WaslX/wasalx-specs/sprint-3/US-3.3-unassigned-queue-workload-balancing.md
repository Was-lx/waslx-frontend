# US-3.3 — Unassigned Queue & Workload Balancing

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-3.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Should (Normal) |
| FR Traceability | FR-ASSIGN (ASG-06, 07) |
| ClickUp | https://app.clickup.com/t/86caddy7f |
| Status | Not started |

## 1. User Story
> **As a** Admin, **I want** an Unassigned queue and a configurable workload-balancing tolerance, **so that** no conversation is dropped and no agent is overloaded.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Maintain an Unassigned queue
- [ ] Configurable workload-balancing tolerance (e.g., 3–4 chat difference = balanced)

## 4. Acceptance Criteria (the test plan)
- [ ] New conversations without an owner land in the queue
- [ ] Balancing keeps loads within tolerance

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-3.1`

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
