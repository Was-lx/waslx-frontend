import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { PlatformInvoice } from '../models/platform.models';

// ─────────────────────────────────────────────────────────────────────────────
// Platform billing / invoicing (FE-6.4).
// Per-tenant invoice list + generation live on SuperAdminApiService (tenant-scoped);
// this service owns the invoice-scoped mutations (mark-paid).
// Backend: /api/superadmin/invoices/{invoiceId}/mark-paid.
// ─────────────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class BillingApiService {
  private readonly api = inject(ApiClientService);

  markPaid(invoiceId: number): Observable<PlatformInvoice> {
    return this.api.post<PlatformInvoice>(`/superadmin/invoices/${invoiceId}/mark-paid`, {});
  }
}
