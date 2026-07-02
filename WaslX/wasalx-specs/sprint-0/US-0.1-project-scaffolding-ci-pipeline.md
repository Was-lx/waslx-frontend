# US-0.1 — Project Scaffolding & CI Pipeline

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-0.1` |
| Track | Backend / Full-stack |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Must (High) |
| FR Traceability | Sprint 0 · Scaffolding |
| ClickUp | https://app.clickup.com/t/86caddxx1 |
| Status | Not started |

## 1. User Story
> **As a** developer on the WasalX team, **I want** a fully scaffolded repository with a CI build, **so that** everyone develops against a consistent, automated foundation from day one.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Create the Git repository, branching strategy, and a CI build
- [ ] Scaffold the Angular frontend and ASP.NET Core backend solution structure

## 4. Acceptance Criteria (the test plan)
- [ ] The application runs end-to-end (empty walking skeleton)
- [ ] CI builds the solution on every push

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- None (foundational)

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
