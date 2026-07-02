# US-1.2 — Password Reset & Account Lockout

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-1.2` |
| Track | Backend / Full-stack |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Should (Normal) |
| FR Traceability | FR-AUTH (AUTH-06, AUTH-07) |
| ClickUp | https://app.clickup.com/t/86caddy0k |
| Status | Not started |

## 1. User Story
> **As a** user who forgot my password, **I want** to reset it securely and be protected against brute-force attempts, **so that** my account stays safe.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Password reset via secure, time-limited email link
- [ ] Temporary lockout after configurable consecutive failed logins

## 4. Acceptance Criteria (the test plan)
- [ ] A reset link expires after its window and works once
- [ ] The account locks temporarily after the configured threshold

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
