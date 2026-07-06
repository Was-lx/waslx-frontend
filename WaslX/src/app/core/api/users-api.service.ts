import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** Backend UserResponse shape. */
interface ApiUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  tenantId: number | null;
  roles: string[];
  isDisabled: boolean;
  isEmailConfirmed: boolean;
}

/** View-model used by the Users screens. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  emailConfirmed?: boolean;
  createdAt: string;
}

export interface InviteUserRequest {
  email: string;
  role: string;
  fullName?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly api = inject(ApiClientService);

  getUsers(): Observable<User[]> {
    return this.api.get<ApiUser[]>('/users').pipe(map((list) => list.map(toUser)));
  }

  /** Invite / create a user (backend emails a set-password link). */
  inviteUser(request: InviteUserRequest): Observable<string> {
    return this.api.post<string>('/users', {
      email: request.email,
      fullName: request.fullName?.trim() || request.email.split('@')[0],
      role: request.role,
    });
  }

  updateUserRole(userId: string, role: string): Observable<void> {
    return this.api.post<void>(`/users/${userId}/roles`, { role });
  }

  setUserStatus(userId: string, isActive: boolean): Observable<void> {
    return this.api.patch<void>(`/users/${userId}/status`, { isDisabled: !isActive });
  }

  updateUser(userId: string, fullName: string, phoneNumber: string | null): Observable<void> {
    return this.api.put<void>(`/users/${userId}`, { fullName, phoneNumber });
  }
}

function toUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.fullName,
    email: u.email,
    role: u.roles[0] ?? 'Agent',
    isActive: !u.isDisabled,
    emailConfirmed: u.isEmailConfirmed,
    createdAt: '',
  };
}
