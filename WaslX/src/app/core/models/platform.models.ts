// ─────────────────────────────────────────────────────────────────────────────
// Shared DTO shapes mirroring the WaslX backend (plans, tenancy, billing, RBAC).
// ─────────────────────────────────────────────────────────────────────────────

export type CustomerType = 'B2B' | 'B2C' | 'Both' | 'Unknown';
export type BillingCycle = 'Monthly' | 'Yearly';

// ── Plans ──
export interface Plan {
  id: number;
  code: string;
  name: string;
  tagline: string | null;
  price: number;
  priceYearly: number | null;
  billingCycle: BillingCycle;
  maxAgents: number;
  maxNumbers: number;
  msgQuota: number;
  aiQuota: number;
  trialDays: number;
  isActive: boolean;
  isPublic: boolean;
  isCustom: boolean;
  sortOrder: number;
  features: string[];
}

export interface UpsertPlan {
  code: string;
  name: string;
  tagline: string | null;
  price: number;
  priceYearly: number | null;
  billingCycle: BillingCycle;
  maxAgents: number;
  maxNumbers: number;
  msgQuota: number;
  aiQuota: number;
  trialDays: number;
  isActive: boolean;
  isPublic: boolean;
  isCustom: boolean;
  sortOrder: number;
  features: string[];
}

// ── Sign-up / tenancy ──
export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  orgName: string;
  website: string | null;
  industry: string | null;
  phone: string | null;
  customerType: CustomerType;
}

export interface TenantProfile {
  id: number;
  name: string;
  website: string | null;
  industry: string | null;
  phoneNumber: string | null;
  customerType: CustomerType;
  status: string;
  billingStatus: string;
  planId: number;
  planName: string;
  trialEndsAt: string | null;
  trialDaysLeft: number | null;
  currentPeriodEnd: string | null;
  onboardingStep: number;
  onboardingCompleted: boolean;
}

export interface TenantSummary {
  id: number;
  name: string;
  planName: string;
  status: string;
  billingStatus: string;
  trialEndsAt: string | null;
  userCount: number;
  adminEmail: string | null;
  createdAt: string;
}

export interface SuperAdminCreateTenant {
  orgName: string;
  adminEmail: string;
  adminFullName: string;
  planId: number;
  website: string | null;
  industry: string | null;
  phone: string | null;
  customerType: CustomerType;
  startTrial: boolean;
}

export interface UpdateTenantProfile {
  name: string;
  website: string | null;
  industry: string | null;
  phone: string | null;
  customerType: CustomerType;
}

// ── Platform admins (SuperAdmin users) — FE-6.1 ──
export type PlatformUserStatus = 'Active' | 'Disabled';

export interface PlatformAdmin {
  id: string;
  email: string;
  fullName: string;
  status: PlatformUserStatus;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CreatePlatformAdmin {
  email: string;
  fullName: string;
  password: string;
}

// ── Tenant detail + lifecycle — FE-6.2 / FE-6.3 ──
export interface TenantUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface TenantDetail {
  id: number;
  name: string;
  website: string | null;
  industry: string | null;
  phoneNumber: string | null;
  customerType: CustomerType;
  status: string;
  billingStatus: string;
  planId: number;
  planName: string;
  price: number;
  billingCycle: BillingCycle;
  trialEndsAt: string | null;
  trialDaysLeft: number | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  usage: Usage;
  mrr: number;
  users: TenantUserRow[];
  invoices: PlatformInvoice[];
}

export interface AssignPlanInput {
  planId: number;
  billingCycle: BillingCycle;
}

// ── Billing / invoicing — FE-6.4 ──
export interface PlatformInvoice {
  id: number;
  tenantId: number;
  tenantName: string | null;
  amount: number;
  status: string; // Draft | Open | Paid | PastDue | Void
  periodStart: string | null;
  periodEnd: string | null;
  issuedAt: string;
  dueDate: string | null;
  paidAt: string | null;
}

export interface GenerateInvoiceInput {
  amount: number;
  periodStart: string | null;
  periodEnd: string | null;
  dueDate: string | null;
}

// ── Subscription / billing ──
export interface Usage {
  agentsUsed: number;
  maxAgents: number;
  numbersUsed: number;
  maxNumbers: number;
  msgQuota: number;
  aiQuota: number;
}

export interface PaymentMethod {
  id: number;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string | null;
}

export interface Invoice {
  id: number;
  amount: number;
  status: string;
  issuedAt: string;
  paidAt: string | null;
}

export interface Subscription {
  status: string;
  planId: number;
  planCode: string;
  planName: string;
  price: number;
  billingCycle: BillingCycle;
  trialEndsAt: string | null;
  trialDaysLeft: number | null;
  currentPeriodEnd: string | null;
  usage: Usage;
  paymentMethod: PaymentMethod | null;
  invoices: Invoice[];
}

export interface UpgradeInput {
  planId: number;
  billingCycle: BillingCycle;
}

export interface AddCard {
  number: string;
  expMonth: number;
  expYear: number;
  holderName: string | null;
}

// ══════════════════════════════════════════════════════════════════════════
// Sprint 6 · Platform console — Global usage, AI cost, credentials, flags, policy
// (FE-6.5 / FE-6.6 / FE-6.7). Cross-tenant DTOs served under /api/superadmin.
// ══════════════════════════════════════════════════════════════════════════

// ── FE-6.5 · Global usage dashboard ──
/** One point on a platform-wide time series (ISO date + counts). */
export interface UsagePoint {
  date: string;
  conversations: number;
  messages: number;
  activeTenants: number;
}

/** Cross-tenant volume for the per-tenant ranking bars. */
export interface TenantUsageRow {
  tenantId: number;
  tenantName: string;
  conversations: number;
  messages: number;
  activeAgents: number;
}

export interface UsageOverview {
  activeTenants: number;
  totalConversations: number;
  totalMessages: number;
  activeAgents: number;
  /** % change vs. the previous equal-length window (nullable when unknown). */
  conversationsDeltaPct: number | null;
  messagesDeltaPct: number | null;
  activeTenantsDeltaPct: number | null;
  activeAgentsDeltaPct: number | null;
  series: UsagePoint[];
  perTenant: TenantUsageRow[];
}

// ── FE-6.6 · AI cost monitoring ──
export interface AiCostPoint {
  date: string;
  cost: number;
  conversations: number;
}

export interface TenantAiCostRow {
  tenantId: number;
  tenantName: string;
  cost: number;
  conversations: number;
}

export interface AiModelSlice {
  model: string;
  cost: number;
  /** True for the autonomous-agent model so the UI paints it purple (--accent). */
  isAgent: boolean;
}

export interface AiCostOverview {
  totalCost: number;
  conversations: number;
  /** Blended $ per 1k conversations — the CLAUDE.md efficiency target. */
  costPerThousand: number;
  costDeltaPct: number | null;
  /** Current spend against the active monthly budget for the gauge. */
  monthlyBudget: number;
  monthToDateCost: number;
  projectedCost: number;
  series: AiCostPoint[];
  perTenant: TenantAiCostRow[];
  modelMix: AiModelSlice[];
}

export type BudgetAlertScope = 'Platform' | 'Tenant';

export interface BudgetAlert {
  id: number;
  scope: BudgetAlertScope;
  tenantId: number | null;
  tenantName: string | null;
  /** Monthly ceiling in USD. */
  monthlyLimit: number;
  /** Warn threshold as a fraction (0–1) of the limit. */
  warnAtPct: number;
  isActive: boolean;
}

export interface UpsertBudgetAlert {
  scope: BudgetAlertScope;
  tenantId: number | null;
  monthlyLimit: number;
  warnAtPct: number;
  isActive: boolean;
}

// ── FE-6.7 · Platform settings — credentials / feature flags / policy ──
export type CredentialType = 'WhatsAppAppSecret' | 'AiProviderKey' | 'WebhookSigning' | 'Other';

export interface PlatformCredential {
  id: number;
  name: string;
  key: string;
  type: CredentialType;
  /** Masked representation with the last 4 chars, e.g. "••••••••4f2a". Never plaintext. */
  masked: string;
  last4: string;
  updatedAt: string;
  rotatedAt: string | null;
}

/** Create/rotate responses return the plaintext ONCE — held transiently client-side. */
export interface PlatformCredentialSecret extends PlatformCredential {
  value: string;
}

export interface UpsertCredential {
  name: string;
  key: string;
  type: CredentialType;
  value: string;
}

export type FeatureFlagScope = 'Global' | 'Tenant';

export interface FeatureFlag {
  id: number;
  key: string;
  name: string;
  description: string | null;
  scope: FeatureFlagScope;
  enabled: boolean;
  /** Optional staged rollout percentage 0–100 (null = full when enabled). */
  rolloutPct: number | null;
  /** Number of live tenants affected — drives the confirm "blast radius". */
  affectedTenants: number;
}

export interface UpsertFeatureFlag {
  key: string;
  name: string;
  description: string | null;
  scope: FeatureFlagScope;
  enabled: boolean;
  rolloutPct: number | null;
}

export type DefaultRouting = 'Manual' | 'RoundRobin' | 'Ai';

export interface PlatformPolicy {
  /** Data-retention window in days. */
  retentionDays: number;
  /** API rate limit — requests per minute per tenant. */
  rateLimitPerMinute: number;
  /** Default assignment method for new tenants. */
  defaultRouting: DefaultRouting;
  /** Session length in minutes. */
  sessionMinutes: number;
  /** Failed-login attempts before lockout. */
  lockoutThreshold: number;
  /** Whether the AI Agent is on by default for new tenants. */
  aiEnabledByDefault: boolean;
}

// ══════════════════════════════════════════════════════════════════════════
// Sprint 6 · Platform console — Impersonation, global audit, system health,
// announcements (FE-6.8 / FE-6.9). Cross-tenant, served under /api/superadmin.
// ══════════════════════════════════════════════════════════════════════════

// ── FE-6.9 · Global (cross-tenant) audit ──
/** One immutable platform-audit row — like a tenant audit entry, plus the owning tenant. */
export interface GlobalAuditLog {
  id: number;
  action: string;
  actorUserId: number | null;
  actorName: string | null;
  /** Null when the actor is a Platform Owner / system (no tenant). */
  tenantId: number | null;
  tenantName: string | null;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  timestamp: string;
}

export interface GlobalAuditPage {
  items: GlobalAuditLog[];
  page: number;
  pageSize: number;
  total: number;
}

/** Filters the global audit viewer sends; all optional and combinable. */
export interface GlobalAuditQuery {
  actorUserId?: number | string | null;
  tenantId?: number | string | null;
  action?: string | null;
  entityType?: string | null;
  from?: string | null;
  to?: string | null;
  search?: string | null;
  page?: number;
  pageSize?: number;
}

// ── FE-6.8 · Audited impersonation ──
/** Live impersonation session returned by POST /impersonate (and /impersonate/active). */
export interface ImpersonationSession {
  sessionId: string;
  tenantId: number;
  tenantName: string;
  reason: string;
  /** Short-lived token that acts as the tenant for subsequent API calls. */
  accessToken: string;
  refreshToken: string | null;
  startedAt: string;
  expiresAt: string;
}

export interface StartImpersonationInput {
  tenantId: number;
  reason: string;
}

// ── FE-6.9 · System health board ──
export type HealthStatus = 'ok' | 'degraded' | 'down';

/** One monitored dependency (API, DB, SignalR, WhatsApp, AI, Hangfire). */
export interface HealthComponent {
  /** Stable key used for icon/label lookup, e.g. 'api' | 'db' | 'signalr' | 'whatsapp' | 'ai' | 'hangfire'. */
  key: string;
  name: string;
  status: HealthStatus;
  /** Round-trip latency in milliseconds (null when not applicable). */
  latencyMs: number | null;
  message: string | null;
}

export interface SystemHealth {
  /** Worst-of roll-up across all components. */
  status: HealthStatus;
  checkedAt: string;
  components: HealthComponent[];
}

// ── FE-6.9 · Announcements ──
export type AnnouncementSeverity = 'Info' | 'Warning' | 'Critical';
export type AnnouncementAudience = 'All' | 'Plan' | 'SpecificTenants';
export type AnnouncementStatus = 'Draft' | 'Scheduled' | 'Published' | 'Archived';

export interface Announcement {
  id: number;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  audience: AnnouncementAudience;
  /** Set when audience = Plan. */
  planId: number | null;
  planName: string | null;
  /** Set when audience = SpecificTenants. */
  tenantIds: number[] | null;
  scheduledAt: string | null;
  status: AnnouncementStatus;
  publishedAt: string | null;
  createdAt: string;
  /** How many tenant admins the current audience resolves to (display-only). */
  reach: number | null;
}

export interface CreateAnnouncement {
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  audience: AnnouncementAudience;
  planId: number | null;
  tenantIds: number[] | null;
  scheduledAt: string | null;
}

// ── RBAC ──
export interface PermissionCell {
  granted: boolean;
  scope: string | null;
  locked: boolean;
}

export interface PermissionRow {
  code: string;
  description: string;
  tier: string;
  isScope: boolean;
  scopeOptions: string | null;
  sort: number;
  cells: Record<string, PermissionCell>;
}

export interface PermissionCategory {
  name: string;
  permissions: PermissionRow[];
}

export interface PermissionMatrix {
  roles: string[];
  categories: PermissionCategory[];
}

export interface PermissionUpdateItem {
  role: string;
  code: string;
  granted: boolean;
  scope: string | null;
}

// ── WhatsApp channels ──
export type WhatsAppAccountStatus = 'Connected' | 'Disconnected' | 'Expired';

export interface WhatsAppAccount {
  id: number;
  phoneNumber: string;
  phoneNumberId: string;
  whatsAppBusinessAccountId: string;
  status: WhatsAppAccountStatus;
  connectedAt: string;
  tokenExpiresAt: string | null;
}

export interface SendWhatsAppText {
  toPhone: string;
  text: string;
}

/** Header parameter: `kind:'text'` uses `text`; media kinds use `mediaLink` (a public URL). */
export interface TemplateHeaderParam {
  kind: 'text' | 'image' | 'video' | 'document';
  text?: string;
  mediaLink?: string;
}

/** Dynamic button parameter: `subType:'url'` (URL suffix) or `'copy_code'` (AUTH OTP); `index` is 0-based. */
export interface TemplateButtonParam {
  index: number;
  subType: 'url' | 'copy_code';
  text: string;
}

export interface SendWhatsAppTemplate {
  toPhone: string;
  templateName: string;
  languageCode: string;
  /** Fill a text or media HEADER placeholder. */
  header?: TemplateHeaderParam | null;
  /** Fill the template BODY placeholders ({{1}}, {{2}}, … in order). */
  body?: string[];
  /** Fill dynamic URL buttons or the AUTHENTICATION OTP code. */
  buttons?: TemplateButtonParam[];
}

/** A file uploaded to permanent storage (returned by POST /whatsapp/media). */
export interface UploadedMedia {
  url: string;
  mimeType: string;
  fileName: string | null;
}

// ── Me (own profile + resolved permissions) ──
export interface Me {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  roles: string[];
  tenantId: number | null;
  tenantName: string | null;
  permissions: string[];
  scopes: Record<string, string>;
  onboardingCompleted: boolean;
  onboardingStep: number;
}
