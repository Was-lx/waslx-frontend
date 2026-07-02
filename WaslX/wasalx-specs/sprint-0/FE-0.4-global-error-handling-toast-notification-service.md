# FE-0.4 — Global Error Handling & Toast Notification Service

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-0.4` |
| Track | Frontend (Angular) |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Should (Normal) |
| FR Traceability | Sprint 0 · Frontend foundation |
| ClickUp | https://app.clickup.com/t/86cae065g |
| Status | Not started |

## 1. User Story
> **As a** user, **I want** consistent error messages and toast notifications, **so that** failures and successes are communicated clearly.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Global HTTP error interceptor → friendly messages
- [ ] Toast service (success/error/info)

## 4. Acceptance Criteria (the test plan)
- [ ] API errors surface as readable toasts
- [ ] Success actions confirm via toast

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `FE-0.1`

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
