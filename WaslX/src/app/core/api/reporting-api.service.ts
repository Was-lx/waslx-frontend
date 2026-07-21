import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';

// ─── Report keys ─────────────────────────────────────────────────────────────

/** The report sections the dashboard renders + the export target keys. */
export type ReportKey = 'overview' | 'agents' | 'response-times' | 'volume' | 'routing';
export type ExportFormat = 'csv' | 'pdf';

/** An inclusive from/to window (yyyy-MM-dd) that scopes every request on the page. */
export interface ReportRange {
  from: string;
  to: string;
}

// ─── Backend DTOs (internal) ─────────────────────────────────────────────────

interface ApiKpi {
  key: string;
  value: number | null;
  previousValue: number | null;
  deltaPct: number | null;
  format: string | null;
  spark: number[] | null;
}

interface ApiOverview {
  kpis: ApiKpi[] | null;
}

interface ApiVolumePoint {
  date: string;
  inbound: number | null;
  outbound: number | null;
}

interface ApiVolumeReport {
  points: ApiVolumePoint[] | null;
}

interface ApiAgentRow {
  userId: number;
  name: string | null;
  handled: number | null;
  avgResponseSec: number | null;
  resolutionRate: number | null;
  activeChats: number | null;
  spark: number[] | null;
}

interface ApiAgentReport {
  agents: ApiAgentRow[] | null;
}

interface ApiResponsePoint {
  date: string;
  firstResponseSec: number | null;
  resolutionSec: number | null;
}

interface ApiResponseBucket {
  label: string;
  count: number | null;
}

interface ApiResponseReport {
  series: ApiResponsePoint[] | null;
  distribution: ApiResponseBucket[] | null;
  slaPct: number | null;
}

interface ApiRoutingSlice {
  method: string;
  count: number | null;
}

interface ApiRoutingReport {
  slices: ApiRoutingSlice[] | null;
}

// ─── View-models (exported) ──────────────────────────────────────────────────

export type KpiFormat = 'number' | 'duration' | 'percent';

/** A single number + micro-trend for the KPI band (§06 · .ui-stat + .ui-sparkline). */
export interface ReportKpi {
  key: string;
  value: number;
  previousValue: number;
  deltaPct: number | null;
  format: KpiFormat;
  spark: number[];
}

export interface ReportOverview {
  kpis: ReportKpi[];
}

export interface VolumePoint {
  date: string;
  inbound: number;
  outbound: number;
}

export interface VolumeReport {
  points: VolumePoint[];
}

/** One row of the sortable agent-performance leaderboard. */
export interface AgentPerfRow {
  userId: number;
  name: string;
  handled: number;
  avgResponseSec: number;
  resolutionRate: number;
  activeChats: number;
  spark: number[];
}

export interface AgentReport {
  agents: AgentPerfRow[];
}

export interface ResponsePoint {
  date: string;
  firstResponseSec: number;
  resolutionSec: number;
}

export interface ResponseBucket {
  label: string;
  count: number;
}

export interface ResponseReport {
  series: ResponsePoint[];
  distribution: ResponseBucket[];
  slaPct: number;
}

export type RoutingMethod = 'manual' | 'roundRobin' | 'ai' | string;

export interface RoutingSlice {
  method: RoutingMethod;
  count: number;
}

export interface RoutingReport {
  slices: RoutingSlice[];
}

@Injectable({ providedIn: 'root' })
export class ReportingApiService {
  private readonly api = inject(ApiClientService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private rangeParams(range: ReportRange, teamId?: number | null): Record<string, string | number> {
    const params: Record<string, string | number> = { from: range.from, to: range.to };
    if (teamId != null) {
      params['teamId'] = teamId;
    }
    return params;
  }

  getOverview(range: ReportRange, teamId?: number | null): Observable<ReportOverview> {
    return this.api
      .get<ApiOverview>('/reports/overview', { params: this.rangeParams(range, teamId) })
      .pipe(map(toOverview));
  }

  getVolume(range: ReportRange, teamId?: number | null): Observable<VolumeReport> {
    return this.api
      .get<ApiVolumeReport>('/reports/volume', { params: this.rangeParams(range, teamId) })
      .pipe(map(toVolume));
  }

  getAgents(range: ReportRange, teamId?: number | null): Observable<AgentReport> {
    return this.api
      .get<ApiAgentReport>('/reports/agents', { params: this.rangeParams(range, teamId) })
      .pipe(map(toAgents));
  }

  getResponseTimes(range: ReportRange, teamId?: number | null): Observable<ResponseReport> {
    return this.api
      .get<ApiResponseReport>('/reports/response-times', { params: this.rangeParams(range, teamId) })
      .pipe(map(toResponse));
  }

  getRouting(range: ReportRange, teamId?: number | null): Observable<RoutingReport> {
    return this.api
      .get<ApiRoutingReport>('/reports/routing', { params: this.rangeParams(range, teamId) })
      .pipe(map(toRouting));
  }

  /**
   * Downloads a CSV / PDF snapshot of one report scoped to the current filters.
   * Uses HttpClient with `responseType: 'blob'` (the shared ApiClientService is JSON-only),
   * then triggers a browser download of the returned file.
   */
  exportReport(
    key: ReportKey,
    format: ExportFormat,
    range: ReportRange,
    teamId?: number | null,
  ): Observable<Blob> {
    const params: Record<string, string> = { format, from: range.from, to: range.to };
    if (teamId != null) {
      params['teamId'] = String(teamId);
    }
    return this.http.get(`${this.baseUrl}/reports/${key}/export`, {
      params,
      responseType: 'blob',
    });
  }

  /** Turns a returned Blob into a downloaded file in the browser. */
  triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Revoke on the next tick so the click has committed.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function toFormat(f: string | null): KpiFormat {
  return f === 'duration' || f === 'percent' ? f : 'number';
}

function toKpi(k: ApiKpi): ReportKpi {
  return {
    key: k.key,
    value: k.value ?? 0,
    previousValue: k.previousValue ?? 0,
    deltaPct: k.deltaPct ?? null,
    format: toFormat(k.format),
    spark: k.spark ?? [],
  };
}

function toOverview(o: ApiOverview): ReportOverview {
  return { kpis: (o?.kpis ?? []).map(toKpi) };
}

function toVolume(v: ApiVolumeReport): VolumeReport {
  return {
    points: (v?.points ?? []).map((p) => ({
      date: p.date,
      inbound: p.inbound ?? 0,
      outbound: p.outbound ?? 0,
    })),
  };
}

function toAgents(a: ApiAgentReport): AgentReport {
  return {
    agents: (a?.agents ?? []).map((r) => ({
      userId: r.userId,
      name: r.name ?? '—',
      handled: r.handled ?? 0,
      avgResponseSec: r.avgResponseSec ?? 0,
      resolutionRate: r.resolutionRate ?? 0,
      activeChats: r.activeChats ?? 0,
      spark: r.spark ?? [],
    })),
  };
}

function toResponse(r: ApiResponseReport): ResponseReport {
  return {
    series: (r?.series ?? []).map((p) => ({
      date: p.date,
      firstResponseSec: p.firstResponseSec ?? 0,
      resolutionSec: p.resolutionSec ?? 0,
    })),
    distribution: (r?.distribution ?? []).map((b) => ({ label: b.label, count: b.count ?? 0 })),
    slaPct: r?.slaPct ?? 0,
  };
}

function toRouting(r: ApiRoutingReport): RoutingReport {
  return {
    slices: (r?.slices ?? []).map((s) => ({ method: s.method, count: s.count ?? 0 })),
  };
}
