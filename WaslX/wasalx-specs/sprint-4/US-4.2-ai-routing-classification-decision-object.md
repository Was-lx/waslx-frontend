# US-4.2 — Message Classification & Decision Object

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.2` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-01..04) |
| ClickUp | https://app.clickup.com/t/86caddyjz |
| Status | Not started |

## 1. User Story
> **As a** system, **I want** to **classify** each inbound message and emit a strict, machine-readable
> classification result, **so that** badges, context/reporting, and **escalation** are reliable.

> **⚠️ Classification only — NOT general routing.** This story does **not** decide who a *normal* conversation
> goes to. Normal assignment stays on the **existing distribution systems** (Round Robin / By Admin /
> working-hours — from Sprints 2–3). The classification result is used for: **badges** (VIP / sentiment /
> urgency), **context & reporting**, and **detecting the critical cases that must escalate** (US-4.4).

## 2. Context
Part of **Sprint 4 — AI Pipeline** — **Component 3 (Classification & Escalation)**. See `PROJECT-CONTEXT.md`
for the system-wide picture; this story delivers one focused slice and must comply with every cross-cutting rule.

## 3. Functional Requirements (the build list)
- [ ] Classify **topic** and **language** (Arabic / English / mixed, incl. Egyptian dialect)
- [ ] Detect **sentiment** and **urgency**
- [ ] Detect **VIP/tier** and prior escalation
- [ ] Produce a strict result: `{ topic, language, sentiment, priority, vip_flag, escalate }`
- [ ] Store it in `RoutingDecision`; **do not** assign normal conversations (the existing distribution owns that)

## 4. Acceptance Criteria (the test plan)
- [ ] An angry VIP message → `priority=urgent`, `vip_flag=true`, `escalate=true`
- [ ] Classification produced **async** within target latency, never blocking the agent or the AI Agent

## 5. Out of Scope
- UI/presentation (badges are covered by `FE-4.4`).
- General assignment of normal conversations (existing distribution systems).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-2.8`
- `US-3.4`

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Uses `gpt-4.1-mini`. Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
