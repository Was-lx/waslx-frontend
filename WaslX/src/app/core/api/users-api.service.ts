import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppRole } from '../services/auth-session.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  isActive: boolean;
  createdAt: string;
}

export interface InviteUserRequest {
  email: string;
  role: AppRole;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/users'; // Adjust according to actual backend endpoint

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  inviteUser(request: InviteUserRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/invite`, request);
  }

  updateUserRole(userId: string, role: AppRole): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${userId}/role`, { role });
  }

  setUserStatus(userId: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${userId}/status`, { isActive });
  }
}
