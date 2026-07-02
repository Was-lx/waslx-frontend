# US-7.3 — Security Review & Data Retention

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-7.3` |
| Track | Backend / Full-stack |
| Sprint | Sprint 7 — Hardening, NFRs & Launch |
| Priority | Must (High) |
| FR Traceability | FR-SEC (SEC-01..06) · NFR-SEC-01 |
| ClickUp | https://app.clickup.com/t/86cadf5fn |
| Status | Not started |

## 1. User Story
> **As a** team, **I want** a security review and data-retention finalization, **so that** the platform is compliant and protects customer data at launch.

## 2. Context
Part of **Sprint 7 — Hardening, NFRs & Launch**. Make the product production-ready. See `PROJECT-CONTEXT.md` for the system-wide picture; this story
delivers one focused slice and must comply with every cross-cutting rule there.

## 3. Functional Requirements (the build list)
- [ ] Security review (RBAC, encryption, tenant isolation)
- [ ] Finalize data-retention (messages, vectors, audit logs)
- [ ] Confirm Meta WhatsApp policy + GDPR-like privacy compliance

## 4. Acceptance Criteria (the test plan)
- [ ] Security review passes with issues remediated
- [ ] Data-retention policy configured and enforced

## 5. Out of Scope
- UI/presentation (covered by the matching `FE-*` story).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-1.5`
- `US-1.6`

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
