# FE-5.1 — Campaign Builder Wizard

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-5.1` |
| Track | Frontend (Angular) |
| Sprint | Sprint 5 — Campaigns, Reporting, Notifications & Audit |
| Priority | Must (High) |
| FR Traceability | FR-CMP (CMP-01, 02) |
| ClickUp | https://app.clickup.com/t/86cae06tt |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** a guided campaign builder, **so that** I can create a broadcast step by step.

## 2. Context
Part of **Sprint 5 — Campaigns, Reporting, Notifications & Audit**. Outbound campaigns plus supervision visibility and accountability. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Wizard: name → approved template (variable mapping) → review

## 4. Acceptance Criteria (the test plan)
- [ ] A campaign is built with a valid approved template and preview

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-5.1`

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
