# FE-4.4 — Conversation Summary Display (Handoff + On-Demand)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.4` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | FR-SUM (SUM-01,02,03) |
| ClickUp | https://app.clickup.com/t/86cae06qw |
| Status | Not started |

## 1. User Story
> **As a** Agent receiving a handoff, **I want** the conversation summary shown, **so that** I get context instantly.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Summary banner on open (handoff)
- [ ] 'Generate full summary' on demand

## 4. Acceptance Criteria (the test plan)
- [ ] A concise summary shows on handoff; full summary available on demand

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.9`

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
