# FE-2.7 — Template Picker & 24-Hour Window UX

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-2.7` |
| Track | Frontend (Angular) |
| Sprint | Sprint 2 — WhatsApp Integration & Shared Inbox |
| Priority | Must (High) |
| FR Traceability | FR-WA (WA-06, 07) |
| ClickUp | https://app.clickup.com/t/86cae06f0 |
| Status | Not started |

## 1. User Story
> **As a** Agent, **I want** a template picker and clear 24-hour-window cues, **so that** I always send compliantly.

## 2. Context
Part of **Sprint 2 — WhatsApp Integration & Shared Inbox**. Receive and reply to WhatsApp messages in a shared, real-time inbox. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Approved-template browser with variable fill
- [ ] Visual 24h-window state disabling free-text when closed

## 4. Acceptance Criteria (the test plan)
- [ ] Outside the window, free-text is disabled and a template is required

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-2.3`

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
