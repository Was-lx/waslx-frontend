import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

// ─── Backend DTOs (internal) ─────────────────────────────────────────────────

/**
 * Server AuditAction enum (WaslX.Domain.SharedEnums.AuditAction), serialised as its
 * string name. Kept open (`string`) for forward-compatibility with new verbs.
 */
type ApiAuditAction =
  | 'Created'
  | 'Updated'
  | 'Deleted'
  | 'StatusChanged'
  | 'Login'
  | 'Logout'
  | 'Impersonated'
  | string;

/** One immutable audit row as returned by the tenant audit endpoint. */
interface ApiAuditLog {
  id: number;
  action: ApiAuditAction;
  actorUserId: number | null;
  actorName: string | null;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  timestamp: string;
}

/** Backend paged envelope for /audit-logs. */
interface ApiAuditPage {
  items: ApiAuditLog[] | null;
  page: number | null;
  pageSize: number | null;
  total: number | null;
}

// ─── View-models (exported) ──────────────────────────────────────────────────

export type AuditAction =
  | 'Created'
  | 'Updated'
  | 'Deleted'
  | 'StatusChanged'
  | 'Login'
  | 'Logout'
  | 'Impersonated'
  | (string & {});

/** The verb family that drives a row's coloured pill (create · update · delete · neutral). */
export type AuditVerb = 'create' | 'update' | 'delete' | 'neutral';

/** A single append-only audit entry as shown in the viewer list + detail drawer. */
export interface AuditLog {
  id: number;
  action: AuditAction;
  actorUserId: number | null;
  actorName: string | null;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  timestamp: string;
}

/** A page of audit rows plus the paging cursor the list renders. */
export interface AuditPage {
  items: AuditLog[];
  page: number;
  pageSize: number;
  total: number;
}

/** Query filters the viewer sends; all optional and combinable. */
export interface AuditQuery {
  actorUserId?: number | string | null;
  action?: AuditAction | null;
  entityType?: string | null;
  from?: string | null;
  to?: string | null;
  search?: string | null;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AuditApiService {
  private readonly api = inject(ApiClientService);

  /** A page of the tenant's immutable audit trail, newest first, scoped by the given filters. */
  getAuditLogs(query: AuditQuery = {}): Observable<AuditPage> {
    const params: Record<string, string | number | boolean> = {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 25,
    };
    if (query.actorUserId != null) {
      params['actorUserId'] = query.actorUserId;
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
    return this.api.get<ApiAuditPage>('/audit-logs', { params }).pipe(map(toPage));
  }
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

/** Maps a server action verb onto its colour family for the row pill. */
export function auditVerb(action: AuditAction): AuditVerb {
  switch (action) {
    case 'Created':
      return 'create';
    case 'Updated':
    case 'StatusChanged':
      return 'update';
    case 'Deleted':
      return 'delete';
    default:
      return 'neutral';
  }
}

function toLog(l: ApiAuditLog): AuditLog {
  return {
    id: l.id,
    action: l.action ?? 'Updated',
    actorUserId: l.actorUserId ?? null,
    actorName: l.actorName ?? null,
    entityType: l.entityType ?? null,
    entityId: l.entityId ?? null,
    details: l.details ?? null,
    timestamp: l.timestamp,
  };
}

function toPage(p: ApiAuditPage): AuditPage {
  const items = (p?.items ?? []).map(toLog);
  return {
    items,
    page: p?.page ?? 1,
    pageSize: p?.pageSize ?? 25,
    total: p?.total ?? items.length,
  };
}
