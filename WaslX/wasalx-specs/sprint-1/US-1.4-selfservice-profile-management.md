# US-1.4 — Self-Service Profile Management

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-1.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Should (Normal) |
| FR Traceability | FR-USER (USER-05) |
| ClickUp | https://app.clickup.com/t/86caddy1h |
| Status | Not started |

## 1. User Story
> **As a** any user, **I want** to view and update my own profile and change my password, **so that** I can keep my account details current.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Self-service profile view/edit
- [ ] Self-service password change

## 4. Acceptance Criteria (the test plan)
- [ ] A user updates their profile and password without admin help

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
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
