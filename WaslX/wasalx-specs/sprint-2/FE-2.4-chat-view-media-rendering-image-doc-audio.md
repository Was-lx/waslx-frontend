# FE-2.4 — Chat View — Media Rendering (Image / Doc / Audio)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-2.4` |
| Track | Frontend (Angular) |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Should (Normal) |
| FR Traceability | FR-WA (WA-05) |
| ClickUp | https://app.clickup.com/t/86cae06df |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** media to render inline, **so that** I can view images, documents, and audio in the chat.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Inline image/thumbnail, document cards, audio player

## 4. Acceptance Criteria (the test plan)
- [ ] Each media type renders/plays/downloads correctly

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-2.4`

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
