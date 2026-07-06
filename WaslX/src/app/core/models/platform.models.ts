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
