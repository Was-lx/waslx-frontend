# US-5.4 — Reporting & Analytics Dashboards

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-5.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Must (High) |
| FR Traceability | FR-RPT (RPT-01..05) |
| ClickUp | https://app.clickup.com/t/86cadf4ju |
| Status | Not started |

## 1. User Story
> **As a** Manager/Admin, **I want** performance, response-time, volume, and routing reports, **so that** I have visibility into team performance and workload.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Agent performance (handled, resolution rate)
- [ ] Response-time metrics (overall + per agent)
- [ ] Chat-volume trends
- [ ] Routing/assignment stats
- [ ] Agents restricted from org-wide reports; see only their own

## 4. Acceptance Criteria (the test plan)
- [ ] Managers/Admins see org-wide; Agents see only their own
- [ ] Reports cover performance, response time, volume, routing

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.10`

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
