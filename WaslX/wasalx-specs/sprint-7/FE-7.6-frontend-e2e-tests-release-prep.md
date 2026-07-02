# FE-7.6 — Frontend E2E Tests & Release Prep

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-7.6` |
| Track | Frontend (Angular) |
| Sprint | Sprint 7 — Hardening, NFRs & Launch |
| Priority | Must (High) |
| FR Traceability | Sprint 7 · Release |
| ClickUp | https://app.clickup.com/t/86cae0899 |
| Status | Not started |

## 1. User Story
> **As a** team, **I want** frontend E2E tests and release prep, **so that** the UI ships reliably.

## 2. Context
Part of **Sprint 7 — Hardening, NFRs & Launch**. Make the product production-ready. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] E2E suite for critical flows (login, send/receive, assign, handoff, AI reply)
- [ ] Production build hardening; release checklist

## 4. Acceptance Criteria (the test plan)
- [ ] Critical-path E2E tests pass; a production build is verified and release-ready

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-7.5`
- `US-7.6`

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
