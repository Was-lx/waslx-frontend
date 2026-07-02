# FE-1.3 — User Management Screens (List / Create / Invite)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-1.3` |
| Track | Frontend (Angular) |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Must (High) |
| FR Traceability | FR-USER (USER-01, 02) |
| ClickUp | https://app.clickup.com/t/86cae067g |
| Status | Not started |

## 1. User Story
> **As a** Admin, **I want** screens to list, create, and invite users, **so that** I can manage my team from the UI.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] User list (search/sort/paginate)
- [ ] Create/invite form with validation

## 4. Acceptance Criteria (the test plan)
- [ ] Admin can create/invite a user and see them in the list

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-1.3`

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
