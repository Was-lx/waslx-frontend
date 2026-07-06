import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClientService } from './api-client.service';
import type { Plan, UpsertPlan } from '../models/platform.models';

@Injectable({ providedIn: 'root' })
export class PlansApiService {
  private readonly api = inject(ApiClientService);

  /** Public pricing — for the landing page & the in-app upgrade screen. */
  getPublic(): Observable<Plan[]> {
    return this.api.get<Plan[]>('/plans');
  }

  // ── SuperAdmin ──
  getAll(): Observable<Plan[]> {
    return this.api.get<Plan[]>('/superadmin/plans');
  }

  getById(id: number): Observable<Plan> {
    return this.api.get<Plan>(`/superadmin/plans/${id}`);
  }

  create(plan: UpsertPlan): Observable<Plan> {
    return this.api.post<Plan>('/superadmin/plans', plan);
  }

  update(id: number, plan: UpsertPlan): Observable<Plan> {
    return this.api.put<Plan>(`/superadmin/plans/${id}`, plan);
  }

  setActive(id: number, isActive: boolean): Observable<void> {
    return this.api.patch<void>(`/superadmin/plans/${id}/active`, { isActive });
  }
}
