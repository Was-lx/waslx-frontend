import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { CreatePlatformAdmin, PlatformAdmin, PlatformUserStatus } from '../models/platform.models';

// ─────────────────────────────────────────────────────────────────────────────
// Platform Owner (SuperAdmin) users — the humans who operate WaslX itself.
// Backend: /api/superadmin/admins  (GET, POST, PATCH {id}/status).
//
// The backend expresses the enabled/disabled state as `isDisabled` (bool), not a
// `status` string — so we map both directions here. Casting the raw response to
// PlatformAdmin (as before) left `status` undefined, which made every admin — the
// signed-in SuperAdmin included — render as "Disabled".
// ─────────────────────────────────────────────────────────────────────────────

/** Raw row shape returned by the backend (SuperAdminUserResponse). */
interface ApiPlatformAdmin {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  isDisabled: boolean;
  emailConfirmed: boolean;
}

function toPlatformAdmin(a: ApiPlatformAdmin): PlatformAdmin {
  return {
    id: a.id,
    email: a.email,
    fullName: a.fullName,
    status: a.isDisabled ? 'Disabled' : 'Active',
    // The backend does not track these for platform users yet; keep the shape stable.
    createdAt: '',
    lastLoginAt: null
  };
}

@Injectable({ providedIn: 'root' })
export class AdminsApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<PlatformAdmin[]> {
    return this.api
      .get<ApiPlatformAdmin[]>('/superadmin/admins')
      .pipe(map((list) => (list ?? []).map(toPlatformAdmin)));
  }

  create(input: CreatePlatformAdmin): Observable<PlatformAdmin> {
    return this.api.post<ApiPlatformAdmin>('/superadmin/admins', input).pipe(map(toPlatformAdmin));
  }

  setStatus(id: string, status: PlatformUserStatus): Observable<void> {
    return this.api.patch<void>(`/superadmin/admins/${id}/status`, { isDisabled: status === 'Disabled' });
  }
}
