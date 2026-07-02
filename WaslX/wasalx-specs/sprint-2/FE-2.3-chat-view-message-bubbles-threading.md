# FE-2.3 — Chat View — Message Bubbles & Threading

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-2.3` |
| Track | Frontend (Angular) |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Must (High) |
| FR Traceability | FR-INBOX (INBOX-02) · FR-CONV (CONV-06) |
| ClickUp | https://app.clickup.com/t/86cae06cr |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** a WhatsApp-style chat view, **so that** reading and replying feels familiar.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Bubbles (in/out), timestamps, status ticks, day separators
- [ ] Auto-scroll, history pagination

## 4. Acceptance Criteria (the test plan)
- [ ] Conversation renders in correct order with clear in/out distinction

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-2.5`

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
