# US-2.8 — Conversation Lifecycle & Status State Machine

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-2.8` |
| Track | Backend / Full-stack |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Must (High) |
| FR Traceability | FR-CONV (CONV-01..06) |
| ClickUp | https://app.clickup.com/t/86caddy5z |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** every conversation to follow a defined status state machine tied to one customer with full history, **so that** conversation tracking and handoff stay consistent.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Status: New, Assigned, In Progress, Pending, Resolved, Reopened
- [ ] Permit only valid transitions
- [ ] Assigned Agent (and Managers/Admins) can change status
- [ ] Auto-reopen a Resolved conversation on a new inbound message
- [ ] Link each conversation to one customer (by phone) with full ordered history

## 4. Acceptance Criteria (the test plan)
- [ ] Only valid transitions are allowed
- [ ] Resolved reopens automatically on new inbound
- [ ] Full ordered history is retained

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.2`

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
