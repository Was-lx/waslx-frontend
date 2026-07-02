# US-6.5 — AI Usage & Cost Monitoring

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-6.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Should (Normal) |
| FR Traceability | FR-PADM (PADM-07) · NFR-COST-01 |
| ClickUp | https://app.clickup.com/t/86cadf4za |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** to monitor AI usage and cost per tenant and platform-wide with budget alerts, **so that** AI spend stays within target operating cost.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Monitor AI usage/cost per tenant and platform-wide (tokens, spend per model)
- [ ] Configure budget alerts

## 4. Acceptance Criteria (the test plan)
- [ ] AI-cost dashboard reflects per-tenant token spend and flags quota breaches

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-6.4`

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
