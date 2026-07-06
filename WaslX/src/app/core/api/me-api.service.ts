import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { Me } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class MeApiService {
  private readonly api = inject(ApiClientService);

  get(): Observable<Me> {
    return this.api.get<Me>('/me');
  }

  update(fullName: string, phone: string | null): Observable<void> {
    return this.api.put<void>('/me', { fullName, phone });
  }
}
