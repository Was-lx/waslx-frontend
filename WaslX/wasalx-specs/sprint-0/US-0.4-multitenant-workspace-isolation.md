# US-0.4 — Multi-Tenant Workspace Isolation

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-0.4` |
| Track | Backend / Full-stack |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Must (High) |
| FR Traceability | FR-TEN (TEN-01, TEN-02) |
| ClickUp | https://app.clickup.com/t/86caddxyu |
| Status | Not started |

## 1. User Story
> **As a** platform, **I want** every customer business represented as an isolated tenant with tenant-scoping enforced in middleware, **so that** no business can ever access another business's data.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Implement the Tenant entity
- [ ] Implement tenant-scoping middleware so every record is scoped to its owning tenant

## 4. Acceptance Criteria (the test plan)
- [ ] Each customer business is an isolated tenant workspace
- [ ] Cross-tenant access is impossible at the data layer
- [ ] One tenant can be seeded and operated in isolation

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-0.2`
- `US-0.3`

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
