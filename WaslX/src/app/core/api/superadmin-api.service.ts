import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { TenantSummary, SuperAdminCreateTenant } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class SuperAdminApiService {
  private readonly api = inject(ApiClientService);

  getTenants(): Observable<TenantSummary[]> {
    return this.api.get<TenantSummary[]>('/superadmin/tenants');
  }

  createTenant(input: SuperAdminCreateTenant): Observable<number> {
    return this.api.post<number>('/superadmin/tenants', input);
  }

  setTenantStatus(id: number, status: string): Observable<void> {
    return this.api.patch<void>(`/superadmin/tenants/${id}/status`, { status });
  }
}
