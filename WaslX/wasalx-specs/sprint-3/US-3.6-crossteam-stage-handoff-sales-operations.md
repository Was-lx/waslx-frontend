# US-3.6 — Cross-Team Stage Handoff (Sales → Operations)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-3.6` |
| Track | Backend / Full-stack |
| Sprint | Sprint 3 — Assignment, Groups/Stages & Tags |
| Priority | Must (High) |
| FR Traceability | FR-ASSIGN (ASG-04) · FR-GRP (GRP-05) |
| ClickUp | https://app.clickup.com/t/86caddy9w |
| Status | Not started |

## 1. User Story
> **As a** Agent/Manager, **I want** to hand off a finished conversation to another team, **so that** it begins a fresh stage there while preserving its full history.

## 2. Context
Part of **Sprint 3 — Assignment, Groups/Stages & Tags**. Distribute conversations across agents and teams, with stages and tags. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Reassign across groups/teams (stage handoff)
- [ ] Hand off to another team, resetting to the receiving team's first stage

## 4. Acceptance Criteria (the test plan)
- [ ] Sales-complete → Operations new-stage, owned by that team
- [ ] Original history (messages, notes) remains visible

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-3.5`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 8. Notes & Open Questions
WasalX's core differentiator.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
