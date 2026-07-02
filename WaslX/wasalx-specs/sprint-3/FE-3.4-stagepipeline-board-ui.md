# FE-3.4 — Stage/Pipeline Board UI

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-3.4` |
| Track | Frontend (Angular) |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Must (High) |
| FR Traceability | FR-GRP (GRP-03, 04) |
| ClickUp | https://app.clickup.com/t/86cae06jn |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** a stage/pipeline board, **so that** I can see and move conversations through stages.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Kanban-style board by stage; drag/move to advance; per-group views

## 4. Acceptance Criteria (the test plan)
- [ ] Conversations show in correct stage columns and move between stages

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-3.5`

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
