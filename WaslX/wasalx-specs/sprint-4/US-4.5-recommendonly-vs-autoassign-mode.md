# US-4.5 — Escalation: Recommend vs Auto-Assign Mode

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `US-4.5` |
| Track | Backend / Full-stack |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-07) |
| ClickUp | https://app.clickup.com/t/86caddymt |
| Status | Not started |

## 1. User Story
> **As an** Admin/Manager, **I want** to choose whether an **escalation** is auto-assigned to the chosen
> **agent** or only **recommended** for me to confirm, **so that** I control the AI's autonomy over the
> critical cases.

> **⚠️ Applies to escalation only.** Normal distribution of ordinary conversations is unchanged (existing
> systems). This toggle governs what happens when a case escalates (US-4.4).

> **⚠️ Role clarification:**
> - **Agent** = the entity that receives ownership and assignment.
> - **Manager/Admin** = the entity that confirms or overrides the recommendation.

## 2. Context
Part of **Sprint 4 — AI Pipeline** — **Component 3 (Classification & Escalation)**. See `PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] Configurable **escalation** mode: **recommend** (needs Manager/Admin confirmation) or **auto-assign**
- [ ] In `recommend` mode: ownership unchanged until Manager/Admin confirms; `conversationOwnershipTransferred` emitted on confirm.
- [ ] In `recommend` mode: **before Manager/Admin confirms/overrides, the current owner retains full ownership and full write access (can reply, send messages, etc.), and the customer conversation continues normally.**
- [ ] In `autoAssign` mode: ownership transfers to suggested **agent** immediately; `conversationOwnershipTransferred` emitted.
- [ ] On ownership transfer (after confirm, override, or autoAssign): previous owner loses write access immediately; conversation removed from previous owner's Active Inbox.
- [ ] On ownership transfer: new owner (**agent**) gains write access; conversation appears in new owner's Active Inbox.
- [ ] Previous owner loses all reply, message sending, resolving, and assignment actions upon ownership transfer, keeping read-only access only if permitted by workspace settings.
- [ ] Confirm endpoint: Manager/Admin only (RBAC enforced at gateway).
- [ ] Override endpoint: Manager/Admin only; accepts `assigneeId` (agent) + `reason`.
- [ ] The `conversationOwnershipTransferred` SignalR event must include: `conversationId` (int), `previousOwnerId` (int?), `newOwnerId` (int), `transitionType` (string: "Confirm" | "Override" | "AutoAssign"), `occurredAtUtc` (DateTime), and `ownershipTransferredAtUtc` (DateTime? - matching the database transition timestamp).
- [ ] All ownership changes write an `AuditLog` capturing: `ActorUserId` (who triggered it), `PreviousOwnerId`, `NewOwnerId`, `TransitionType` (Confirm, Override, AutoAssign), `Mode` (recommend/autoAssign), `OverrideReason` (if override), and `Timestamp` (DateTime).

## 4. Acceptance Criteria (the test plan)
- [ ] Recommend mode suggests the **agent** target but doesn't change ownership until Manager/Admin confirms.
- [ ] Auto mode assigns the escalated conversation automatically to the suggested **agent**.
- [ ] Previous owner loses write access immediately after ownership transfer.
- [ ] Previous owner's Active Inbox is updated (conversation removed) after ownership transfer.
- [ ] New owner's Active Inbox is updated (conversation added) after ownership transfer.
- [ ] Agent cannot call confirm/override (backend returns 403 Forbidden).
- [ ] All ownership transitions are audited.

## 5. Out of Scope
- Normal assignment of ordinary conversations (existing distribution systems).
- UI/presentation (covered by `FE-4.2`).
- Anything outside the listed Functional Requirements.

## 6. Dependencies
- `US-4.3` — provides suggested agent target.
- `FE-4.2` — renders the recommendation and confirm/override UI.

## 7. Technical Notes
- ASP.NET Core + EF Core; everything tenant-scoped; enforce RBAC at the gateway.
- Emit real-time updates via SignalR where relevant; log key actions to the audit trail.
- `conversationOwnershipTransferred` must be emitted to both previous owner and new owner for inbox sync.
- Respect WhatsApp 24h-window/template and AI-safety rules from PROJECT-CONTEXT.md.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
