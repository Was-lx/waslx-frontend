# US-2.5 — Shared Team Inbox with Chat View & Context Panel

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-2.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Must (High) |
| FR Traceability | FR-INBOX (INBOX-01,02,03,06,07) |
| ClickUp | https://app.clickup.com/t/86caddy4r |
| Status | Not started |

## 1. User Story
> **As a** team member, **I want** a centralized shared inbox with a WhatsApp-like chat view and a customer context panel, **so that** the whole team can handle conversations in a familiar workspace.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Centralized shared inbox of all conversations
- [ ] WhatsApp-like chat view for reading/replying
- [ ] Agents restricted to assigned conversations; Managers/Admins see all
- [ ] Customer context panel; unread indicators; sort by recent activity

## 4. Acceptance Criteria (the test plan)
- [ ] Agents see only assigned conversations; Managers/Admins see all
- [ ] Chat view and context panel render per conversation

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
