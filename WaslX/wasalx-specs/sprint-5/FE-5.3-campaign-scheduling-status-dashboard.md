# FE-5.3 — Campaign Scheduling & Status Dashboard

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-5.3` |
| Track | Frontend (Angular) |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Must (High) |
| FR Traceability | FR-CMP (CMP-03, 05) |
| ClickUp | https://app.clickup.com/t/86cae06v4 |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** scheduling and a campaign status dashboard, **so that** I can plan sends and track progress.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Schedule now/later picker
- [ ] Campaign list with live status

## 4. Acceptance Criteria (the test plan)
- [ ] Scheduling persists; dashboard reflects real-time campaign status

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-5.2`

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
