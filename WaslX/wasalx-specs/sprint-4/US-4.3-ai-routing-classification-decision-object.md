# US-4.3 — AI Routing: Classification & Decision Object

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Routing + Reply |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-01..04) |
| ClickUp | https://app.clickup.com/t/86caddyjz |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** to classify each inbound message and emit a strict machine-readable routing decision, **so that** downstream routing and escalation are reliable.

## 2. Context
Part of **Sprint 4 — AI Pipeline: RAG + Routing + Reply**. Context, routing, and reply suggestions — the AI differentiator. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Classify topic and language (Arabic/English/mixed)
- [ ] Detect sentiment and urgency (Egyptian dialect, mixed text)
- [ ] Detect VIP/tier and prior escalation
- [ ] Produce { route_to, priority, sentiment, vip_flag, auto_reply? }

## 4. Acceptance Criteria (the test plan)
- [ ] An angry VIP message → priority=urgent, vip_flag=true
- [ ] Decision produced within target latency, never blocking the agent

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.8`
- `US-3.4`

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
