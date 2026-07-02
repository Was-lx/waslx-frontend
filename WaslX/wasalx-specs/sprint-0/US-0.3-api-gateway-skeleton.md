# US-0.3 — API Gateway Skeleton

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-0.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Must (High) |
| FR Traceability | Sprint 0 · API Gateway |
| ClickUp | https://app.clickup.com/t/86caddxy7 |
| Status | Not started |

## 1. User Story
> **As a** developer, **I want** an API Gateway skeleton in place, **so that** authentication, RBAC, and rate limiting have a single entry point to plug into later.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Stand up the API Gateway as the front door to backend services
- [ ] Prepare hook points for auth, RBAC, and rate limiting

## 4. Acceptance Criteria (the test plan)
- [ ] Requests route through the gateway to backend services
- [ ] Gateway is ready to host cross-cutting middleware

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-0.1`

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
