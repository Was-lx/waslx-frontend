import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';

export interface UpdateProfileRequest {
  name: string;
  phone: string | null;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly api = inject(ApiClientService);

  /** Self-service profile edit (name + phone). Wired to PUT /me. */
  updateProfile(request: UpdateProfileRequest): Observable<void> {
    return this.api.put<void>('/me', { fullName: request.name, phone: request.phone });
  }

  /** Change own password. Wired to POST /auth/change-password. */
  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.api.post<void>('/auth/change-password', {
      oldPassword: request.currentPassword,
      newPassword: request.newPassword,
    });
  }
}
