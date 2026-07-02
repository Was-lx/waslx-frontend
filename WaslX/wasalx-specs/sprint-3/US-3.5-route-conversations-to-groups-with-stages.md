# US-3.5 — Route Conversations to Groups with Stages

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-3.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Must (High) |
| FR Traceability | FR-GRP (GRP-03,04,06) |
| ClickUp | https://app.clickup.com/t/86caddy8a |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** to route a conversation to a group and move it through defined stages, **so that** work progresses in a structured, trackable way.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Route a conversation to a specific group
- [ ] Defined stages a conversation progresses through
- [ ] Retain stage and handoff history

## 4. Acceptance Criteria (the test plan)
- [ ] A conversation can be routed to a group and advanced through stages
- [ ] Stage history is retained

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-3.4`

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
