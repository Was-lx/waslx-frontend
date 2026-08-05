import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** A single contact row in the directory. */
export interface Contact {
  id: number;
  name: string;
  phone: string;
  conversationCount: number;
  lastContactAt: string | null;
  assignedUserId: number | null;
  assignedUserName: string | null;
  tags: string[];
}

/** A page of contacts + the total matching the filter (for numbered pagination). */
export interface ContactPage {
  items: Contact[];
  total: number;
}

/** The Contacts directory filter (all optional). assignedUserId is the assignee's Identity (GUID) id. */
export interface ContactFilters {
  search?: string | null;
  tagId?: number | null;
  assignedUserId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

interface ApiContact {
  id: number;
  name: string | null;
  phone: string | null;
  conversationCount: number;
  lastContactAt: string | null;
  assignedUserId: number | null;
  assignedUserName: string | null;
  tags: string[] | null;
}

interface ApiContactPage {
  items: ApiContact[] | null;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CustomersApiService {
  private readonly api = inject(ApiClientService);

  /** A page of contacts scoped by the current filters (pass a large pageSize to pull all, for export). */
  list(filters: ContactFilters, page = 1, pageSize = 25): Observable<ContactPage> {
    const params = { ...buildParams(filters), page: String(page), pageSize: String(pageSize) };
    return this.api.get<ApiContactPage>('/customers', { params }).pipe(
      map((p) => ({ items: (p?.items ?? []).map(toContact), total: p?.total ?? 0 })),
    );
  }
}

/** Builds the query-string params, omitting null/empty filters. */
function buildParams(f: ContactFilters): Record<string, string> {
  const p: Record<string, string> = {};
  if (f.search?.trim()) p['search'] = f.search.trim();
  if (f.tagId != null) p['tagId'] = String(f.tagId);
  if (f.assignedUserId != null) p['assignedUserId'] = String(f.assignedUserId);
  if (f.dateFrom) p['dateFrom'] = f.dateFrom;
  if (f.dateTo) p['dateTo'] = f.dateTo;
  return p;
}

function toContact(c: ApiContact): Contact {
  return {
    id: c.id,
    name: c.name ?? '',
    phone: c.phone ?? '',
    conversationCount: c.conversationCount ?? 0,
    lastContactAt: c.lastContactAt ?? null,
    assignedUserId: c.assignedUserId ?? null,
    assignedUserName: c.assignedUserName ?? null,
    tags: c.tags ?? [],
  };
}
