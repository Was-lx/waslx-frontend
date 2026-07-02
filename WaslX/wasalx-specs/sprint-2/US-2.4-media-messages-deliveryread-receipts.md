# US-2.4 — Media Messages & Delivery/Read Receipts

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-2.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Should (Normal) |
| FR Traceability | FR-WA (WA-05 outbound, WA-09) |
| ClickUp | https://app.clickup.com/t/86caddy4e |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** to send/receive media and see delivery/read receipts, **so that** I can fully serve customers and know whether messages landed.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Support outbound media (image, document, audio)
- [ ] Capture and display delivery and read status

## 4. Acceptance Criteria (the test plan)
- [ ] Media sends and renders correctly
- [ ] Delivery and read status are visible per message

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.3`

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
