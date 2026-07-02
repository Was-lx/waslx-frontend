# US-2.3 — Send Outbound Messages (24h Window, Templates, Rate Limits)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-2.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Must (High) |
| FR Traceability | FR-WA (WA-03, 06, 07, 08) |
| ClickUp | https://app.clickup.com/t/86caddy44 |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** to send replies while the system respects the 24-hour window, templates, and rate limits, **so that** messages always send compliantly and without loss.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Send outbound text via the Cloud API
- [ ] Enforce the 24-hour window; block free-form outside it
- [ ] Send pre-approved templates outside the window
- [ ] Queue outbound and respect rate limits

## 4. Acceptance Criteria (the test plan)
- [ ] A free-form message outside the window is prevented; agent prompted for a template
- [ ] On rate-limit, the message is queued and retried without loss

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.1`

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
