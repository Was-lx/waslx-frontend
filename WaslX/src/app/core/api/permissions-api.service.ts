import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { PermissionMatrix, PermissionUpdateItem } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class PermissionsApiService {
  private readonly api = inject(ApiClientService);

  getMatrix(): Observable<PermissionMatrix> {
    return this.api.get<PermissionMatrix>('/permissions');
  }

  update(changes: PermissionUpdateItem[]): Observable<void> {
    return this.api.put<void>('/permissions', { changes });
  }
}
