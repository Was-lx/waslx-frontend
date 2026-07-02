# US-1.5 — RBAC Enforcement at API Gateway

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-1.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Must (High) |
| FR Traceability | FR-AUTH (AUTH-05) · FR-SEC (SEC-01) |
| ClickUp | https://app.clickup.com/t/86caddy23 |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** to enforce Role-Based Access Control at the API Gateway on every request, **so that** users can only perform actions their role permits.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Enforce the Role × Permission matrix at the gateway before business logic
- [ ] Apply RBAC consistently across all features and data

## 4. Acceptance Criteria (the test plan)
- [ ] Every API request is authorized at the gateway first
- [ ] Access matches the predefined Admin/Manager/Agent matrix

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-0.3`
- `US-1.1`

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
