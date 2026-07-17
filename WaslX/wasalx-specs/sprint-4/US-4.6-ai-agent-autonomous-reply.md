# US-4.6 — AI Agent (Autonomous Customer Reply)

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.6` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-LLM (LLM-01..06) |
| ClickUp | https://app.clickup.com/t/86caddypb |
| Status | Not started |

## 1. User Story
> **As a** tenant (business owner), **I want** an AI Agent that replies to my customers on its own —
> like a human employee — using my business knowledge, which I can **enable or disable at any time**,
> **so that** customers are served 24/7 without waiting for an available agent.

> **⚠️ This replaces the old "1–3 reply suggestions (never auto-send)" story.** There are **no suggestion
> cards**; the Agent composes and **sends** the reply itself. Control stays with the tenant via the
> on/off toggle, human take-over, auto-handoff on hard cases, and a full audit trail.

## 2. Context
Part of **Sprint 4 — AI Pipeline**. This is **Component 1 (Reply)**, redefined from an assist tool into a
**full autonomous agent** that the tenant controls. Normal human assignment is unchanged (handled by the
existing distribution systems); this story is about the AI answering customers directly when enabled.
See `PROJECT-CONTEXT.md` for the system-wide picture and cross-cutting rules.

## 3. Functional Requirements (the build list)
- [ ] Per-tenant (and optionally per-number) **enable/disable toggle** for the Agent — an instant kill switch.
- [ ] Ingest the tenant's **business knowledge** (FAQ, catalog, persona/tone, policies) into the RAG store (US-4.1).
- [ ] On each inbound message while the Agent is ON: assemble the prompt (system + RAG context + business
      knowledge + incoming message) and generate a reply with `gpt-4.1-mini` in the business tone and the
      correct language (Arabic / Egyptian dialect / English / mixed).
- [ ] **Send the reply directly to the customer** via the WhatsApp Cloud API, respecting the 24-hour window
      (free text inside; an approved template outside).
- [ ] **Auto-handoff to a human** when escalation fires (VIP/angry/urgent — US-4.4), confidence is low, or the
      customer asks for a person; stop the Agent on that conversation.
- [ ] Allow a human to **take over** a conversation from the Agent at any moment.
- [ ] Log every Agent reply into conversation history (feeds the RAG memory loop) and into the **audit trail**.

## 4. Acceptance Criteria (the test plan)
- [ ] With the Agent ON, a normal inbound gets a correct, on-brand reply sent automatically within ~2s.
- [ ] Turning the Agent OFF immediately stops all autonomous replies (manual handling resumes).
- [ ] An escalation / low-confidence case is handed to a human and the Agent stops replying on it.
- [ ] Agent replies never violate the 24-hour-window rule; every Agent reply is audit-logged and marked as AI.

## 5. Out of Scope
- UI/presentation (covered by `FE-4.1` — the Agent control panel + in-chat presence).
- Normal human routing/assignment (existing distribution systems; see US-4.2/US-4.4).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.1`
- `US-4.4` (escalation → auto-handoff trigger)

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR (Agent reply, handoff, take-over); log key actions to the audit trail.
- Respect the WhatsApp 24h-window/template rules from PROJECT-CONTEXT.md — these are **external Meta
  constraints**, not optional, and apply to the Agent exactly like a human.

## 8. Notes & Open Questions
- **Confidence threshold** for auto-handoff is **(TBC)**.
- The Agent is autonomous **only while the tenant enables it**; the tenant keeps full control
  (toggle + take-over + escalation + audit). This **supersedes the older "suggestions only / never
  auto-send" rule** for Component 1 — surface this change when updating the FRS / PROJECT-CONTEXT.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
