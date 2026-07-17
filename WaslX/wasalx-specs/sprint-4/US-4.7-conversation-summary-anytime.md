# US-4.7 — Conversation Summary (Anytime)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.7` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-SUM (SUM-01,02,03) |
| ClickUp | https://app.clickup.com/t/86caddypv |
| Status | Not started |

## 1. User Story
> **As an** agent, **I want** a quick summary of a conversation **any time I open it**, **so that** instead
> of reading the whole thread I can glance at the summary and understand the situation immediately.

> **⚠️ Changed from "summary on handoff" to "summary anytime".** The summary is **not triggered by a
> handoff** — it is available on **any** conversation, at any time. (It is of course also handy for an
> agent receiving a handoff, but the handoff is not what generates it.)

## 2. Context
Part of **Sprint 4 — AI Pipeline**. A standalone, always-available conversation summary. See
`PROJECT-CONTEXT.md` for the system-wide picture and cross-cutting rules.

## 3. Functional Requirements (the build list)
- [ ] Generate a **one-line summary** for any conversation, **on demand / anytime** (not tied to handoff).
- [ ] (Should) Generate a **full structured summary** on demand (key points · decisions · what's needed).
- [ ] Use `gpt-4.1`; cache the summary and refresh it as new messages arrive.

## 4. Acceptance Criteria (the test plan)
- [ ] Opening any conversation shows / can produce a concise summary.
- [ ] A full structured summary can be generated on demand.
- [ ] The summary reflects the latest messages (kept fresh).

## 5. Out of Scope
- UI/presentation (covered by `FE-4.3`).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.1`

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
