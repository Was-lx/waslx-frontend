# FE-4.2 — Escalation Recommendation Display & Confirm

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.2` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-05, 07) |
| ClickUp | https://app.clickup.com/t/86cae06q1 |
| Status | Not started |

## 1. User Story
> **As a** Manager, **I want** to see the AI's **escalation** recommendation (suggested senior agent + reason)
> and confirm or override it, **so that** I keep oversight of the critical cases.

> **⚠️ Escalation only.** Normal assignment is handled by the existing distribution systems and is not part
> of this screen.

## 2. Context
Part of **Sprint 4 — AI Pipeline** — Frontend for **Component 3 (Escalation)**. See `PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] Escalation recommendation badge (suggested senior agent + reason)
- [ ] Confirm / override controls (recommend mode)

## 4. Acceptance Criteria (the test plan)
- [ ] In recommend mode, ownership of an escalated conversation changes only after human confirmation

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-4.2` / `US-4.3` / `US-4.5` stories).
- Normal assignment (existing distribution systems).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.2`
- `US-4.5`

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
