# FE-7.5 — Graceful Degradation UX (AI/API-Down States)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-7.5` |
| Track | Frontend (Angular) |
| Sprint | Sprint 7 — Hardening, NFRs & Launch |
| Priority | Must (High) |
| FR Traceability | NFR-AVAIL-01 |
| ClickUp | https://app.clickup.com/t/86cae086v |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** graceful UI states when AI or the Cloud API is degraded, **so that** agents can keep working.

## 2. Context
Part of **Sprint 7 — Hardening, NFRs & Launch**. Make the product production-ready. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] AI-unavailable banner (manual mode)
- [ ] Send-retry on Cloud API errors; offline/reconnect indicators

## 4. Acceptance Criteria (the test plan)
- [ ] When AI/Cloud API is down, the UI degrades gracefully and never blocks manual handling

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-7.2`

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
