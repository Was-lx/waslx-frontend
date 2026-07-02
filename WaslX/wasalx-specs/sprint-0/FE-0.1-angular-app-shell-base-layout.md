# FE-0.1 — Angular App Shell & Base Layout

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-0.1` |
| Track | Frontend (Angular) |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Must (High) |
| FR Traceability | Sprint 0 · Frontend foundation |
| ClickUp | https://app.clickup.com/t/86cae063x |
| Status | Not started |

## 1. User Story
> **As a** developer, **I want** a scaffolded Angular app shell with a base layout, **so that** all feature screens plug into a consistent frame.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Angular workspace, lazy-loaded modules, responsive layout shell
- [ ] App-wide loading/skeleton states

## 4. Acceptance Criteria (the test plan)
- [ ] App boots to an authenticated shell with nav + content outlet
- [ ] Feature modules load lazily

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-0.1`

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
