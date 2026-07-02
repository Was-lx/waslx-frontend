# US-6.8 — Audited Tenant Impersonation

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-6.8` |
| Track | Backend / Full-stack |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Should (Normal) |
| FR Traceability | FR-PADM (PADM-10) |
| ClickUp | https://app.clickup.com/t/86cadf54g |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** secure, scoped, time-limited impersonation that is fully audit-logged, **so that** I can support tenants without compromising trust.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Scoped, time-limited impersonation into a tenant
- [ ] Fully audit-log every impersonation session

## 4. Acceptance Criteria (the test plan)
- [ ] Impersonation is time-limited and recorded with operator identity

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-6.1`
- `US-6.9`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
