# FE-1.2 — Password Reset & Lockout UI

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-1.2` |
| Track | Frontend (Angular) |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Should (Normal) |
| FR Traceability | FR-AUTH (AUTH-06, 07) |
| ClickUp | https://app.clickup.com/t/86cae066z |
| Status | Done |

## 1. User Story
> **As a** user, **I want** password-reset screens and clear lockout feedback, **so that** I can recover access safely.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [x] Forgot-password + reset-with-token screens
- [x] Lockout messaging after repeated failures

## 4. Acceptance Criteria (the test plan)
- [x] Reset flow works with expiry handling
- [x] Lockout state is clearly communicated

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-1.2`

## 7. Technical Notes
- Angular + TypeScript; use the shared design system, RTL/i18n, and toast service.
- Call backend through the gateway; attach JWT via the HTTP interceptor.
- Mirror server-side RBAC in the UI (defense in depth); never trust the client alone.

## 9. Definition of Done
- [x] All Functional Requirements implemented.
- [x] All Acceptance Criteria verified (manual + automated where feasible).
- [x] Tenant-scoping and RBAC respected.
- [x] Arabic/English (RTL/LTR) correct where user-facing.
- [x] Code reviewed, merged via CI green.
