# US-1.6 — Data Encryption & Tenant Plan Link

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-1.6` |
| Track | Backend / Full-stack |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Must (High) |
| FR Traceability | FR-SEC (SEC-02) · FR-TEN (TEN-04) |
| ClickUp | https://app.clickup.com/t/86caddy2n |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** all data encrypted in transit and at rest, and each tenant linked to a subscription plan, **so that** data is protected and feature access is governed by plan.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Encrypt data in transit (TLS) and at rest
- [ ] Associate each tenant with a plan (Basic/Pro/custom) governing features and limits

## 4. Acceptance Criteria (the test plan)
- [ ] All traffic over TLS; stored data encrypted at rest
- [ ] A tenant's features/limits follow its assigned plan

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-0.4`

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
