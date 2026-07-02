# US-5.6 — Real-Time & Browser Notifications

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-5.6` |
| Track | Backend / Full-stack |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Should (Normal) |
| FR Traceability | FR-NOTIF (NOTIF-01,02,03) |
| ClickUp | https://app.clickup.com/t/86cadf4mk |
| Status | Not started |

## 1. User Story
> **As a** user, **I want** real-time and desktop/browser notifications, **so that** I stay responsive to assignments and escalations without watching the screen.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Push assignments/messages in real time (SignalR)
- [ ] Notify senior agent/supervisor on escalation
- [ ] Support desktop/browser notifications

## 4. Acceptance Criteria (the test plan)
- [ ] Relevant users get real-time notifications
- [ ] Browser/desktop notifications can be enabled

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.7`

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
