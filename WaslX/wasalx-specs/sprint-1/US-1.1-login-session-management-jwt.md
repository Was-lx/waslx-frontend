# US-1.1 — Login & Session Management (JWT)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-1.1` |
| Track | Backend / Full-stack |
| Sprint | Sprint 1 — Authentication, Users & Roles |
| Priority | Must (High) |
| FR Traceability | FR-AUTH (AUTH-01..04) |
| ClickUp | https://app.clickup.com/t/86caddxzy |
| Status | Not started |

## 1. User Story
> **As a** registered user, **I want** to log in with my email and password and stay securely signed in, **so that** I can access my role-appropriate inbox.

## 2. Context
Part of **Sprint 1 — Authentication, Users & Roles**. Secure login with role-based access and tenant isolation. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Email/password login; issue JWT access token with expiry + refresh
- [ ] Store passwords using a strong one-way hash (e.g., bcrypt)
- [ ] Secure logout that invalidates the active session/token

## 4. Acceptance Criteria (the test plan)
- [ ] Valid credentials authenticate and redirect within 2s
- [ ] Invalid credentials issue no token and show a generic error
- [ ] Expired/invalidated token is rejected and forces re-auth

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
