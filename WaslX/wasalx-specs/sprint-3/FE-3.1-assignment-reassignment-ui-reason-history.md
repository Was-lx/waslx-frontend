# FE-3.1 — Assignment & Reassignment UI (Reason + History)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-3.1` |
| Track | Frontend (Angular) |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Must (High) |
| FR Traceability | FR-ASSIGN (ASG-01,03,05) |
| ClickUp | https://app.clickup.com/t/86cae06hp |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** UI to assign/reassign conversations with a reason and view history, **so that** ownership changes are easy and transparent.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Assignee picker, reassign dialog with reason
- [ ] Assignment-history timeline

## 4. Acceptance Criteria (the test plan)
- [ ] Assign/reassign updates ownership and records reason; history viewable

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-3.1`

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
