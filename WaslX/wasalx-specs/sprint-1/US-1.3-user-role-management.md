# US-1.3 — User & Role Management

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-1.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Must (High) |
| FR Traceability | FR-USER (USER-01..04, 06) |
| ClickUp | https://app.clickup.com/t/86caddy13 |
| Status | Not started |

## 1. User Story
> **As a** Admin, **I want** to create/invite users, assign a role, and activate or deactivate them, **so that** I control who has access to my tenant and at what level.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Create or invite users within the tenant
- [ ] Assign exactly one role (Admin/Manager/Agent)
- [ ] Deactivate/reactivate users; deactivated users cannot log in
- [ ] Edit a user profile and reassign role

## 4. Acceptance Criteria (the test plan)
- [ ] A deactivated user is blocked from logging in
- [ ] Each user has exactly one role from the predefined set

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
