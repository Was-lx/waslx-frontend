# US-0.2 — Database Schema & EF Core Models/Migrations

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-0.2` |
| Track | Backend / Full-stack |
| Sprint | Sprint 0 — Project Setup & Foundations |
| Priority | Must (High) |
| FR Traceability | Sprint 0 · Database (ERD/Mapping) |
| ClickUp | https://app.clickup.com/t/86caddxxj |
| Status | Not started |

## 1. User Story
> **As a** developer, **I want** the SQL Server schema and EF Core models/migrations generated from the data mapping, **so that** all services share a single, version-controlled data model.

## 2. Context
Part of **Sprint 0 — Project Setup & Foundations**. Stand up a walking skeleton: repo, environments, database, base architecture. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Create the SQL Server schema and EF Core models/migrations from the ERD/Mapping
- [ ] Establish a migration workflow for future schema changes

## 4. Acceptance Criteria (the test plan)
- [ ] Schema is created and reproducible via migrations
- [ ] One tenant can be seeded into the database

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-0.1`

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
