import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiClientService } from './api-client.service';

/** 0 = Sunday .. 6 = Saturday, matching the backend. */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ── Company working hours ──

/** Backend company working-hours day shape. */
interface ApiCompanyDay {
  dayOfWeek: number;
  isWorkingDay: boolean;
  startTime: string | null;
  endTime: string | null;
}

interface ApiCompanyWorkingHours {
  timeZoneId: string;
  days: ApiCompanyDay[];
}

/** A single day in the company working-hours schedule. */
export interface CompanyWorkingDay {
  dayOfWeek: DayOfWeek;
  isWorkingDay: boolean;
  /** "HH:mm" or null when the day is off. */
  startTime: string | null;
  endTime: string | null;
}

/** View-model for the company working-hours screen. */
export interface CompanyWorkingHours {
  timeZoneId: string;
  days: CompanyWorkingDay[];
}

/** Update payload for company working hours. */
export interface UpdateCompanyWorkingHoursRequest {
  timeZoneId?: string;
  days: CompanyWorkingDay[];
}

// ── Shifts ──

/** Backend shift day shape. */
interface ApiShiftDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

/** Backend ShiftResponse shape. */
interface ApiShift {
  id: number;
  name: string;
  days: ApiShiftDay[];
  agentCount: number;
}

/** A single working day inside a shift. */
export interface ShiftDay {
  dayOfWeek: DayOfWeek;
  /** "HH:mm". */
  startTime: string;
  endTime: string;
}

/** View-model for a working shift. */
export interface Shift {
  id: number;
  name: string;
  days: ShiftDay[];
  agentCount: number;
}

/** Create / update payload for a shift. */
export interface UpsertShiftRequest {
  name: string;
  days: ShiftDay[];
}

@Injectable({ providedIn: 'root' })
export class WorkingHoursApiService {
  private readonly api = inject(ApiClientService);

  getCompanyWorkingHours(): Observable<CompanyWorkingHours> {
    return this.api.get<ApiCompanyWorkingHours>('/working-hours/company').pipe(map(toCompanyWorkingHours));
  }

  updateCompanyWorkingHours(request: UpdateCompanyWorkingHoursRequest): Observable<CompanyWorkingHours> {
    return this.api
      .put<ApiCompanyWorkingHours>('/working-hours/company', request)
      .pipe(map(toCompanyWorkingHours));
  }

  // ── Shifts ──

  getShifts(): Observable<Shift[]> {
    return this.api.get<ApiShift[]>('/working-hours/shifts').pipe(map((list) => list.map(toShift)));
  }

  createShift(request: UpsertShiftRequest): Observable<Shift> {
    return this.api.post<ApiShift>('/working-hours/shifts', request).pipe(map(toShift));
  }

  updateShift(id: number, request: UpsertShiftRequest): Observable<Shift> {
    return this.api.put<ApiShift>(`/working-hours/shifts/${id}`, request).pipe(map(toShift));
  }

  deleteShift(id: number): Observable<void> {
    return this.api.delete<void>(`/working-hours/shifts/${id}`);
  }
}

function toCompanyWorkingHours(w: ApiCompanyWorkingHours): CompanyWorkingHours {
  return {
    timeZoneId: w.timeZoneId,
    days: (w.days ?? []).map((d) => ({
      dayOfWeek: d.dayOfWeek as DayOfWeek,
      isWorkingDay: d.isWorkingDay,
      startTime: d.startTime ?? null,
      endTime: d.endTime ?? null,
    })),
  };
}

function toShift(s: ApiShift): Shift {
  return {
    id: s.id,
    name: s.name,
    days: (s.days ?? []).map((d) => ({
      dayOfWeek: d.dayOfWeek as DayOfWeek,
      startTime: d.startTime,
      endTime: d.endTime,
    })),
    agentCount: s.agentCount ?? 0,
  };
}
