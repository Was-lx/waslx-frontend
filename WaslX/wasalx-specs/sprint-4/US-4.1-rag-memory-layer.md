# US-4.1 — RAG Memory Layer

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.1` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | FR-RAG (RAG-01..06) |
| ClickUp | https://app.clickup.com/t/86caddygy |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** a RAG memory layer that embeds everything and retrieves the most relevant history just-in-time, **so that** replies are context-aware.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Embed every message/note/FAQ/catalog item (text-embedding-3-large) into SQL Server vector store
- [ ] Retrieve top-K similar prior items per customer (cosine)
- [ ] Summarize long histories (gpt-4.1) into a concise context block
- [ ] Return context to the Reply Engine; re-index each new message (memory loop)

## 4. Acceptance Criteria (the test plan)
- [ ] Retrieval completes well under 1s and does not delay suggestions
- [ ] A customer's prior orders are reflected in the context block
- [ ] After a reply, that interaction is retrievable on the next message

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.8`

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
