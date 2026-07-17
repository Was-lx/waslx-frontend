# FE-4.4 — Escalation, VIP & Sentiment Badges

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.4` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Should (Normal) |
| FR Traceability | FR-AIR (AIR-03, 06) |
| ClickUp | https://app.clickup.com/t/86cae06ra |
| Status | Not started |

## 1. User Story
> **As a** user, **I want** VIP, sentiment, and escalation indicators in the UI, **so that** high-priority conversations stand out.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Classification + AI Agent**. Per-customer memory (RAG), message classification, and an autonomous AI Agent — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Badges/chips for VIP, sentiment, urgency
- [ ] Escalation highlight in lists and chat header

## 4. Acceptance Criteria (the test plan)
- [ ] Angry/VIP/urgent conversations are visually prioritized

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-*` story).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.2`
- `US-4.4`

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
