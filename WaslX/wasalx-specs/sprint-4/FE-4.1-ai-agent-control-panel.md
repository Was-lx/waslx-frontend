# FE-4.1 — AI Agent Control Panel & In-Chat Presence

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.1` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-LLM (LLM-03,04,05) |
| ClickUp | https://app.clickup.com/t/86cae06p1 |
| Status | Not started |

## 1. User Story
> **As a** tenant admin, **I want** a control panel to turn the AI Agent on/off and manage its knowledge and
> behaviour, plus a clear in-chat indicator with a "take over" action, **so that** I stay fully in control
> of what the Agent does.

> **⚠️ This replaces the old "AI reply suggestions panel (accept/edit/dismiss)" story.** There are no
> suggestion cards — the Agent replies itself; the UI is about **controlling and overseeing** it.

## 2. Context
Part of **Sprint 4 — AI Pipeline**. Frontend for **Component 1 (AI Agent)**. See `PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] **Agent control panel:** enable/disable toggle (per tenant / per number), persona & tone, business-
      knowledge upload (FAQ / catalog / documents), and the confidence threshold for handoff.
- [ ] **Monitoring view** of the conversations currently handled by the Agent.
- [ ] **In the chat:** a clear "replied by AI Agent" marker on Agent messages + a **"Take over"** button so a
      human can jump in and control the conversation.
- [ ] **Loading / typing indicator** while the Agent composes a reply (ties into FE-4.5).

## 4. Acceptance Criteria (the test plan)
- [ ] Admin can enable/disable the Agent and edit its knowledge/behaviour; changes take effect immediately.
- [ ] Agent messages are visually distinguishable from human messages.
- [ ] "Take over" hands control of the conversation to the human and stops the Agent on it.

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-4.6` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.6`

## 7. Technical Notes
- Angular + TypeScript; use the shared design system, RTL/i18n, and toast service.
- Call backend through the gateway; attach JWT via the HTTP interceptor.
- Mirror server-side RBAC in the UI (defense in depth); never trust the client alone.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
