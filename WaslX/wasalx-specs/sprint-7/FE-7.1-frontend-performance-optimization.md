# FE-7.1 — Frontend Performance Optimization

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-7.1` |
| Track | Frontend (Angular) |
| Sprint | Sprint 7 — Hardening, NFRs & Launch |
| Priority | Must (High) |
| FR Traceability | NFR-PERF-01 · NFR-SCAL-01 |
| ClickUp | https://app.clickup.com/t/86cae07uf |
| Status | Not started |

## 1. User Story
> **As a** team, **I want** the Angular app optimized, **so that** the inbox stays fast under heavy conversation volume.

## 2. Context
Part of **Sprint 7 — Hardening, NFRs & Launch**. Make the product production-ready. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Bundle/lazy-load optimization, virtual scrolling
- [ ] Change-detection tuning, caching

## 4. Acceptance Criteria (the test plan)
- [ ] Inbox/chat remain responsive with large data sets; bundle within target

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-7.1`

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
