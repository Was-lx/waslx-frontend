# FE-6.7 — Platform Settings UI (Credentials, Feature Flags, Policy)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-6.7` |
| Track | Frontend (Angular) |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Should (Normal) |
| FR Traceability | FR-PADM (PADM-08,09,15) |
| ClickUp | https://app.clickup.com/t/86cae07jd |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** a settings area for credentials, feature flags, and global policy, **so that** I can centrally control platform configuration.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Secure credentials/secrets UI
- [ ] Feature-flag toggles (per tenant/global)
- [ ] Global policy defaults (retention, rate limits, default routing)

## 4. Acceptance Criteria (the test plan)
- [ ] Secrets managed securely; flags and policies persist and apply

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-6.6`
- `US-6.7`

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
