import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';
import type { CreateTemplateInput, Template, TemplateCreateResult } from '../../features/templates/models/template.model';
import type { UploadedMedia } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class TemplatesApiService {
  private readonly api = inject(ApiClientService);
  private readonly http = inject(HttpClient);

  /** Lists the tenant's Meta templates, optionally filtered by status (e.g. 'APPROVED' for the picker). */
  list(status?: string): Observable<Template[]> {
    return this.api.get<Template[]>('/whatsapp/templates', { params: status ? { status } : undefined });
  }

  /** Creates a template on Meta (Marketing / Utility / Authentication). Managers/Admins only. */
  create(input: CreateTemplateInput): Observable<TemplateCreateResult> {
    return this.api.post<TemplateCreateResult>('/whatsapp/templates', input);
  }

  /** Uploads a file to permanent storage and returns its public URL, for use as a template media header. */
  uploadMedia(file: File): Observable<UploadedMedia> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<UploadedMedia>(`${environment.apiUrl}/whatsapp/media`, form);
  }
}
