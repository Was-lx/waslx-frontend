# US-4.4 — Auto-Escalation of Urgent/VIP/Angry

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-06) · FR-NOTIF (NOTIF-02) |
| ClickUp | https://app.clickup.com/t/86caddym5 |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** to immediately escalate urgent, VIP, or angry conversations to a senior agent/supervisor, **so that** high-stakes cases get fast attention.

> **Note:** Escalation is the **AI's only distribution intervention** — normal assignment stays on the existing
> distribution systems (Round Robin / By Admin / working-hours). It is also the **AI Agent's exit path**:
> when a conversation escalates, the AI Agent (US-4.6) stops replying and hands off to the chosen human.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Classification + AI Agent**. Per-customer memory (RAG), message classification, and an autonomous AI Agent — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Escalate urgent/VIP/angry to a senior agent/supervisor
- [ ] Notify the relevant senior agent/supervisor

## 4. Acceptance Criteria (the test plan)
- [ ] An angry VIP is escalated ahead of the queue and the supervisor is notified

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.2`

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
