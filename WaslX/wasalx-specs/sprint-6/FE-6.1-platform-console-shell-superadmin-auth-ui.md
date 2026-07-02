# FE-6.1 — Platform Console Shell & Super-Admin Auth UI

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-6.1` |
| Track | Frontend (Angular) |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Must (High) |
| FR Traceability | FR-PADM (PADM-01, 13) |
| ClickUp | https://app.clickup.com/t/86cae06zm |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** a separate console shell with Super-Admin login, **so that** platform operations stay isolated from tenants.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Dedicated admin app/area, Super-Admin auth
- [ ] Nav isolated from tenant UI

## 4. Acceptance Criteria (the test plan)
- [ ] Console reachable only by Super Admins and never exposed to tenant users

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-6.1`

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
