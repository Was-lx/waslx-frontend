import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/profile'; // Adjust based on real backend

  updateProfile(request: UpdateProfileRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`/api/auth/change-password`, request); // Typical path
  }
}
