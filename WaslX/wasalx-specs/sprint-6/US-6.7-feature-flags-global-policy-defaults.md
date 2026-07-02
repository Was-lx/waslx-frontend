# US-6.7 — Feature Flags & Global Policy Defaults

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-6.7` |
| Track | Backend / Full-stack |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Should (Normal) |
| FR Traceability | FR-PADM (PADM-09, 15) |
| ClickUp | https://app.clickup.com/t/86cadf530 |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** feature flags and global policy defaults, **so that** I can enable/disable features and set platform-wide defaults.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Feature flags per tenant or globally
- [ ] Global defaults/policy (retention, rate-limit, default routing)

## 4. Acceptance Criteria (the test plan)
- [ ] Features toggle per tenant or globally
- [ ] Global defaults apply where tenants don't override

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-6.1`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 8. Notes & Open Questions
Data-retention period is **(TBC)**.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
