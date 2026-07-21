import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type {
  AiCostOverview,
  Announcement,
  AssignPlanInput,
  BudgetAlert,
  CreateAnnouncement,
  FeatureFlag,
  GenerateInvoiceInput,
  GlobalAuditPage,
  GlobalAuditQuery,
  ImpersonationSession,
  PlatformCredential,
  PlatformCredentialSecret,
  PlatformInvoice,
  PlatformPolicy,
  StartImpersonationInput,
  SuperAdminCreateTenant,
  SystemHealth,
  TenantDetail,
  TenantSummary,
  UpdateTenantProfile,
  UpsertBudgetAlert,
  UpsertCredential,
  UpsertFeatureFlag,
  UsageOverview
} from '../models/platform.models';

/** Time window shared by usage + AI-cost endpoints (inclusive ISO dates). */
export interface PlatformRange {
  from: string;
  to: string;
}

@Injectable({ providedIn: 'root' })
export class SuperAdminApiService {
  private readonly api = inject(ApiClientService);

  // ── Tenants list + provisioning ──
  getTenants(): Observable<TenantSummary[]> {
    return this.api.get<TenantSummary[]>('/superadmin/tenants');
  }

  createTenant(input: SuperAdminCreateTenant): Observable<number> {
    return this.api.post<number>('/superadmin/tenants', input);
  }

  // ── Tenant detail + lifecycle (FE-6.2) ──
  getTenant(id: number): Observable<TenantDetail> {
    return this.api.get<TenantDetail>(`/superadmin/tenants/${id}`);
  }

  updateTenant(id: number, input: UpdateTenantProfile): Observable<void> {
    return this.api.put<void>(`/superadmin/tenants/${id}`, input);
  }

  setTenantStatus(id: number, status: string): Observable<void> {
    return this.api.patch<void>(`/superadmin/tenants/${id}/status`, { status });
  }

  deleteTenant(id: number): Observable<void> {
    return this.api.delete<void>(`/superadmin/tenants/${id}`);
  }

  // ── Assign / change plan (FE-6.3) ──
  assignPlan(id: number, input: AssignPlanInput): Observable<void> {
    return this.api.post<void>(`/superadmin/tenants/${id}/plan`, input);
  }

  // ── Per-tenant invoices (FE-6.4) ──
  getTenantInvoices(id: number): Observable<PlatformInvoice[]> {
    return this.api.get<PlatformInvoice[]>(`/superadmin/tenants/${id}/invoices`);
  }

  generateInvoice(id: number, input: GenerateInvoiceInput): Observable<PlatformInvoice> {
    return this.api.post<PlatformInvoice>(`/superadmin/tenants/${id}/invoices`, input);
  }

  // ── FE-6.5 · Global usage dashboard ──
  getUsage(range?: PlatformRange): Observable<UsageOverview> {
    return this.api.get<UsageOverview>('/superadmin/usage', { params: this.rangeParams(range) });
  }

  // ── FE-6.6 · AI cost monitoring ──
  getAiCost(range?: PlatformRange): Observable<AiCostOverview> {
    return this.api.get<AiCostOverview>('/superadmin/ai-cost', { params: this.rangeParams(range) });
  }

  getBudgetAlerts(): Observable<BudgetAlert[]> {
    return this.api.get<BudgetAlert[]>('/superadmin/ai-cost/budget-alerts');
  }

  createBudgetAlert(input: UpsertBudgetAlert): Observable<BudgetAlert> {
    return this.api.post<BudgetAlert>('/superadmin/ai-cost/budget-alerts', input);
  }

  updateBudgetAlert(id: number, input: UpsertBudgetAlert): Observable<BudgetAlert> {
    return this.api.put<BudgetAlert>(`/superadmin/ai-cost/budget-alerts/${id}`, input);
  }

  deleteBudgetAlert(id: number): Observable<void> {
    return this.api.delete<void>(`/superadmin/ai-cost/budget-alerts/${id}`);
  }

  // ── FE-6.7 · Credentials & secrets ──
  getCredentials(): Observable<PlatformCredential[]> {
    return this.api.get<PlatformCredential[]>('/superadmin/credentials');
  }

  createCredential(input: UpsertCredential): Observable<PlatformCredentialSecret> {
    return this.api.post<PlatformCredentialSecret>('/superadmin/credentials', input);
  }

  updateCredential(id: number, input: UpsertCredential): Observable<PlatformCredential> {
    return this.api.put<PlatformCredential>(`/superadmin/credentials/${id}`, input);
  }

  rotateCredential(id: number): Observable<PlatformCredentialSecret> {
    return this.api.post<PlatformCredentialSecret>(`/superadmin/credentials/${id}/rotate`, {});
  }

  deleteCredential(id: number): Observable<void> {
    return this.api.delete<void>(`/superadmin/credentials/${id}`);
  }

  // ── FE-6.7 · Feature flags ──
  getFeatureFlags(): Observable<FeatureFlag[]> {
    return this.api.get<FeatureFlag[]>('/superadmin/feature-flags');
  }

  upsertFeatureFlag(input: UpsertFeatureFlag): Observable<FeatureFlag> {
    return this.api.post<FeatureFlag>('/superadmin/feature-flags', input);
  }

  toggleFeatureFlag(id: number, enabled: boolean): Observable<FeatureFlag> {
    return this.api.patch<FeatureFlag>(`/superadmin/feature-flags/${id}/toggle`, { enabled });
  }

  // ── FE-6.7 · Policy defaults ──
  getPolicy(): Observable<PlatformPolicy> {
    return this.api.get<PlatformPolicy>('/superadmin/policy');
  }

  setPolicy(input: PlatformPolicy): Observable<PlatformPolicy> {
    return this.api.put<PlatformPolicy>('/superadmin/policy', input);
  }

  // ── FE-6.9 · Global (cross-tenant) audit log ──
  getGlobalAuditLogs(query: GlobalAuditQuery = {}): Observable<GlobalAuditPage> {
    const params: Record<string, string | number | boolean> = {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 25
    };
    if (query.actorUserId != null && query.actorUserId !== '') {
      params['actorUserId'] = query.actorUserId;
    }
    if (query.tenantId != null && query.tenantId !== '') {
      params['tenantId'] = query.tenantId;
    }
    if (query.action) {
      params['action'] = query.action;
    }
    if (query.entityType) {
      params['entityType'] = query.entityType;
    }
    if (query.from) {
      params['from'] = query.from;
    }
    if (query.to) {
      params['to'] = query.to;
    }
    if (query.search && query.search.trim()) {
      params['search'] = query.search.trim();
    }
    return this.api.get<GlobalAuditPage>('/superadmin/audit-logs', { params });
  }

  // ── FE-6.8 · Audited impersonation ──
  startImpersonation(input: StartImpersonationInput): Observable<ImpersonationSession> {
    return this.api.post<ImpersonationSession>('/superadmin/impersonate', input);
  }

  endImpersonation(sessionId: string): Observable<void> {
    return this.api.post<void>(`/superadmin/impersonate/${sessionId}/end`, {});
  }

  getActiveImpersonation(): Observable<ImpersonationSession | null> {
    return this.api.get<ImpersonationSession | null>('/superadmin/impersonate/active');
  }

  // ── FE-6.9 · System health ──
  getHealth(): Observable<SystemHealth> {
    return this.api.get<SystemHealth>('/superadmin/health');
  }

  // ── FE-6.9 · Announcements ──
  getAnnouncements(): Observable<Announcement[]> {
    return this.api.get<Announcement[]>('/superadmin/announcements');
  }

  createAnnouncement(input: CreateAnnouncement): Observable<Announcement> {
    return this.api.post<Announcement>('/superadmin/announcements', input);
  }

  publishAnnouncement(id: number): Observable<Announcement> {
    return this.api.post<Announcement>(`/superadmin/announcements/${id}/publish`, {});
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.api.delete<void>(`/superadmin/announcements/${id}`);
  }

  private rangeParams(range?: PlatformRange): Record<string, string> | undefined {
    return range ? { from: range.from, to: range.to } : undefined;
  }
}
