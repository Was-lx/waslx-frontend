# WaslX — ConversationWindowService & TemplateReview Enhancement
### Revision 2 — All 20 mandatory changes applied

---

## Background

Window logic currently lives in **three separate files** with the magic constants `24` and `72` hardcoded inline:

| Location | Magic Number | What It Does |
|---|---|---|
| `WhatsAppWebhookProcessor.cs` L166 | `72 : 24` | 24h or 72h on inbound message |
| `WhatsAppService.cs` L196 | `AddHours(24)` | Heal after successful send |
| `ConversationService.cs` L134 | `AddHours(24)` | Fallback expiry in detail query |

`TemplateReview` is missing: `FinalCategory`, `PauseInfo` (as JSON), `DisableTimestamp`, `DeletedAt`, `MetaStatusRaw`, and has no history/audit table.

The goal is to centralize all window business rules into one service and extend the template review system — without changing any existing API contract, routing, SignalR event, or database relationship.

---

## Architecture Principles (enforced throughout this plan)

> [!IMPORTANT]
> **Meta is the ultimate source of truth.** The local database is a high-performance synchronized cache only. Window state is derived from: inbound messages webhook, statuses webhook, `conversation.expiration_timestamp`, send responses, and error 131047. **Meta provides no "is window open?" query endpoint — never attempt one.**

> [!IMPORTANT]
> **Templates never reopen the customer service window.** Only an inbound customer message opens or resets the window. A template send must never write to `LastCustomerMessageAt` or `WindowExpiresAt`.

> [!NOTE]
> **Hybrid strategy is preserved.** Database handles fast UI, inbox, countdown, and filtering. Meta handles official webhook events, expiration timestamps, send validation, and template lifecycle. Both remain synchronized.

---

## User Review Required

> [!IMPORTANT]
> **One new database migration is required.** Changes are additive only — new nullable columns and one new table. No existing column is renamed, removed, or made non-nullable. The migration is safe to run on production without downtime.

> [!WARNING]
> **`ConversationWindowService` must NOT call `db.SaveChangesAsync()` or publish to SignalR.** It only mutates the in-memory entity. The caller (webhook processor, WhatsApp service) is fully responsible for persistence and real-time notifications. This is a deliberate design rule for testability.

> [!NOTE]
> **No existing API contracts change.** `ConversationDetailResponse` gains two new fields (`WindowType`, `RemainingSeconds`). `TemplateDto` gains new nullable fields. Angular models extend accordingly. No existing binding is removed.

---

## Open Questions

> [!NOTE]
> **All open questions from Revision 1 are resolved by the mandatory changes:**
> - `WindowType` → persisted as a `ConversationWindowType` enum (stored as string via EF conversion).
> - `ConversationSource` → **removed entirely**.
> - "Ask Meta if window open" → **removed entirely**. No Meta HTTP call in window evaluation.
> - `SaveChanges` / SignalR → caller responsibility only.

---

## Proposed Changes

---

### Component 1 — Domain Layer (`WaslX.Domain`)

---

#### [NEW] `WaslX.Domain/SharedEnums/ConversationWindowType.cs`

A strongly typed enum stored as a string column via EF value conversion.

```csharp
namespace WaslX.Domain.SharedEnums;

/// <summary>
/// Classifies the type of the currently active (or most recent) WhatsApp conversation window.
///
/// ARCHITECTURE NOTE:
///   This value is a cached classification only. Meta is the ultimate source of truth.
///   Never make business decisions based solely on this enum — always consider WindowExpiresAt
///   in conjunction with the current UTC time.
///
///   CustomerService24h — started by any inbound customer message without a referral object.
///   FreeEntryPoint72h  — started by an inbound message carrying a Meta referral object
///                        (Click-to-WhatsApp Ad, Facebook/Instagram Page CTA).
/// </summary>
public enum ConversationWindowType
{
    None,
    CustomerService24h,
    FreeEntryPoint72h
}
```

---

#### [MODIFY] [Conversation.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Domain/Entities/Conversation/Conversation.cs)

Add one new property using the enum type:

```diff
+        /// <summary>
+        /// Cached window type set on every inbound message. None = no window ever opened.
+        /// ARCHITECTURE NOTE: treat as a cache — WindowExpiresAt + UtcNow is the authoritative state.
+        /// </summary>
+        public ConversationWindowType WindowType { get; set; } = ConversationWindowType.None;
```

---

#### [MODIFY] [TemplateReview.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Domain/Entities/Template/TemplateReview.cs)

Extend with the full Meta template lifecycle fields. **`SubmittedCategory` is never overwritten.**

```diff
+        // ── Category tracking ─────────────────────────────────────────────────────
+        /// <summary>
+        /// Category Meta assigned at review time. Null when unchanged or not yet reviewed.
+        /// SubmittedCategory is NEVER overwritten — this pair preserves the full audit trail.
+        /// </summary>
+        public string? FinalCategory { get; set; }

+        // ── Pause / Disable / Delete lifecycle ────────────────────────────────────
+        /// <summary>Raw JSON blob from Meta's pause_info object. Null when not paused.</summary>
+        public string? PauseInfo { get; set; }

+        /// <summary>UTC timestamp when Meta disabled the template. Null when not disabled.</summary>
+        public DateTime? DisableTimestamp { get; set; }

+        /// <summary>
+        /// Soft-delete timestamp. Null = active row.
+        /// NEVER hard-delete. History must remain available.
+        /// </summary>
+        public DateTime? DeletedAt { get; set; }

+        /// <summary>
+        /// The complete raw JSON string from the Meta webhook that triggered the last status change.
+        /// Stored verbatim so no future Meta fields are ever lost.
+        /// </summary>
+        public string? MetaStatusRaw { get; set; }
```

---

#### [NEW] `WaslX.Domain/Entities/Template/TemplateReviewHistory.cs`

Immutable audit log — one row per lifecycle event. **Rows are never updated or deleted.**

```csharp
using WaslX.Domain.Common;

namespace WaslX.Domain.Entities;

/// <summary>
/// Immutable audit log of every Meta template lifecycle event for a given template.
/// One row is appended on every status change (PENDING → APPROVED → PAUSED → DISABLED → DELETED …).
/// Rows are NEVER modified or deleted — this is a permanent history record.
/// </summary>
public class TemplateReviewHistory : BaseEntity
{
    public int TemplateReviewId { get; set; }
    public int TenantId { get; set; }

    /// <summary>The new status that arrived in this event (APPROVED, REJECTED, PAUSED, …).</summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>UTC time this event was recorded locally.</summary>
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public string? ReasonCode { get; set; }
    public string? ReasonText { get; set; }

    /// <summary>
    /// The category Meta reported in this event's payload (may differ from SubmittedCategory).
    /// </summary>
    public string? FinalCategory { get; set; }

    /// <summary>Raw JSON of Meta's pause_info object when Status = PAUSED.</summary>
    public string? PauseInfo { get; set; }

    /// <summary>Complete raw webhook JSON that generated this event. Never truncated.</summary>
    public string? MetaStatusRaw { get; set; }

    // Navigation
    public TemplateReview TemplateReview { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
}
```

---

### Component 2 — Application Layer (`WaslX.Application`)

---

#### [NEW] `WaslX.Application/Abstractions/WhatsApp/ConversationWindowConstants.cs`

**Single authoritative location for the hour constants.** No other file may hardcode `24` or `72`.

```csharp
namespace WaslX.Application.Abstractions.WhatsApp;

/// <summary>
/// Authoritative constants for WhatsApp conversation window durations.
///
/// ARCHITECTURE NOTE:
///   These values reflect Meta's official conversation window policy.
///   Do NOT copy these values into other files — reference this class.
///   CustomerServiceHours  = 24h Customer Service Window (any inbound message, no referral).
///   FreeEntryPointHours   = 72h Free Entry Point Window (inbound with Meta referral object).
///   Meta is the source of truth; these constants are a local mirror of documented policy.
/// </summary>
public static class ConversationWindowConstants
{
    /// <summary>24-hour Customer Service Window — started by any customer inbound message.</summary>
    public const int CustomerServiceHours = 24;

    /// <summary>
    /// 72-hour Free Entry Point Window — started when the inbound message payload
    /// contains a Meta referral object (Click-to-WhatsApp Ad / Facebook/Instagram Page CTA).
    /// </summary>
    public const int FreeEntryPointHours = 72;
}
```

---

#### [NEW] `WaslX.Application/Abstractions/WhatsApp/ConversationWindowState.cs`

The single immutable model returned by `IConversationWindowService`. **No SaveChanges, no SignalR.**

```csharp
using WaslX.Domain.SharedEnums;

namespace WaslX.Application.Abstractions.WhatsApp;

/// <summary>
/// Immutable snapshot of a conversation's window state at evaluation time.
/// Produced by IConversationWindowService — callers treat it as read-only.
///
/// ARCHITECTURE NOTE:
///   CanSendTemplate is always true — templates bypass the customer service window entirely.
///   CanSendFreeForm / CanSendText / CanSendMedia / CanSendInteractive are only true when IsOpen.
///   This is the single place that expresses Meta's window policy in code.
/// </summary>
public sealed record ConversationWindowState
{
    public bool IsOpen { get; init; }

    // ── Send capabilities ─────────────────────────────────────────────────────
    public bool CanSendFreeForm      => IsOpen;
    public bool CanSendText          => IsOpen;
    public bool CanSendMedia         => IsOpen;
    public bool CanSendInteractive   => IsOpen;

    /// <summary>
    /// Templates may always be sent regardless of window state.
    /// ARCHITECTURE NOTE: A template send NEVER reopens the customer service window.
    /// </summary>
    public bool CanSendTemplate      => true;

    // ── Window timing ─────────────────────────────────────────────────────────
    public TimeSpan RemainingTime    { get; init; }
    public DateTime? WindowExpiresAt { get; init; }

    // ── Classification ────────────────────────────────────────────────────────
    /// <summary>
    /// Cached window type. ARCHITECTURE NOTE: treat as a hint — IsOpen is the authoritative state.
    /// WindowType alone must never drive send/reject decisions.
    /// </summary>
    public ConversationWindowType WindowType { get; init; }
}
```

---

#### [NEW] `WaslX.Application/Abstractions/WhatsApp/IConversationWindowService.cs`

**Central interface. No `SaveChanges`. No SignalR. No Meta HTTP calls.**

```csharp
using WaslX.Domain.Entities;
using WaslX.Domain.SharedEnums;

namespace WaslX.Application.Abstractions.WhatsApp;

/// <summary>
/// Single owner of all WhatsApp conversation window business rules.
///
/// CONTRACT RULES (enforced by design):
///   1. This service NEVER calls SaveChangesAsync — the caller owns persistence.
///   2. This service NEVER publishes to SignalR — the caller owns notifications.
///   3. This service NEVER calls the Meta API — window state comes from webhooks only.
///      Meta provides no "is window open?" endpoint; never attempt one.
///   4. All hour constants are defined in ConversationWindowConstants only.
///   5. All methods that mutate the entity write to the in-memory object only.
///
/// HYBRID STRATEGY:
///   Local DB = high-performance cache for UI, inbox, countdown, filtering.
///   Meta     = authoritative source via webhooks, expiration_timestamp, error 131047.
/// </summary>
public interface IConversationWindowService
{
    // ── Called by the inbound webhook processor ───────────────────────────────

    /// <summary>
    /// Processes an inbound customer message.
    /// Writes LastCustomerMessageAt, WindowExpiresAt, and WindowType to the entity.
    /// hasReferral=true → FreeEntryPoint72h; false → CustomerService24h.
    ///
    /// ARCHITECTURE NOTE: Customer inbound messages are the ONLY trigger that opens or resets
    /// the window. Agent sends, template sends, and status webhooks do not open a new window.
    ///
    /// Does NOT call SaveChanges. Does NOT notify SignalR.
    /// </summary>
    ConversationWindowState UpdateFromInboundMessage(
        Conversation conversation,
        DateTime messageTimestamp,
        bool hasReferral);

    // ── Called by the status webhook handler ──────────────────────────────────

    /// <summary>
    /// Incorporates Meta's authoritative expiration_timestamp.
    /// Extend-only: WindowExpiresAt is never reduced by this method.
    /// If metaExpiry is null, older than current WindowExpiresAt, or equal to it, no change is made.
    /// Writes WindowExpiresAt to the entity only when it would extend the existing value.
    ///
    /// Does NOT call SaveChanges. Does NOT notify SignalR.
    /// </summary>
    ConversationWindowState? UpdateFromMetaStatus(
        Conversation conversation,
        DateTime? metaExpiry);

    // ── Called after a successful free-form send ──────────────────────────────

    /// <summary>
    /// Self-heals a stale local window after Meta accepted a free-form (non-template) message.
    /// A successful send proves Meta considers the window open, so we reconcile the local mirror.
    ///
    /// Rules:
    ///   - NEVER called for template sends (templates do not prove the free-form window is open).
    ///   - NEVER reduces WindowExpiresAt (extend-only).
    ///   - NEVER overwrites a valid 72h FreeEntryPoint window with a shorter 24h heal.
    ///   - Heal target = LastCustomerMessageAt + 24h (fallback: UtcNow + 24h).
    ///   - If healed value ≤ current WindowExpiresAt, no write occurs.
    ///
    /// Does NOT call SaveChanges. Does NOT notify SignalR.
    /// </summary>
    ConversationWindowState SynchronizeAfterSuccessfulSend(Conversation conversation);

    // ── Called when Meta returns error 131047 ─────────────────────────────────

    /// <summary>
    /// Collapses the local window when Meta rejected a free-form send with error 131047
    /// (window closed). Sets WindowExpiresAt = DateTime.UtcNow on the entity.
    /// If conversation is null (no prior inbound from this phone), does nothing.
    /// If WindowExpiresAt is already in the past, does nothing (idempotent).
    ///
    /// Does NOT call SaveChanges. Does NOT notify SignalR.
    /// </summary>
    void SynchronizeAfterFailedSend(Conversation? conversation);

    // ── Read-only evaluation (no writes) ─────────────────────────────────────

    /// <summary>
    /// Returns the current window state from the conversation's persisted fields.
    /// Pure computation — no DB access, no Meta calls, no writes.
    /// </summary>
    ConversationWindowState EvaluateConversation(Conversation conversation);

    /// <summary>Time remaining until the window closes. Zero when closed or never opened.</summary>
    TimeSpan CalculateRemainingTime(Conversation conversation);

    /// <summary>Maps the persisted WindowType enum to the canonical type.</summary>
    ConversationWindowType DetermineWindowType(Conversation conversation);
}
```

---

#### [MODIFY] [ConversationDtos.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Application/Features/Conversations/Dtos/ConversationDtos.cs)

Extend `ConversationDetailResponse` — two new fields, no removals:

```diff
 public record ConversationDetailResponse(
     int Id,
     string CustomerName,
     string CustomerPhone,
     bool CustomerVip,
     string Status,
     IReadOnlyList<string> AllowedTransitions,
     int? AssignedUserId,
     string? AssignedUserName,
     IReadOnlyList<string> Tags,
     DateTime CreatedAt,
     DateTime? LastMessageAt,
     DateTime? LastInboundAt,
     DateTime? WindowExpiresAt,
     bool IsWindowOpen,
+    string WindowType,          // ConversationWindowType enum ToString() — "None" | "CustomerService24h" | "FreeEntryPoint72h"
+    long RemainingSeconds,      // seconds until expiry; 0 when closed. Frontend uses this for countdown.
     int MessageCount);
```

---

#### [MODIFY] [TemplateDtos.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Application/Features/WhatsApp/Templates/Dtos/TemplateDtos.cs)

Extend `TemplateDto` — all new fields are nullable, no existing fields change:

```diff
 public record TemplateDto(
     string Id,
     string Name,
     string Language,
     string Category,
     string Status,
     string? HeaderText,
     string? BodyText,
     string? FooterText,
     IReadOnlyList<TemplateButtonDto> Buttons,
     string? ReasonCode,
     string? ReasonText,
     string? MetaNotes,
     string? SubmittedCategory,
     string? FinalCategory,
     bool AllowCategoryChange,
     bool ChangedByMeta,
     DateTime? ReviewedAt,
+    string? PauseInfo,           // raw JSON from Meta pause_info; null when not paused
+    DateTime? DisableTimestamp,  // UTC when Meta disabled the template; null when not disabled
+    bool IsDeleted,              // true when soft-deleted (DeletedAt is set)
     string? HeaderFormat = null);
```

---

### Component 3 — Persistance Layer (`WaslX.Persistance`)

---

#### [NEW] `WaslX.Persistance/Services/ConversationWindowService.cs`

Concrete implementation. All 24/72 values consumed from `ConversationWindowConstants` only.

**Key implementation points:**

**`UpdateFromInboundMessage`**
```
hours = hasReferral ? FreeEntryPointHours : CustomerServiceHours
conversation.LastCustomerMessageAt = messageTimestamp
conversation.WindowExpiresAt = messageTimestamp.AddHours(hours)
conversation.WindowType = hasReferral ? FreeEntryPoint72h : CustomerService24h
Log: [Window] {trigger} | ConvId={id} CustId={custId} Type={type} Old={old} New={new} At={utc}
return EvaluateConversation(conversation)
```

**`UpdateFromMetaStatus`**
```
if metaExpiry is null → return null (no change)
if metaExpiry <= conversation.WindowExpiresAt → return null (never reduce; idempotent)
conversation.WindowExpiresAt = metaExpiry
Log: [Window] StatusWebhook | ConvId={id} Old={old} New={new} Reason=MetaExpirationTimestamp
return EvaluateConversation(conversation)
```

**`SynchronizeAfterSuccessfulSend`**
```
healed = conversation.LastCustomerMessageAt?.AddHours(CustomerServiceHours)
          ?? DateTime.UtcNow.AddHours(CustomerServiceHours)
if (healed <= conversation.WindowExpiresAt) → no-op (never reduce, never overwrite 72h)
conversation.WindowExpiresAt = healed
Log: [Window] SuccessfulSend | ConvId={id} Old={old} New={healed} Reason=HealedAfterAcceptedSend
return EvaluateConversation(conversation)
```

**`SynchronizeAfterFailedSend`**
```
if (conversation is null) → return
if (conversation.WindowExpiresAt <= DateTime.UtcNow) → return (already closed, idempotent)
old = conversation.WindowExpiresAt
conversation.WindowExpiresAt = DateTime.UtcNow
Log: [Window] Error131047 | ConvId={id} Old={old} New=UtcNow Reason=WindowClosedByMeta
```

**`EvaluateConversation`**
```
expiry = WindowExpiresAt ?? LastCustomerMessageAt?.AddHours(CustomerServiceHours)
isOpen = expiry != null && expiry > DateTime.UtcNow
remaining = isOpen ? expiry - UtcNow : TimeSpan.Zero
return new ConversationWindowState { IsOpen, RemainingTime=remaining, WindowExpiresAt=expiry, WindowType }
```

**`CalculateRemainingTime` / `DetermineWindowType`** — thin wrappers calling the above.

**Structured log format (every method):**
```
[Window] {Trigger} | ConvId={ConversationId} CustId={CustomerId} Type={WindowType}
                     Old={OldExpiration:O} New={NewExpiration:O} At={UtcNow:O} Reason={Reason}
```

Trigger values: `InboundMessage`, `Referral72h`, `StatusWebhook`, `SuccessfulSend`, `Error131047`.

---

#### [MODIFY] [WhatsAppWebhookProcessor.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Services/WhatsAppWebhookProcessor.cs)

**Constructor:** add `IConversationWindowService windowService`.

**`HandleInboundMessageAsync`** — replace inline block:
```diff
-        var windowHours = message.TryGetProperty("referral", out _) ? 72 : 24;
-        conversation.LastCustomerMessageAt = timestamp;
-        conversation.WindowExpiresAt = timestamp.AddHours(windowHours);
+        var hasReferral = message.TryGetProperty("referral", out _);
+        windowService.UpdateFromInboundMessage(conversation, timestamp, hasReferral);
         // ── caller (this method) owns SaveChanges ──────────────────────────────
```

**`HandleStatusAsync`** — replace inline block:
```diff
-        if (conversation is not null && ExtractConversationExpiry(status) is { } metaExpiry &&
-            (conversation.WindowExpiresAt is null || metaExpiry > conversation.WindowExpiresAt))
-            conversation.WindowExpiresAt = metaExpiry;
+        if (conversation is not null)
+            windowService.UpdateFromMetaStatus(conversation, ExtractConversationExpiry(status));
         // ── caller (this method) owns SaveChanges ──────────────────────────────
```

**`HandleTemplateStatusUpdateAsync`** — extend the upsert to handle new statuses and store `MetaStatusRaw`:

```diff
+        // Capture raw payload for audit — never lose Meta data.
+        var rawJson = value.GetRawText();

         if (review is null)
         {
             review = new TemplateReview { ..., MetaStatusRaw = rawJson };
         }
         else
         {
             review.Status = newStatus;
+            review.MetaStatusRaw = rawJson;

+            // FinalCategory: set when Meta reports a different category than we submitted.
+            if (!string.IsNullOrEmpty(newStatus))
+            {
+                var metaCategory = update.TryGetProperty("message_template_category", out var catEl)
+                    ? catEl.GetString() : null;
+                if (metaCategory is not null && !string.Equals(metaCategory, review.SubmittedCategory,
+                        StringComparison.OrdinalIgnoreCase))
+                {
+                    review.FinalCategory = metaCategory;
+                    // ChangedByMeta is derived at read time (FinalCategory != SubmittedCategory);
+                    // no separate bool is persisted to avoid drift.
+                }
+            }

+            // Lifecycle fields
+            if (newStatus == "PAUSED" && update.TryGetProperty("pause_info", out var piEl))
+                review.PauseInfo = piEl.GetRawText();

+            if (newStatus == "DISABLED")
+                review.DisableTimestamp ??= DateTime.UtcNow;

+            if (newStatus is "DELETED")
+                review.DeletedAt ??= DateTime.UtcNow;
         }

+        // Append an immutable history event — one row per status change, never edited.
+        var historyEvent = new TemplateReviewHistory
+        {
+            TemplateReviewId = review.Id,          // 0 on first insert; EF handles FK after SaveChanges
+            TenantId         = account.TenantId,
+            Status           = newStatus,
+            ChangedAt        = now,
+            ReasonCode       = review.ReasonCode,
+            ReasonText       = reason,
+            FinalCategory    = review.FinalCategory,
+            PauseInfo        = review.PauseInfo,
+            MetaStatusRaw    = rawJson
+        };
+        await db.TemplateReviewHistories.AddAsync(historyEvent, cancellationToken);
```

> [!NOTE]
> When `review` is newly created (no prior row), the `TemplateReviewHistory.TemplateReviewId` FK will be set in a second SaveChanges pass, or via a navigation property if EF resolves it automatically. The simplest correct implementation is: `db.SaveChangesAsync()` after adding the review, then set `historyEvent.TemplateReviewId = review.Id`, then `db.SaveChangesAsync()` again.

---

#### [MODIFY] [WhatsAppService.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Services/WhatsAppService.cs)

**Constructor:** add `IConversationWindowService windowService`.

**`SendAsync` — 131047 block:**
```diff
-                if (closedConversation is not null &&
-                    (closedConversation.WindowExpiresAt is null || closedConversation.WindowExpiresAt > DateTime.UtcNow))
-                {
-                    closedConversation.WindowExpiresAt = DateTime.UtcNow;
-                    await db.SaveChangesAsync(cancellationToken);
-                }
+                windowService.SynchronizeAfterFailedSend(closedConversation);
+                // ── caller (SendAsync) owns SaveChanges ────────────────────────────────
+                if (closedConversation is not null)
+                    await db.SaveChangesAsync(cancellationToken);
```

**`SendAsync` — heal block:**
```diff
-        if (messageType != MessageType.Template)
-        {
-            var healed = conversation.LastCustomerMessageAt is { } anchor ? anchor.AddHours(24) : now.AddHours(24);
-            if (conversation.WindowExpiresAt is null || healed > conversation.WindowExpiresAt)
-                conversation.WindowExpiresAt = healed;
-        }
+        // ARCHITECTURE NOTE: only free-form sends prove the window is open.
+        // Template sends are never used to heal the window — templates bypass the window entirely.
+        if (messageType != MessageType.Template)
+            windowService.SynchronizeAfterSuccessfulSend(conversation);
+        // ── caller (SendAsync) owns SaveChanges below ──────────────────────────────
```

---

#### [MODIFY] [ConversationService.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Services/ConversationService.cs)

**Constructor:** add `IConversationWindowService windowService`.

**`GetDetailAsync`** — replace the inline window calculation (two lines) with a service call:

```diff
-        var windowExpiresAt = detail.WindowExpiresAt ?? detail.LastInboundAt?.AddHours(24);
-        var isWindowOpen = windowExpiresAt is not null && windowExpiresAt > DateTime.UtcNow;
+        // Build a lightweight transient entity to drive the window service. No DB write.
+        var transient = new Conversation
+        {
+            LastCustomerMessageAt = detail.LastInboundAt,
+            WindowExpiresAt       = detail.WindowExpiresAt,
+            WindowType            = detail.WindowType
+        };
+        var windowState = windowService.EvaluateConversation(transient);
```

Pass `windowState.WindowType.ToString()` and `(long)windowState.RemainingTime.TotalSeconds` into the DTO constructor.

**DB projection** — add `WindowType` to the anonymous select:
```diff
     .Select(c => new
     {
         ...
+        c.WindowType,
         c.WindowExpiresAt,
     })
```

---

#### [MODIFY] [WhatsAppTemplateService.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Services/WhatsAppTemplateService.cs)

**`GetTemplatesAsync`** — exclude soft-deleted reviews from the lookup:
```diff
-        var reviews = await db.TemplateReviews
-            .Where(r => r.TenantId == tid)
-            .ToDictionaryAsync(r => r.MetaTemplateId, cancellationToken);
+        var reviews = await db.TemplateReviews
+            .Where(r => r.TenantId == tid && r.DeletedAt == null)
+            .ToDictionaryAsync(r => r.MetaTemplateId, cancellationToken);
```

**`Map`** — populate new `TemplateDto` fields:
```diff
         return new TemplateDto(
             ...
+            PauseInfo:          review?.PauseInfo,
+            DisableTimestamp:   review?.DisableTimestamp,
+            IsDeleted:          review?.DeletedAt is not null,
             HeaderFormat:       header?.Format?.ToUpperInvariant());
```

The `FinalCategory` / `ChangedByMeta` fields already derive from `review.FinalCategory` vs `t.Category` (live Meta value). That existing logic remains unchanged.

---

#### [NEW] `WaslX.Persistance/Data/Configurations/TemplateReviewHistoryConfiguration.cs`

EF table mapping for the new audit table:

```csharp
builder.ToTable("template_review_history");
builder.HasKey(x => x.Id);
builder.Property(x => x.Id).HasColumnName("template_review_history_id");
builder.Property(x => x.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
builder.Property(x => x.ChangedAt).HasColumnName("changed_at").IsRequired();
builder.Property(x => x.ReasonCode).HasColumnName("reason_code").HasMaxLength(100);
builder.Property(x => x.ReasonText).HasColumnName("reason_text").HasMaxLength(1000);
builder.Property(x => x.FinalCategory).HasColumnName("final_category").HasMaxLength(50);
builder.Property(x => x.PauseInfo).HasColumnName("pause_info");                 // no MaxLength — raw JSON
builder.Property(x => x.MetaStatusRaw).HasColumnName("meta_status_raw");        // no MaxLength — raw JSON
builder.HasOne(x => x.TemplateReview).WithMany().HasForeignKey(x => x.TemplateReviewId).OnDelete(DeleteBehavior.Restrict);
builder.HasOne(x => x.Tenant).WithMany().HasForeignKey(x => x.TenantId).OnDelete(DeleteBehavior.Restrict);
// Index for history retrieval by review + time
builder.HasIndex(x => new { x.TemplateReviewId, x.ChangedAt });
```

---

#### [MODIFY] [TemplateReviewConfiguration.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Data/Configurations/TemplateReviewConfiguration.cs)

Map the new columns:

```diff
+        builder.Property(x => x.FinalCategory).HasColumnName("final_category").HasMaxLength(50);
+        builder.Property(x => x.PauseInfo).HasColumnName("pause_info");        // raw JSON, no MaxLength
+        builder.Property(x => x.DisableTimestamp).HasColumnName("disable_timestamp");
+        builder.Property(x => x.DeletedAt).HasColumnName("deleted_at");
+        builder.Property(x => x.MetaStatusRaw).HasColumnName("meta_status_raw"); // raw JSON, no MaxLength
```

---

#### [MODIFY] [ConversationConfiguration.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Data/Configurations/ConversationConfiguration.cs)

Map the new enum column:

```diff
+        builder.Property(x => x.WindowType)
+               .HasConversion<string>()
+               .HasColumnName("window_type")
+               .HasMaxLength(50)
+               .HasDefaultValue(ConversationWindowType.None);
```

---

#### [MODIFY] [ApplicationDbContext.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/Data/ApplicationDbContext.cs)

```diff
+        public DbSet<TemplateReviewHistory> TemplateReviewHistories { get; set; }
```

---

#### [MODIFY] [DependencyInjection.cs](file:///d:/ITI_Materials/GP/notNet/backend/WaslX/WaslX.Persistance/DependencyInjection.cs)

```diff
+        services.AddScoped<IConversationWindowService, ConversationWindowService>();
```

---

### Component 4 — Database Migration

---

#### [NEW] EF Core migration: `AddWindowTypeAndTemplateReviewLifecycle`

**`conversations` table — one new nullable column:**
```sql
ALTER TABLE conversations
    ADD window_type nvarchar(50) NULL DEFAULT 'None';
```

**`template_reviews` table — five new nullable columns:**
```sql
ALTER TABLE template_reviews ADD final_category     nvarchar(50)    NULL;
ALTER TABLE template_reviews ADD pause_info         nvarchar(max)   NULL;
ALTER TABLE template_reviews ADD disable_timestamp  datetime2       NULL;
ALTER TABLE template_reviews ADD deleted_at         datetime2       NULL;
ALTER TABLE template_reviews ADD meta_status_raw    nvarchar(max)   NULL;
```

**New `template_review_history` table:**
```sql
CREATE TABLE template_review_history (
    template_review_history_id  int IDENTITY(1,1) PRIMARY KEY,
    TemplateReviewId            int NOT NULL REFERENCES template_reviews(template_review_id),
    TenantId                    int NOT NULL REFERENCES tenants(tenant_id),
    status                      nvarchar(50)    NOT NULL,
    changed_at                  datetime2       NOT NULL,
    reason_code                 nvarchar(100)   NULL,
    reason_text                 nvarchar(1000)  NULL,
    final_category              nvarchar(50)    NULL,
    pause_info                  nvarchar(max)   NULL,
    meta_status_raw             nvarchar(max)   NULL,
    CreatedAt                   datetime2       NOT NULL,
    UpdatedAt                   datetime2       NULL
);
CREATE INDEX IX_template_review_history_review_changed
    ON template_review_history (TemplateReviewId, changed_at);
```

All changes are additive. No existing column is modified. Safe to run on production without downtime.

---

### Component 5 — Frontend (`WaslX` Angular)

---

#### [MODIFY] [conversation.model.ts](file:///d:/ITI_Materials/GP/Front2/waslx-frontend/WaslX/src/app/features/inbox/models/conversation.model.ts)

```diff
   windowExpiresAt: string | null;
   isWindowOpen: boolean;
+  /** "None" | "CustomerService24h" | "FreeEntryPoint72h" */
+  windowType: string | null;
+  /** Seconds remaining until window closes. 0 when closed. Frontend uses for countdown display. */
+  remainingSeconds: number;
   messageCount: number;
```

---

#### [MODIFY] [template.model.ts](file:///d:/ITI_Materials/GP/Front2/waslx-frontend/WaslX/src/app/features/templates/models/template.model.ts)

```diff
   reviewedAt: string | null;
+  pauseInfo: string | null;
+  disableTimestamp: string | null;
+  isDeleted: boolean;
```

---

#### [MODIFY] [chat-view.component.ts](file:///d:/ITI_Materials/GP/Front2/waslx-frontend/WaslX/src/app/features/inbox/components/chat-view/chat-view.component.ts)

Add a `windowTypeLabel` computed signal used only for the header badge label.
The badge already shows open/closed — this adds the type text next to it:

```typescript
protected readonly windowTypeLabel = computed(() => {
  const wt = this.detail()?.windowType;
  if (wt === 'FreeEntryPoint72h') return this.t('window72h');   // new translation key
  if (wt === 'CustomerService24h') return this.t('window24h');  // new translation key
  return '';
});
```

The `countdown` computed already ticks every 30 s off `windowExpiresAt`. The `remainingSeconds` from the server is used only as the initial server-side check; the frontend countdown continues locally.

---

#### [MODIFY] [context-panel.component.ts](file:///d:/ITI_Materials/GP/Front2/waslx-frontend/WaslX/src/app/features/inbox/components/context-panel/context-panel.component.ts)

Add a **Window Info** row inside the existing `ctx__snapshot` section:

```html
<!-- Window type and expiry — shown below the existing Message/Created/Last Active row -->
@if (d.windowType && d.windowType !== 'None') {
  <div>
    <span class="ctx__label">{{ t('ctxWindowType') }}</span>
    <span class="ctx__stat">{{ windowTypeLabel(d.windowType) }}</span>
  </div>
}
@if (d.windowExpiresAt) {
  <div>
    <span class="ctx__label">{{ t('ctxWindowExpires') }}</span>
    <span class="ctx__stat">{{ shortDateTime(d.windowExpiresAt) }}</span>
  </div>
}
@if (d.lastInboundAt) {
  <div>
    <span class="ctx__label">{{ t('ctxLastCustomerMessage') }}</span>
    <span class="ctx__stat">{{ shortDateTime(d.lastInboundAt) }}</span>
  </div>
}
```

No existing section is removed or moved.

---

#### [MODIFY] [templates-list.page.html](file:///d:/ITI_Materials/GP/Front2/waslx-frontend/WaslX/src/app/features/templates/pages/templates-list/templates-list.page.html)

Extend the template card with the new lifecycle fields. Added below existing `changedByMeta` block:

```html
@if (tpl.status === 'PAUSED' && tpl.pauseInfo) {
  <div class="tmpl-card__review">
    <span class="tmpl-card__review-title">{{ t('templatePaused') }}</span>
    <p class="tmpl-card__reason"><span class="tmpl-card__reason-label">{{ t('templatePauseInfo') }}</span></p>
  </div>
}
@if (tpl.status === 'DISABLED' && tpl.disableTimestamp) {
  <div class="tmpl-card__review">
    <span class="tmpl-card__review-title">{{ t('templateDisabled') }}</span>
    <p class="tmpl-card__reason">
      <span class="tmpl-card__reason-label">{{ t('templateDisabledAt') }}</span>
      {{ formatDate(tpl.disableTimestamp) }}
    </p>
  </div>
}
@if (tpl.isDeleted) {
  <span class="ui-pill ui-pill--danger">{{ t('templateDeleted') }}</span>
}
```

No existing block is removed.

---

## Verification Plan

### Automated Tests

No test project exists in the current solution. All verification is manual.

### Manual Verification — Core Window Scenarios

| # | Scenario | Expected Result |
|---|---|---|
| 1 | Inbound message, no referral | `WindowType=CustomerService24h`, `WindowExpiresAt≈now+24h` |
| 2 | Inbound message with referral object | `WindowType=FreeEntryPoint72h`, `WindowExpiresAt≈now+72h` |
| 3 | Agent sends free-form text (window open) | Meta accepts; `SynchronizeAfterSuccessfulSend` extends if needed |
| 4 | Agent sends free-form text (Meta returns 131047) | `SynchronizeAfterFailedSend` collapses window; `SaveChanges` called by `WhatsAppService` |
| 5 | Template send with window closed | Meta accepts; `WindowExpiresAt` untouched; no window write |
| 6 | Template send with window open | Meta accepts; no window write; `LastCustomerMessageAt` unchanged |
| 7 | Customer replies after template | `UpdateFromInboundMessage` resets window to 24h |
| 8 | Status webhook with `expiration_timestamp` later than local | Window extends; `UpdateFromMetaStatus` returns new state |
| 9 | Status webhook with `expiration_timestamp` earlier than local | Window unchanged (extend-only rule) |
| 10 | Customer message exactly at expiry boundary | `WindowExpiresAt` refreshed; window stays open |

### Manual Verification — Edge Cases

| # | Scenario | Expected Result |
|---|---|---|
| 11 | Duplicate inbound webhook (same `waMessageId`) | Idempotency check at line 130 skips insert; window not double-reset |
| 12 | Replayed status webhook (same `waMessageId`) | `message.Status` updated; `UpdateFromMetaStatus` called; extend-only |
| 13 | Out-of-order status webhooks | Older `expiration_timestamp` ignored; only newer extends window |
| 14 | Multiple simultaneous inbound messages | Each `SaveChangesAsync` is sequential inside Hangfire job; no concurrent write conflict |
| 15 | Two agents sending simultaneously | EF optimistic concurrency on `WindowExpiresAt` — last write wins; both sends succeed if window was open |
| 16 | Concurrent Hangfire jobs for same conversation | Hangfire serializes by job; no special lock needed |
| 17 | Server restart mid-processing | `WhatsAppWebhookLog.Processed = false` row allows replay |
| 18 | UTC clock drift | All `DateTime.UtcNow` calls; SQL Server `datetime2` stores UTC; no timezone conversion |
| 19 | Delayed status webhook (arrives hours late) | Extend-only rule prevents accidental shrink |
| 20 | 72h window followed by 24h inbound | New inbound always resets type and expiry |
| 21 | `expiration_timestamp` extends 24h to 72h | `UpdateFromMetaStatus` extends; `WindowType` stays `CustomerService24h` (type is not re-derived from Meta) |
| 22 | Template webhook — REJECTED | `Status`, `ReasonText`, `ReviewedAt`, `MetaStatusRaw` persisted; history row appended |
| 23 | Template webhook — PAUSED | `Status=PAUSED`, `PauseInfo` JSON persisted; history row appended |
| 24 | Template webhook — DISABLED | `Status=DISABLED`, `DisableTimestamp` set; history row appended |
| 25 | Template webhook — DELETED | `Status=DELETED`, `DeletedAt` set; soft-deleted; history row appended |
| 26 | Template list — soft-deleted review | Excluded from active list; row still visible via `TemplateReviewHistories` |
| 27 | Meta changes category | `FinalCategory` set; `SubmittedCategory` unchanged; `ChangedByMeta=true` at read time |
| 28 | `allow_category_change=true` and Meta changes category | `FinalCategory` set; `AllowCategoryChange=true` preserved |
| 29 | Frontend window countdown hits zero | `windowClosed` computed flips; composer locks to templates-only without server refresh |
| 30 | Frontend context panel — 72h window | `windowType` shows "FreeEntryPoint72h"; expiry shows +72h from last inbound |
