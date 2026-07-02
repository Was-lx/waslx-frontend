# FE-3.2 — Unassigned Queue View

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-3.2` |
| Track | Frontend (Angular) |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Should (Normal) |
| FR Traceability | FR-ASSIGN (ASG-06) |
| ClickUp | https://app.clickup.com/t/86cae06j3 |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** an unassigned queue view, **so that** I can pick up or distribute waiting conversations.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Queue list with quick-assign actions and counts

## 4. Acceptance Criteria (the test plan)
- [ ] Unassigned conversations appear and can be assigned in a click or two

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-3.3`

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
