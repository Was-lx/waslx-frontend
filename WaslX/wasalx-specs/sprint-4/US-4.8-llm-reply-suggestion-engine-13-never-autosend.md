# US-4.8 — LLM Reply Suggestion Engine (1–3, Never Auto-Send)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.8` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | FR-LLM (LLM-01..06) |
| ClickUp | https://app.clickup.com/t/86caddypb |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** 1–3 ready-to-send reply suggestions based on the message and context, **so that** I can respond faster while staying in control.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Assemble prompt: system + RAG context + matched FAQ/template + incoming message
- [ ] Generate 1–3 replies (gpt-4.1-mini) in correct tone/format/language
- [ ] Agent accepts/edits/dismisses; never auto-sends
- [ ] Log the sent reply back into history

## 4. Acceptance Criteria (the test plan)
- [ ] Suggestions appear within ~2s
- [ ] Suggestions are never sent without the agent's action

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
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
