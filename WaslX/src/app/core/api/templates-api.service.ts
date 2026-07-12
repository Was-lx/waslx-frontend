import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { CreateTemplateInput, Template, TemplateCreateResult } from '../../features/templates/models/template.model';

@Injectable({ providedIn: 'root' })
export class TemplatesApiService {
  private readonly api = inject(ApiClientService);

  /** Lists the tenant's Meta templates, optionally filtered by status (e.g. 'APPROVED' for the picker). */
  list(status?: string): Observable<Template[]> {
    return this.api.get<Template[]>('/whatsapp/templates', { params: status ? { status } : undefined });
  }

  /** Creates a template on Meta (Marketing / Utility / Authentication). Managers/Admins only. */
  create(input: CreateTemplateInput): Observable<TemplateCreateResult> {
    return this.api.post<TemplateCreateResult>('/whatsapp/templates', input);
  }
}
