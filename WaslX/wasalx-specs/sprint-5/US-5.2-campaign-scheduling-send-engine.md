# US-5.2 — Campaign Scheduling & Send Engine

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-5.2` |
| Track | Backend / Full-stack |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Must (High) |
| FR Traceability | FR-CMP (CMP-03,04,05) |
| ClickUp | https://app.clickup.com/t/86caddytc |
| Status | Not started |

## 1. User Story
> **As a** Admin/Manager, **I want** to schedule and send campaigns compliantly with per-recipient delivery tracking, **so that** broadcasts go out reliably and I can see results.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Schedule immediate or future send
- [ ] Send via the connected number using approved templates, respecting limits/window
- [ ] Track per-recipient status (queued/sent/delivered/read/failed) with timestamps

## 4. Acceptance Criteria (the test plan)
- [ ] A future-scheduled campaign sends automatically
- [ ] Each recipient's status updates
- [ ] No non-template messages outside the 24h window

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-5.1`

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
