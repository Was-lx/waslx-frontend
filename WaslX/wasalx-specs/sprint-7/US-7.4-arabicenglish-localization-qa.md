# US-7.4 — Arabic/English Localization QA

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-7.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 7 — Hardening, NFRs & Launch |
| Priority | Must (High) |
| FR Traceability | NFR-LOC-01 |
| ClickUp | https://app.clickup.com/t/86cadf5ha |
| Status | Not started |

## 1. User Story
> **As a** team, **I want** Arabic/English localization QA, **so that** the product delivers Arabic-first quality including Egyptian dialect.

## 2. Context
Part of **Sprint 7 — Hardening, NFRs & Launch**. Make the product production-ready. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] QA localization across Arabic (incl. Egyptian dialect) and English
- [ ] Validate Arabic-first AI quality (routing, replies, summaries)

## 4. Acceptance Criteria (the test plan)
- [ ] UI and AI outputs are correct/natural in Arabic, English, and mixes

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.8`

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
