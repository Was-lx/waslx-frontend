# US-2.1 — Connect WhatsApp Business Number (Cloud API)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-2.1` |
| Track | Backend / Full-stack |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Must (High) |
| FR Traceability | FR-WA (WA-01, WA-10) |
| ClickUp | https://app.clickup.com/t/86caddy37 |
| Status | Not started |

## 1. User Story
> **As a** Admin, **I want** to connect my WhatsApp Business number through the official Cloud API, **so that** the platform can send and receive messages on my behalf.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Connect a number via the Cloud API using a secure access token
- [ ] Register the inbound webhook
- [ ] Display connection/health status of each connected number

## 4. Acceptance Criteria (the test plan)
- [ ] A number connects successfully using a secure token
- [ ] The webhook is registered and number health is visible

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-1.6`

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
