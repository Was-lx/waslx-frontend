# US-6.10 — System Health Monitoring & Announcements

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-6.10` |
| Track | Backend / Full-stack |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Should (Normal) |
| FR Traceability | FR-PADM (PADM-12, 14) |
| ClickUp | https://app.clickup.com/t/86cadf590 |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** to monitor system health and broadcast announcements, **so that** I can detect degradation and keep tenants informed.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Monitor service status (API, AI provider, DB, WhatsApp) with alerts
- [ ] Broadcast announcements/notices to tenants

## 4. Acceptance Criteria (the test plan)
- [ ] Degradation raises an alert
- [ ] Announcements can be broadcast

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-6.1`

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
