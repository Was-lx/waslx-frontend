# US-5.7 — Audit Logs (Tenant)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-5.7` |
| Track | Backend / Full-stack |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Must (High) |
| FR Traceability | FR-AUDIT (AUDIT-01, 02) |
| ClickUp | https://app.clickup.com/t/86cadf4pa |
| Status | Not started |

## 1. User Story
> **As a** Admin, **I want** key actions recorded in an immutable, queryable audit log, **so that** the tenant has accountability and troubleshooting evidence.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Log logins, assignments, reassignments, status changes, sends
- [ ] Immutable and queryable by an Admin

## 4. Acceptance Criteria (the test plan)
- [ ] Key actions captured with actor and timestamp
- [ ] Logs cannot be altered and are queryable by an Admin

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-1.5`

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
