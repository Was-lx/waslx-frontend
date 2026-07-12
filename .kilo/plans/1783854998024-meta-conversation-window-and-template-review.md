# Plan: Meta 24h Conversation Window + Template Review/Category-Change

Extend the existing WaslX backend (.NET) and frontend (Angular) to implement Meta's official
24-hour conversation-window logic and the template review/category-change UX. Reuse every
existing layer; add the minimum new surface. All changes backward-compatible.

## Key codebase facts (verified)
- `Conversation` entity (`WaslX.Domain/Entities/Conversation/Conversation.cs`) has `LastMessageAt`,
  `LastReadAt`, `IsDeleted`, a lifecycle `Status` enum (New/Assigned/InProgress/Pending/Resolved/Reopened).
  It has NO window fields. The 24h window is a SEPARATE derived concept from the lifecycle status —
  do NOT add Open/Closed to `ConversationStatus` (would break `ConversationStatusTransitions`).
- `WhatsAppWebhookProcessor.HandleInboundMessageAsync` sets `conversation.LastMessageAt` on inbound
  customer messages and auto-reopens Resolved→Reopened. It does NOT touch any window field (none exists).
- `WhatsAppService.SendAsync` (`WaslX.Persistance/Services/WhatsAppService.cs:121-186`) is the SINGLE
  chokepoint for all outbound sends (text/media/template). It calls Meta FIRST (`await send(account)`,
  line 142), then find-or-creates conversation + stores message. `MessageType` param distinguishes
  Text/Media vs Template.
- Inbox agent text/media send path: `ConversationsController.SendMessage` → `ConversationService.SendTextAsync`
  → `whatsApp.SendTextAsync` → `SendAsync`. Template picker send path: `WhatsAppController.SendTemplate`
  → `SendTemplateMessageCommand` → `whatsAppService.SendTemplateAsync` → `SendAsync` (no conversationId).
- Templates are NOT stored locally. `WhatsAppTemplateService.GetTemplatesAsync` fetches live from Meta
  via `IMetaGraphApiService.ListTemplatesAsync`; `CreateTemplateAsync` posts to Meta and returns id+status.
  No template table exists.
- Webhook processor routes by JSON property (`messages`/`statuses`) and IGNORES `message_template_status_update`
  events. `IngestWhatsAppWebhookCommand.Classify` only labels "message"/"status"/"unknown".
- Frontend `ConversationDetail` model ALREADY has `windowExpiresAt` + `isWindowOpen` fields — backend
  `ConversationDetailResponse` DTO does NOT populate them yet. `chat-view.component.ts` computes
  `windowClosed` client-side from `lastInboundAt`. The composer already has `windowClosed` input that
  disables text + shows a hint + keeps the template button enabled.
- Webhook tenant resolution: inbound messages use `value.metadata.phone_number_id` (matched to
  `WhatsAppAccount.PhoneNumberId`). Template-status-update events do NOT carry phone_number_id; they
  carry `entry[].id` = WABA id (match to `WhatsAppAccount.whatsAppBusinessAccountId`).

## Decisions (confirmed with user)
1. Window state is DERIVED (computed from persisted `LastCustomerMessageAt` + `ServiceWindowExpiresAt`),
   not a new `ConversationStatus` enum value.
2. Persist two new nullable columns on `conversations`: `LastCustomerMessageAt`, `ServiceWindowExpiresAt`.
3. New minimal `TemplateReview` table (user chose full table) keyed by (TenantId, MetaTemplateId) storing
   create-time data (SubmittedCategory, AllowCategoryChange) + webhook review data (Status, ReasonCode,
   ReasonText, MetaNotes, ReviewedAt). FinalCategory/ChangedByMeta computed at read in GetTemplatesAsync
   (live Meta category vs persisted SubmittedCategory).
4. Window guard lives in `WhatsAppService.SendAsync` BEFORE the Meta call (covers all send paths uniformly).

---

## Backend tasks

### B1. New entity: TemplateReview
File: `WaslX.Domain/Entities/Template/TemplateReview.cs` (new)
- Properties: `int Id`, `int TenantId`, `string MetaTemplateId`, `string MessageTemplateName`,
  `string? Language`, `string Status` (APPROVED/PENDING/REJECTED, latest from Meta), `string? ReasonCode`,
  `string? ReasonText`, `string? MetaNotes`, `string SubmittedCategory`, `bool AllowCategoryChange`,
  `DateTime? ReviewedAt`. (BaseEntity gives CreatedAt/UpdatedAt.) `ChangedByMeta`/`FinalCategory` are
  computed at read, NOT stored. Nav: `Tenant Tenant`.
- Mark `class TemplateReview : BaseEntity`.

### B2. Configuration + DbSet + migration
- New `WaslX.Persistance/Data/Configurations/TemplateReviewConfiguration.cs`: table `template_reviews`,
  unique index on (TenantId, MetaTemplateId), column naming per existing snake_case convention.
- Add `DbSet<TemplateReview> TemplateReviews` to `ApplicationDbContext`.
- Add properties to `Conversation` entity: `DateTime? LastCustomerMessageAt`, `DateTime? ServiceWindowExpiresAt`.
- Map them in `ConversationConfiguration.cs` (`last_customer_message_at`, `service_window_expires_at`).
- Add migration `AddConversationWindowAndTemplateReview` (two nullable DateTime columns on conversations —
  safe, no data loss; new table). Update `ApplicationDbContextModelSnapshot` via `dotnet ef migrations add`.

### B3. Conversation window on inbound (webhook processor)
`WhatsAppWebhookProcessor.HandleInboundMessageAsync`: alongside the existing `conversation.LastMessageAt = timestamp`,
add:
```
conversation.LastCustomerMessageAt = timestamp;
conversation.ServiceWindowExpiresAt = timestamp.AddHours(24);
```
(Every customer message resets the timer — only customer messages, never agent.) The existing Resolved→Reopened
auto-transition stays untouched.

### B4. Template-status-update webhook handling
- `IngestWhatsAppWebhookCommand.Classify`: recognize `message_template_status_update` (check the change's
  `field`) → EventType `"template_status"`. Keep existing message/status/unknown logic.
- `WhatsAppWebhookProcessor`: in the `changes` loop, branch on `change`'s `field`. When
  `field == "message_template_status_update"`, call new `HandleTemplateStatusUpdateAsync(change, ct)`.
  This method:
  1. Reads `value.message_template_status_update` → id, message_template_name, message_template_language,
     message_template_status, reason (only on REJECTED).
  2. Resolves tenant via `entry.id` (WABA id) → match `WhatsAppAccount.whatsAppBusinessAccountId` → TenantId.
  3. Upsert `TemplateReview` by (TenantId, MetaTemplateId): set Status, ReasonText = reason (or null),
     ReasonCode = null (Meta returns a single reason string; do NOT invent a split), MetaNotes = null,
     ReviewedAt = UtcNow. If row missing (webhook beat create-audit), create it with SubmittedCategory = null.
  4. Best-effort: log + never throw (matches existing processor error handling).

### B5. DTOs + contracts
- `CreateTemplateInput` (`TemplateDtos.cs`): add `bool AllowCategoryChange`.
- `TemplateDto`: add `string? ReasonCode`, `string? ReasonText`, `string? MetaNotes`,
  `string? SubmittedCategory`, `string? FinalCategory`, `bool AllowCategoryChange`, `bool ChangedByMeta`,
  `DateTime? ReviewedAt`.
- `CreateTemplateRequest` (`WhatsAppRequests.cs`): add `bool AllowCategoryChange`.
- `ConversationDetailResponse` (`ConversationDtos.cs`): add `DateTime? WindowExpiresAt`, `bool IsWindowOpen`.

### B6. Template service: create + list merge
`WhatsAppTemplateService`:
- `CreateTemplateAsync`: include `allow_category_change = input.AllowCategoryChange` in `BuildCreatePayload`
  top-level object. After Meta create success, persist a `TemplateReview` row: TenantId, MetaTemplateId=result.Id,
  MessageTemplateName=input.Name, Language=input.Language, SubmittedCategory=input.Category,
  AllowCategoryChange=input.AllowCategoryChange, Status=result.Status (usually PENDING), ReviewedAt=null.
  (Resolve TenantId from the account resolved in `ResolveAccountAsync` — refactor to also return TenantId.)
- `GetTemplatesAsync`: after the live Meta list, load the tenant's `TemplateReview` rows into a dict by
  MetaTemplateId. Map each `TemplateDto` and merge review fields: Status (prefer live Meta status),
  ReasonCode/ReasonText/MetaNotes/ReviewedAt/SubmittedCategory/AllowCategoryChange from review row;
  FinalCategory = live Meta category; ChangedByMeta = (review?.SubmittedCategory != null && FinalCategory != review.SubmittedCategory).

### B7. Conversation detail: populate window fields
`ConversationService.GetDetailAsync`: in the projection add
`WindowExpiresAt = c.ServiceWindowExpiresAt`, `IsWindowOpen = c.ServiceWindowExpiresAt != null && DateTime.UtcNow < c.ServiceWindowExpiresAt`.
Switch `LastInboundAt` to use persisted `c.LastCustomerMessageAt` (fallback to the existing MAX subquery
if null for backward compat with rows created before migration).

### B8. Window guard (send path)
`WhatsAppService.SendAsync`: BEFORE `await send(account)` (line 142), add a read-only lookup of the
existing conversation by (tenantId, customer phone, accountId) — new private `FindExistingConversationAsync`
(NOT find-or-create). Then:
```
if (messageType != MessageType.Template) {
    var conv = await FindExistingConversationAsync(db, tid, toPhone, account.Id, ct);
    var windowOpen = conv?.ServiceWindowExpiresAt != null && DateTime.UtcNow < conv.ServiceWindowExpiresAt;
    if (!windowOpen)
        return Result.Failure<SendMessageResult>(AppErrors.ServiceWindowClosed);
}
```
Template sends skip the guard entirely (allowed when closed; do NOT update LastCustomerMessageAt — already
the case since only inbound handler sets it). Keep existing find-or-create AFTER Meta success unchanged.

### B9. New error
`AppErrors.cs`: `public static readonly Error ServiceWindowClosed = new("Conversation.ServiceWindowClosed", "The 24-hour customer service window has expired. Only approved templates can be sent.", 400);`

---

## Frontend tasks

### F1. Template model (`features/templates/models/template.model.ts`)
- `CreateTemplateInput`: add `allowCategoryChange: boolean`.
- `Template`: add `reasonCode: string | null`, `reasonText: string | null`, `metaNotes: string | null`,
  `submittedCategory: string | null`, `finalCategory: string | null`, `allowCategoryChange: boolean`,
  `changedByMeta: boolean`, `reviewedAt: string | null`.

### F2. Templates create form (`templates-list.page.ts` + `.html`)
- Add `allowCategoryChange: [true]` control to `form`.
- Include `allowCategoryChange: raw.allowCategoryChange` in the `CreateTemplateInput` built in `submit()`.
- In `.html` modal: add a checkbox (existing `ui-*` styling) after the category/language row, label
  `templateAllowCategoryChange`, hint `templateAllowCategoryChangeHint`, default checked. Reset to `true`
  in `openCreate()`.

### F3. Rejected + category-change UI (`templates-list.page.html` card)
- In the `@for (tpl of templates())` card, below status:
  - `@if (tpl.status === 'REJECTED')` block: show reason code (`tpl.reasonCode`), reason description
    (`tpl.reasonText`), Meta notes (`tpl.metaNotes`); if all null → show `templateNoReason`
    ("No reason provided by Meta.").
  - `@if (tpl.changedByMeta)` block: badge `templateCategoryChanged` + `templateRequestedCategory`
    (`tpl.submittedCategory`) → `templateFinalCategory` (`tpl.finalCategory`).
- Use existing `ui-pill` / `tmpl-badge` classes; no new design.

### F4. Chat window status + countdown (`chat-view.component.ts` + template)
- Replace `windowClosed` computed to prefer backend `detail().isWindowOpen` (inverted), falling back to
  the existing `lastInboundAt` derivation for resilience:
  `windowClosed = computed(() => detail ? !detail.isWindowOpen : <old lastInboundAt logic>)`.
- Add a ticking countdown: `remainingMs` signal updated by `setInterval` (every 30s) computing
  `windowExpiresAt - now` when window open; clear on destroy / conversation change.
- Add a status banner in the chat header (or above scroll): Open (green) + countdown, or Closed (amber).
- Composer already handles closed-state (disable text, show hint, keep template button) — keep as-is,
  just ensure `windowClosed` input is wired to the new computed.

### F5. i18n (`core/i18n/templates.i18n.ts`)
Add keys (en + ar) for: `templateAllowCategoryChange`, `templateAllowCategoryChangeHint`,
`templateRejected`, `templateReasonCode`, `templateReasonDesc`, `templateMetaNotes`, `templateNoReason`,
`templateCategoryChanged`, `templateRequestedCategory`, `templateFinalCategory`, `windowOpen`,
`windowClosed`, `windowRemaining`. Match existing tone.

### F6. No model change needed for conversation window
`conversation.model.ts` `ConversationDetail` already has `windowExpiresAt` + `isWindowOpen` — backend
now populates them. No edit required.

---

## Validation
1. Backend: `dotnet build` (WaslX.sln) passes; `dotnet ef migrations add` produces a safe migration
   (nullable columns + new table); `dotnet ef database update` applies cleanly on existing dev DB.
2. Frontend: `npm run lint` + `npm run build` (typecheck) pass.
3. Manual scenarios (per spec):
   - S1: customer msg → window opens (windowExpiresAt = now+24h, isWindowOpen=true) → agent text → allowed.
   - S2: set ServiceWindowExpiresAt to past → agent text → blocked (400 ServiceWindowClosed); UI disables
     send + shows hint; template button stays enabled.
   - S3: window closed → agent sends template → allowed; conversation stays closed (LastCustomerMessageAt unchanged).
   - S4: customer replies → LastCustomerMessageAt + ServiceWindowExpiresAt reset → isWindowOpen=true.
   - Template create with checkbox unchecked → Meta payload has `allow_category_change=false`.
   - Rejected template webhook → card shows reason (or "No reason provided by Meta.") ; category-change
     card shows requested vs final when they differ.

## Out of scope
- Campaign/AI send paths (not the inbox conversation flow); the shared `SendAsync` guard still backstops them.
- Backfilling `LastCustomerMessageAt` for pre-migration conversations — `IsWindowOpen` falls back gracefully
  (null ServiceWindowExpiresAt → closed) and `LastInboundAt` uses the MAX subquery fallback.
- No new realtime event for window changes — the inbox already reloads detail on `MessageReceived`/`ConversationChanged`.
