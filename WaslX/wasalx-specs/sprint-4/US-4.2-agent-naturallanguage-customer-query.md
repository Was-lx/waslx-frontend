# US-4.2 — Agent Natural-Language Customer Query

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.2` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Should (Normal) |
| FR Traceability | FR-RAG (RAG-07) |
| ClickUp | https://app.clickup.com/t/86caddyh6 |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** to ask a natural-language question about a customer, **so that** I can instantly recall relevant history (e.g., 'Did they complain before?').

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Accept an NL question and surface a retrieved answer from the RAG store

## 4. Acceptance Criteria (the test plan)
- [ ] An NL query returns a relevant, retrieved answer about that customer

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
