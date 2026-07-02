# US-7.1 — Pipeline Latency Tuning & Load/Scalability Testing

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-7.1` |
| Track | Backend / Full-stack |
| Sprint | Sprint 7 — Hardening, NFRs & Launch |
| Priority | Must (High) |
| FR Traceability | NFR-PERF-01/02 · NFR-SCAL-01 |
| ClickUp | https://app.clickup.com/t/86cadf5bb |
| Status | Not started |

## 1. User Story
> **As a** team, **I want** to tune pipeline latency and validate scalability under load, **so that** the product meets its performance targets at scale.

## 2. Context
Part of **Sprint 7 — Hardening, NFRs & Launch**. Make the product production-ready. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Tune pipeline latency (end-to-end < 2s; routing < ~1s)
- [ ] Load/scalability testing toward 10,000+ conversations/day per tenant

## 4. Acceptance Criteria (the test plan)
- [ ] Most messages complete the pipeline in < 2s
- [ ] Routing < ~1s under load

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.10`

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
