# US-5.5 — Report Export (CSV/PDF)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-5.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Could (Low) |
| FR Traceability | FR-RPT (RPT-06) |
| ClickUp | https://app.clickup.com/t/86cadf4kn |
| Status | Not started |

## 1. User Story
> **As a** Manager/Admin, **I want** to export reports, **so that** I can share or analyze data outside the platform.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Export reports as CSV/PDF

## 4. Acceptance Criteria (the test plan)
- [ ] Reports export to CSV and PDF with accurate data

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-5.4`

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
