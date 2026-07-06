import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { TenantProfile, UpdateTenantProfile } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
  private readonly api = inject(ApiClientService);

  getProfile(): Observable<TenantProfile> {
    return this.api.get<TenantProfile>('/workspace');
  }

  updateProfile(input: UpdateTenantProfile): Observable<void> {
    return this.api.put<void>('/workspace', input);
  }

  updateOnboarding(step: number, completed: boolean): Observable<void> {
    return this.api.put<void>('/workspace/onboarding', { step, completed });
  }
}
