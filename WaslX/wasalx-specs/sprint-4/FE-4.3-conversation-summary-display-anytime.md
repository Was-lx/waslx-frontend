# FE-4.3 — Conversation Summary Display (Anytime)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.3` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-SUM (SUM-01,02,03) |
| ClickUp | https://app.clickup.com/t/86cae06qw |
| Status | Not started |

## 1. User Story
> **As an** agent, **I want** the conversation summary shown at the top of **any** conversation I open,
> **so that** I get the context instantly instead of reading the whole thread.

> **⚠️ Changed from "summary on handoff" to "summary anytime".** The summary card is available on every
> conversation, all the time — not only after a handoff.

## 2. Context
Part of **Sprint 4 — AI Pipeline**. Frontend for the always-available conversation summary. See
`PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] A **summary card/banner** at the top of any open conversation — available at all times.
- [ ] A **"Generate full summary"** action on demand (structured, longer view).
- [ ] Loading state while the summary is produced (ties into FE-4.5).

## 4. Acceptance Criteria (the test plan)
- [ ] A concise summary is available on any conversation; the full summary is available on demand.
- [ ] Works in Arabic (RTL) and English (LTR).

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-4.7` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.7`

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
