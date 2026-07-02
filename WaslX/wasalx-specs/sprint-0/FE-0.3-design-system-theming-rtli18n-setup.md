# FE-0.3 — Design System, Theming & RTL/i18n Setup

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-0.3` |
| Track | Frontend (Angular) |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Must (High) |
| FR Traceability | Sprint 0 · NFR-LOC-01 |
| ClickUp | https://app.clickup.com/t/86cae064v |
| Status | Not started |

## 1. User Story
> **As a** developer, **I want** a shared design system with theming, RTL support, and i18n, **so that** the UI is consistent and Arabic-first from day one.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Reusable component library
- [ ] RTL/LTR switching; Arabic + English i18n scaffolding

## 4. Acceptance Criteria (the test plan)
- [ ] Components render correctly in RTL (Arabic) and LTR (English)
- [ ] Language switch flips direction and strings app-wide

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
