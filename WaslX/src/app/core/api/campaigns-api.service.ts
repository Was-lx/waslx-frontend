import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

// ─── Backend DTOs (internal) ─────────────────────────────────────────────────

/** Server CampaignStatus, mirrors the domain: Draft·Scheduled·Running·Paused·Completed·Cancelled. */
type ApiCampaignStatus = 'Draft' | 'Scheduled' | 'Running' | 'Paused' | 'Completed' | 'Cancelled' | string;

/** Server CampaignRecipient status: queued·sent·delivered·read·failed. */
type ApiRecipientStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | string;

/** Backend CampaignResponse row / detail shape. */
interface ApiCampaign {
  id: number;
  name: string;
  status: ApiCampaignStatus;
  templateName: string | null;
  messageBody: string | null;
  waAccountId: number | null;
  // The backend stores/returns the audience as a raw JSON string, e.g. {"phoneNumbers":[...]}.
  audienceFilter: string | null;
  audienceCount: number;
  scheduledAt: string | null;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdByName: string | null;
  createdAt: string;
}

/** Backend preview-audience response. */
interface ApiAudiencePreview {
  count: number;
}

/** Backend recipient row. */
interface ApiCampaignRecipient {
  id: number;
  customerName: string | null;
  customerPhone: string;
  status: ApiRecipientStatus;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  error: string | null;
}

// ─── View-models (exported) ──────────────────────────────────────────────────

export type CampaignStatus = 'Draft' | 'Scheduled' | 'Running' | 'Paused' | 'Completed' | 'Cancelled';
export type RecipientStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

/** The campaign audience — an explicit list of recipient phone numbers (from a file or picked contacts). */
export interface AudienceFilter {
  phoneNumbers: string[];
}

/** A selectable existing contact for the "pick from my contacts" audience mode. */
export interface AudienceContact {
  id: number;
  name: string;
  phone: string;
  lastContactAt: string | null;
}

/** A campaign as shown in the list, detail and analytics screens. */
export interface Campaign {
  id: number;
  name: string;
  status: CampaignStatus;
  templateName: string | null;
  messageBody: string | null;
  waAccountId: number | null;
  audienceFilter: AudienceFilter;
  audienceSize: number;
  scheduledAt: string | null;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdByName: string | null;
  createdAt: string;
}

/** A single recipient row on the running/analytics screen. */
export interface CampaignRecipient {
  id: number;
  customerName: string | null;
  customerPhone: string;
  status: RecipientStatus;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  error: string | null;
}

/** Create/update payload for a campaign (all steps of the wizard). */
export interface UpsertCampaignRequest {
  name: string;
  templateName: string | null;
  messageBody: string | null;
  waAccountId: number | null;
  audienceFilter: AudienceFilter;
  scheduledAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class CampaignsApiService {
  private readonly api = inject(ApiClientService);

  /** All campaigns for the tenant, newest first. */
  getCampaigns(): Observable<Campaign[]> {
    return this.api.get<ApiCampaign[]>('/campaigns').pipe(map((list) => (list ?? []).map(toCampaign)));
  }

  /** One campaign by id (detail / analytics). */
  getCampaign(id: number): Observable<Campaign> {
    return this.api.get<ApiCampaign>(`/campaigns/${id}`).pipe(map(toCampaign));
  }

  createCampaign(request: UpsertCampaignRequest): Observable<Campaign> {
    return this.api.post<ApiCampaign>('/campaigns', toApiUpsert(request)).pipe(map(toCampaign));
  }

  updateCampaign(id: number, request: UpsertCampaignRequest): Observable<Campaign> {
    return this.api.put<ApiCampaign>(`/campaigns/${id}`, toApiUpsert(request)).pipe(map(toCampaign));
  }

  deleteCampaign(id: number): Observable<void> {
    return this.api.delete<void>(`/campaigns/${id}`);
  }

  /** Live recipient count for a candidate audience filter — called as rules change. */
  previewAudience(filter: AudienceFilter): Observable<number> {
    return this.api
      .post<ApiAudiencePreview>('/campaigns/preview-audience', { audienceFilter: toApiFilter(filter) })
      .pipe(map((r) => r?.count ?? 0));
  }

  /** Existing tenant contacts for the "pick from my contacts" audience mode, optionally filtered
   *  by tag and/or a last-contacted date range (ISO dates, e.g. "2026-07-01"). */
  getAudienceContacts(tagId: number | null, dateFrom: string | null, dateTo: string | null): Observable<AudienceContact[]> {
    const params: string[] = [];
    if (tagId != null) params.push(`tagId=${tagId}`);
    if (dateFrom) params.push(`dateFrom=${encodeURIComponent(dateFrom)}`);
    if (dateTo) params.push(`dateTo=${encodeURIComponent(dateTo)}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.api.get<AudienceContact[]>(`/campaigns/audience-contacts${qs}`).pipe(map((list) => list ?? []));
  }

  launch(id: number): Observable<Campaign> {
    return this.api.post<ApiCampaign>(`/campaigns/${id}/launch`).pipe(map(toCampaign));
  }

  pause(id: number): Observable<Campaign> {
    return this.api.post<ApiCampaign>(`/campaigns/${id}/pause`).pipe(map(toCampaign));
  }

  resume(id: number): Observable<Campaign> {
    return this.api.post<ApiCampaign>(`/campaigns/${id}/resume`).pipe(map(toCampaign));
  }

  cancel(id: number): Observable<Campaign> {
    return this.api.post<ApiCampaign>(`/campaigns/${id}/cancel`).pipe(map(toCampaign));
  }

  getRecipients(id: number): Observable<CampaignRecipient[]> {
    return this.api
      .get<ApiCampaignRecipient[]>(`/campaigns/${id}/recipients`)
      .pipe(map((list) => (list ?? []).map(toRecipient)));
  }
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

/** The backend persists the audience as a raw JSON string; parse it back into the recipient list. */
function toFilter(raw: string | null): AudienceFilter {
  if (!raw) {
    return { phoneNumbers: [] };
  }
  try {
    const parsed = JSON.parse(raw) as { phoneNumbers?: string[] };
    return { phoneNumbers: parsed.phoneNumbers ?? [] };
  } catch {
    return { phoneNumbers: [] };
  }
}

/** Serialise the recipient list to the JSON string the backend stores and parses. */
function toApiFilter(f: AudienceFilter): string {
  return JSON.stringify({ phoneNumbers: f.phoneNumbers });
}

function toApiUpsert(r: UpsertCampaignRequest): Record<string, unknown> {
  return {
    name: r.name,
    templateName: r.templateName,
    messageBody: r.messageBody,
    waAccountId: r.waAccountId,
    audienceFilter: toApiFilter(r.audienceFilter),
    scheduledAt: r.scheduledAt,
  };
}

function toCampaign(c: ApiCampaign): Campaign {
  return {
    id: c.id,
    name: c.name,
    status: (c.status as CampaignStatus) ?? 'Draft',
    templateName: c.templateName ?? null,
    messageBody: c.messageBody ?? null,
    waAccountId: c.waAccountId ?? null,
    audienceFilter: toFilter(c.audienceFilter),
    audienceSize: c.audienceCount ?? 0,
    scheduledAt: c.scheduledAt ?? null,
    sentCount: c.sentCount ?? 0,
    deliveredCount: c.deliveredCount ?? 0,
    readCount: c.readCount ?? 0,
    failedCount: c.failedCount ?? 0,
    createdByName: c.createdByName ?? null,
    createdAt: c.createdAt,
  };
}

function toRecipient(r: ApiCampaignRecipient): CampaignRecipient {
  return {
    id: r.id,
    customerName: r.customerName ?? null,
    customerPhone: r.customerPhone,
    status: (r.status as RecipientStatus) ?? 'queued',
    sentAt: r.sentAt ?? null,
    deliveredAt: r.deliveredAt ?? null,
    readAt: r.readAt ?? null,
    error: r.error ?? null,
  };
}
