# FE-4.2 — Escalation Recommendation Display & Confirm

> **Spec-Kit story spec.** Read [`PROJECT-CONTEXT.md`](../PROJECT-CONTEXT.md) first for shared
> architecture, actors, stack, and cross-cutting rules. This file is self-contained for implementation.

| Field | Value |
|---|---|
| Story ID | `FE-4.2` |
| Track | Frontend (Angular) |
| Sprint | Sprint 4 — AI Pipeline: RAG + Classification + AI Agent |
| Priority | Must (High) |
| FR Traceability | FR-AIR (AIR-05, 07) |
| ClickUp | https://app.clickup.com/t/86cae06q1 |
| Status | Not started |

## 1. User Story
> **As a** Manager/Admin, **I want** to see the AI's **escalation** recommendation (suggested **agent** + reason)
> and confirm or override it, **so that** I keep oversight of the critical cases.

> **⚠️ Escalation only.** Normal assignment is handled by the existing distribution systems and is not part
> of this screen.

> **⚠️ Role clarification:**
> - **Agent** = the entity suggested and assigned as new conversation owner.
> - **Manager/Admin** = the entity that confirms, overrides, and manages settings.

## 2. Context
Part of **Sprint 4 — AI Pipeline** — Frontend for **Component 3 (Escalation)**. See `PROJECT-CONTEXT.md`.

## 3. Functional Requirements (the build list)
- [ ] Escalation recommendation panel (suggested **agent** + reason) visible to Manager/Admin.
- [ ] Confirm / override controls (recommend mode, Manager/Admin only).
- [ ] Override dialog: selectable list shows **agents only** (not Managers/Admins).
- [ ] Previous Owner (Agent) sees banner: **"Waiting for Manager approval."** while in recommend mode, **but retains full ownership, Active Inbox membership, and full write access (can reply, send messages, resolve, assign) until confirmation or override occurs.**
- [ ] Previous Owner (Agent) sees banner: **"Conversation transferred."** after ownership change.
- [ ] Previous Owner's conversation removed from Active Inbox after ownership transfer (`conversationOwnershipTransferred`).
- [ ] Previous Owner conversation becomes read-only after transfer (no send/reply/assign).
- [ ] New Owner (Agent) receives conversation in Active Inbox after ownership transfer.
- [ ] New Owner sees toast: **"Conversation assigned to you."**
- [ ] Agent has no Confirm/Override controls; backend also enforces 403 Forbidden.
- [ ] All SignalR events handled: `escalationRecommendationUpdated`, `escalationAssignmentConfirmed`, `escalationAutoAssigned`, `escalationOverrideApplied`, `conversationOwnershipTransferred`.
- [ ] The `conversationOwnershipTransferred` event payload consists of: `conversationId` (int), `previousOwnerId` (int?), `newOwnerId` (int), `transitionType` (string: "Confirm" | "Override" | "AutoAssign"), `occurredAtUtc` (DateTime), and `ownershipTransferredAtUtc` (DateTime? - matching backend transition timestamp). The frontend updates Active Inbox membership and read-only banners accordingly.

## 4. Acceptance Criteria (the test plan)
- [ ] In recommend mode, ownership of an escalated conversation changes only after Manager/Admin confirmation.
- [ ] After ownership transfer: previous owner sees read-only state + "Conversation transferred." banner.
- [ ] After ownership transfer: previous owner's Active Inbox no longer contains the conversation.
- [ ] After ownership transfer: new owner's Active Inbox contains the conversation.
- [ ] Agent cannot trigger confirm/override via UI (controls hidden) and cannot force via API (403 returned).
- [ ] autoAssign mode: no confirm/override controls shown; assigned agent shown immediately.
- [ ] Override dialog shows only agents as selectable targets (not Managers/Admins).

## 5. Out of Scope
- Backend/API logic (covered by the linked `US-4.2` / `US-4.3` / `US-4.5` stories).
- Normal assignment (existing distribution systems).
- Business rules beyond presentation/validation.

## 6. Dependencies
- `US-4.2` — escalation signal.
- `US-4.3` — suggested agent target + reason.
- `US-4.5` — mode (recommend/autoAssign) + confirm/override endpoints + ownership transition rules.

## 7. Technical Notes
- Angular + TypeScript; use the shared design system, RTL/i18n, and toast service.
- Call backend through the gateway; attach JWT via the HTTP interceptor.
- Mirror server-side RBAC in the UI (defense in depth); never trust the client alone.
- Subscribe to `conversationOwnershipTransferred` to sync Active Inbox list in real time.
- On `conversationOwnershipTransferred`: remove from previous owner inbox, add to new owner inbox.

## 9. Definition of Done
- [ ] All Functional Requirements implemented.
- [ ] All Acceptance Criteria verified (manual + automated where feasible).
- [ ] Tenant-scoping and RBAC respected.
- [ ] Arabic/English (RTL/LTR) correct where user-facing.
- [ ] Code reviewed, merged via CI green.
