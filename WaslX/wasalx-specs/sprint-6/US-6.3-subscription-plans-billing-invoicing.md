# US-6.3 — Subscription Plans, Billing & Invoicing

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-6.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 6 — Platform Owner Console (Super Admin) |
| Priority | Must (High) |
| FR Traceability | FR-PADM (PADM-03,04,05) · FR-TEN (TEN-04) |
| ClickUp | https://app.clickup.com/t/86cadf4wd |
| Status | Not started |

## 1. User Story
> **As a** Platform Owner, **I want** to define plans, assign them to tenants, and handle billing/invoicing, **so that** the SaaS can be monetized and accounts stay in good standing.

## 2. Context
Part of **Sprint 6 — Platform Owner Console (Super Admin)**. Operate the SaaS across all tenants. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Define/manage plans (limits + pricing)
- [ ] Assign/change tenant plan; manage billing status
- [ ] Generate invoices; record/track payments

## 4. Acceptance Criteria (the test plan)
- [ ] Plans defined with limits/pricing and assigned
- [ ] Billing transitions and invoices/payments tracked per tenant

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-6.2`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 8. Notes & Open Questions
Subscription tier → feature mapping is **(TBC)**.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
