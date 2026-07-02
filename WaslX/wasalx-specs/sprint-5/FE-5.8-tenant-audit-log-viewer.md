# FE-5.8 — Tenant Audit Log Viewer

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-5.8` |
| Track | Frontend (Angular) |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Should (Normal) |
| FR Traceability | FR-AUDIT (AUDIT-02) |
| ClickUp | https://app.clickup.com/t/86cae06yk |
| Status | Not started |

## 1. User Story
> **As a** Admin, **I want** an audit log viewer, **so that** I can review key actions in my tenant.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Searchable/filterable audit log table (actor, action, time); read-only

## 4. Acceptance Criteria (the test plan)
- [ ] Admin can query logins, assignments, status changes, and sends

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-5.7`

## 7. Technical Notes
- Angular + TypeScript; use the shared design system, RTL/i18n, and toast service.
- Call backend through the gateway; attach JWT via the HTTP interceptor.
- Mirror server-side RBAC in the UI (defense in depth); never trust the client alone.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
