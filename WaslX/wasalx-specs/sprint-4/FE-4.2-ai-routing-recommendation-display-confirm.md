# FE-4.2 — AI Routing Recommendation Display & Confirm

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.2` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-05, 07) |
| ClickUp | https://app.clickup.com/t/86cae06q1 |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** to see the AI's routing recommendation and confirm or override it, **so that** I keep oversight of assignment.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Recommendation badge (suggested agent + reason)
- [ ] Confirm/override controls (recommend-only mode)

## 4. Acceptance Criteria (the test plan)
- [ ] In recommend-only mode, ownership changes only after human confirmation

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.3`
- `US-4.6`

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
