import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  NgApexchartsModule,
  type ApexAxisChartSeries,
  type ApexNonAxisChartSeries,
  type ApexChart,
  type ApexStroke,
  type ApexFill,
  type ApexXAxis,
  type ApexYAxis,
  type ApexGrid,
  type ApexLegend,
  type ApexTooltip,
  type ApexDataLabels,
  type ApexPlotOptions,
} from 'ng-apexcharts';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { AuthSessionService, type AppRole } from '../../../../core/services/auth-session.service';
import { ToastService } from '../../../../core/services/toast.service';
import { GroupsApiService, type Group } from '../../../../core/api/groups-api.service';
import {
  ReportingApiService,
  type ReportRange,
  type ReportOverview,
  type VolumeReport,
  type AgentReport,
  type AgentPerfRow,
  type ResponseReport,
  type RoutingReport,
  type ReportKpi,
  type ExportFormat,
} from '../../../../core/api/reporting-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

/**
 * Brand series palette for charts — these hex values mirror the tokens in src/styles.css.
 * ApexCharts renders to SVG and cannot read CSS custom properties, so the exact token
 * values are echoed here. No new colours are introduced (Design Law §06). AI series = purple.
 */
const BRAND = {
  primary: '#2563eb',
  cyan: '#06b6d4',
  accent: '#8b5cf6',
  primaryDeep: '#1e3a8a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  grid: '#e2e8f0',
  muted: '#94a3b8',
} as const;

type RangePreset = 'today' | '7d' | '30d' | 'custom';
type AgentSortKey = 'name' | 'handled' | 'avgResponseSec' | 'resolutionRate' | 'activeChats';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-reporting-dashboard-page',
  standalone: true,
  imports: [IconComponent, NgApexchartsModule],
  templateUrl: './reporting-dashboard.page.html',
  styleUrl: './reporting-dashboard.page.css',
})
export class ReportingDashboardPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly auth = inject(AuthSessionService);
  private readonly api = inject(ReportingApiService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ── Role scope ──
  readonly role = signal<AppRole | null>(this.auth.getPrimaryRole());
  readonly isAgent = computed(() => this.role() === 'Agent');
  readonly canFilterTeam = computed(() => this.role() === 'Admin' || this.role() === 'Manager');

  // ── Filters ──
  readonly preset = signal<RangePreset>('30d');
  readonly customFrom = signal<string>(isoDaysAgo(29));
  readonly customTo = signal<string>(isoToday());
  readonly rangePopoverOpen = signal(false);

  readonly teams = signal<Group[]>([]);
  readonly teamId = signal<number | null>(null);

  readonly exportMenuOpen = signal(false);
  readonly exporting = signal(false);

  readonly range = computed<ReportRange>(() => {
    switch (this.preset()) {
      case 'today':
        return { from: isoToday(), to: isoToday() };
      case '7d':
        return { from: isoDaysAgo(6), to: isoToday() };
      case 'custom':
        return { from: this.customFrom(), to: this.customTo() };
      case '30d':
      default:
        return { from: isoDaysAgo(29), to: isoToday() };
    }
  });

  readonly presets: readonly { value: RangePreset; key: TranslationKey }[] = [
    { value: 'today', key: 'rptRangeToday' },
    { value: '7d', key: 'rptRange7d' },
    { value: '30d', key: 'rptRange30d' },
    { value: 'custom', key: 'rptRangeCustom' },
  ];

  // ── Data ──
  readonly overview = signal<ReportOverview>({ kpis: [] });
  readonly volume = signal<VolumeReport>({ points: [] });
  readonly agentReport = signal<AgentReport>({ agents: [] });
  readonly response = signal<ResponseReport>({ series: [], distribution: [], slaPct: 0 });
  readonly routing = signal<RoutingReport>({ slices: [] });

  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly error = signal(false);

  // ── Leaderboard sort ──
  readonly sortKey = signal<AgentSortKey>('handled');
  readonly sortDir = signal<SortDir>('desc');

  readonly skeletonTiles = Array.from({ length: 4 });
  readonly skeletonKpis = Array.from({ length: 5 });

  // ── Derived presence flags ──
  readonly hasVolume = computed(() => this.volume().points.length > 0);
  readonly hasAgents = computed(() => this.agentReport().agents.length > 0);
  readonly hasResponse = computed(() => this.response().series.length > 0);
  readonly hasRouting = computed(() => this.routing().slices.some((s) => s.count > 0));
  readonly hasKpis = computed(() => this.overview().kpis.some((k) => k.value !== 0));

  readonly isEmpty = computed(
    () => !this.hasVolume() && !this.hasAgents() && !this.hasResponse() && !this.hasRouting() && !this.hasKpis(),
  );

  readonly sortedAgents = computed<AgentPerfRow[]>(() => {
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...this.agentReport().agents].sort((a, b) => {
      if (key === 'name') {
        return a.name.localeCompare(b.name) * dir;
      }
      return (a[key] - b[key]) * dir;
    });
  });

  // ── Volume chart (stacked smooth area) ──
  readonly volumeSeries = computed<ApexAxisChartSeries>(() => {
    const pts = this.volume().points;
    return [
      { name: this.t('rptVolumeInbound'), data: pts.map((p) => p.inbound) },
      { name: this.t('rptVolumeOutbound'), data: pts.map((p) => p.outbound) },
    ];
  });
  readonly volumeChart: ApexChart = {
    type: 'area',
    height: 300,
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 450 },
  };
  readonly volumeColors = [BRAND.primary, BRAND.cyan];
  // Not-colour-alone: outbound is dashed, inbound solid.
  readonly volumeStroke: ApexStroke = { curve: 'smooth', width: 2, dashArray: [0, 5] };
  readonly volumeFill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 90, 100] },
  };
  readonly volumeXaxis = computed<ApexXAxis>(() => ({
    categories: this.volume().points.map((p) => shortDate(p.date, this.languageService.language())),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, rotate: 0, hideOverlappingLabels: true },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
    tooltip: { enabled: false },
  }));
  readonly volumeYaxis: ApexYAxis = {
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' } },
    min: 0,
    forceNiceScale: true,
  };
  readonly volumeGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly volumeDataLabels: ApexDataLabels = { enabled: false };
  readonly volumeLegend: ApexLegend = {
    position: 'top',
    horizontalAlign: 'right',
    fontFamily: 'Inter, sans-serif',
    labels: { colors: BRAND.muted },
    markers: { strokeWidth: 0 },
  };
  readonly volumeTooltip: ApexTooltip = { shared: true, intersect: false };

  // ── Response & resolution chart (line, minutes) ──
  readonly responseSeries = computed<ApexAxisChartSeries>(() => {
    const s = this.response().series;
    return [
      { name: this.t('rptRespFirst'), data: s.map((p) => Math.round(p.firstResponseSec / 60)) },
      { name: this.t('rptRespResolution'), data: s.map((p) => Math.round(p.resolutionSec / 60)) },
    ];
  });
  readonly responseChart: ApexChart = {
    type: 'line',
    height: 240,
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 450 },
  };
  readonly responseColors = [BRAND.primary, BRAND.primaryDeep];
  readonly responseStroke: ApexStroke = { curve: 'smooth', width: 2, dashArray: [0, 6] };
  readonly responseXaxis = computed<ApexXAxis>(() => ({
    categories: this.response().series.map((p) => shortDate(p.date, this.languageService.language())),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, hideOverlappingLabels: true },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
    tooltip: { enabled: false },
  }));
  readonly responseYaxis: ApexYAxis = {
    labels: {
      style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' },
      formatter: (v: number) => `${Math.round(v)}m`,
    },
    min: 0,
    forceNiceScale: true,
  };
  readonly responseGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly responseDataLabels: ApexDataLabels = { enabled: false };
  readonly responseLegend: ApexLegend = {
    position: 'top',
    horizontalAlign: 'right',
    fontFamily: 'Inter, sans-serif',
    labels: { colors: BRAND.muted },
    markers: { strokeWidth: 0 },
  };
  readonly responseTooltip: ApexTooltip = {
    shared: true,
    intersect: false,
    y: { formatter: (v: number) => `${v}m` },
  };

  // ── Response-time distribution (bars) ──
  readonly distSeries = computed<ApexAxisChartSeries>(() => [
    { name: this.t('rptRespDistribution'), data: this.response().distribution.map((b) => b.count) },
  ]);
  readonly distChart: ApexChart = {
    type: 'bar',
    height: 150,
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 420 },
  };
  readonly distColors = [BRAND.cyan];
  readonly distPlot: ApexPlotOptions = { bar: { borderRadius: 5, columnWidth: '52%' } };
  readonly distXaxis = computed<ApexXAxis>(() => ({
    categories: this.response().distribution.map((b) => b.label),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' } },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
  }));
  readonly distYaxis: ApexYAxis = { labels: { show: false }, min: 0 };
  readonly distGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly distDataLabels: ApexDataLabels = {
    enabled: true,
    style: { fontFamily: 'Inter, sans-serif', fontWeight: 700, colors: [BRAND.primaryDeep] },
    offsetY: -18,
  };
  readonly distLegend: ApexLegend = { show: false };

  // ── Routing donut ──
  readonly routingSeries = computed<ApexNonAxisChartSeries>(() =>
    this.routing().slices.map((s) => s.count),
  );
  readonly routingLabels = computed<string[]>(() =>
    this.routing().slices.map((s) => this.methodLabel(s.method)),
  );
  readonly routingColors = computed<string[]>(() =>
    this.routing().slices.map((s) => this.methodColor(s.method)),
  );
  readonly routingChart: ApexChart = {
    type: 'donut',
    height: 260,
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 420 },
  };
  readonly routingLegend: ApexLegend = {
    position: 'bottom',
    fontFamily: 'Inter, sans-serif',
    labels: { colors: BRAND.muted },
    markers: { strokeWidth: 0 },
  };
  readonly routingPlot: ApexPlotOptions = {
    pie: { donut: { size: '68%' } },
  };
  readonly routingDataLabels: ApexDataLabels = {
    enabled: true,
    style: { fontFamily: 'Inter, sans-serif', fontWeight: 700 },
  };
  readonly routingTooltip: ApexTooltip = { fillSeriesColor: false };

  ngOnInit(): void {
    if (this.canFilterTeam()) {
      this.groupsApi.getGroups().subscribe({
        next: (list) => this.teams.set(list),
        error: () => {},
      });
    }
    this.load(true);
  }

  // ── Loading ──
  load(initial = false): void {
    if (initial) {
      this.loading.set(true);
    } else {
      this.refreshing.set(true);
    }
    this.error.set(false);
    const range = this.range();
    const team = this.canFilterTeam() ? this.teamId() : null;

    forkJoin({
      overview: this.api.getOverview(range, team),
      volume: this.api.getVolume(range, team),
      agents: this.api.getAgents(range, team),
      response: this.api.getResponseTimes(range, team),
      routing: this.api.getRouting(range, team),
    }).subscribe({
      next: (r) => {
        this.overview.set(r.overview);
        this.volume.set(r.volume);
        this.agentReport.set(r.agents);
        this.response.set(r.response);
        this.routing.set(r.routing);
        this.loading.set(false);
        this.refreshing.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.refreshing.set(false);
        this.error.set(true);
      },
    });
  }

  // ── Filter actions ──
  selectPreset(value: RangePreset): void {
    if (value === 'custom') {
      this.preset.set('custom');
      this.rangePopoverOpen.set(true);
      return;
    }
    this.rangePopoverOpen.set(false);
    if (this.preset() === value) {
      return;
    }
    this.preset.set(value);
    this.load();
  }

  applyCustomRange(): void {
    this.rangePopoverOpen.set(false);
    this.load();
  }

  setCustomFrom(value: string): void {
    this.customFrom.set(value);
  }
  setCustomTo(value: string): void {
    this.customTo.set(value);
  }

  onTeamChange(value: string): void {
    this.teamId.set(value ? Number(value) : null);
    this.load();
  }

  resetRange(): void {
    this.preset.set('30d');
    this.teamId.set(null);
    this.load();
  }

  toggleRangePopover(event: Event): void {
    event.stopPropagation();
    this.rangePopoverOpen.update((v) => !v);
    this.exportMenuOpen.set(false);
  }

  toggleExportMenu(event: Event): void {
    event.stopPropagation();
    this.exportMenuOpen.update((v) => !v);
    this.rangePopoverOpen.set(false);
  }

  @HostListener('document:click')
  closeOverlays(): void {
    this.exportMenuOpen.set(false);
    this.rangePopoverOpen.set(false);
  }

  stop(event: Event): void {
    event.stopPropagation();
  }

  // ── Leaderboard sort ──
  toggleSort(key: AgentSortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set(key === 'name' ? 'asc' : 'desc');
    }
  }

  sortIndicator(key: AgentSortKey): string {
    if (this.sortKey() !== key) {
      return '';
    }
    return this.sortDir() === 'asc' ? '▲' : '▼';
  }

  // ── Export ──
  exportReport(format: ExportFormat): void {
    if (this.exporting()) {
      return;
    }
    this.exportMenuOpen.set(false);
    this.exporting.set(true);
    const range = this.range();
    const team = this.canFilterTeam() ? this.teamId() : null;
    this.api.exportReport('overview', format, range, team).subscribe({
      next: (blob) => {
        this.exporting.set(false);
        const name = `waslx-report_${range.from}_${range.to}.${format}`;
        this.api.triggerDownload(blob, name);
        this.toast.success(this.t('rptExportedToast'), name);
      },
      error: (err) => {
        this.exporting.set(false);
        this.toast.error(this.t('rptExportFailToast'), apiErrorMessage(err, this.t('rptExportFailToast')));
      },
    });
  }

  // ── KPI presentation ──
  kpiLabel(k: ReportKpi): string {
    const map: Record<string, TranslationKey> = {
      volume: 'rptKpiVolume',
      firstResponse: 'rptKpiFirstResponse',
      resolution: 'rptKpiResolution',
      aiShare: 'rptKpiAiShare',
      csat: 'rptKpiCsat',
      active: 'rptKpiActive',
    };
    const key = map[k.key];
    return key ? this.t(key) : k.key;
  }

  kpiValue(k: ReportKpi): string {
    switch (k.format) {
      case 'duration':
        return formatDuration(k.value);
      case 'percent':
        return `${formatNumber(k.value, this.languageService.language())}%`;
      default:
        return formatNumber(k.value, this.languageService.language());
    }
  }

  /** Lower is better for latency metrics — flips the good/bad tone. */
  private lowerIsBetter(key: string): boolean {
    return key === 'firstResponse' || key === 'resolution';
  }

  trendClass(k: ReportKpi): string {
    if (k.deltaPct == null || k.deltaPct === 0) {
      return 'ui-trend ui-trend--flat';
    }
    const rising = k.deltaPct > 0;
    const good = this.lowerIsBetter(k.key) ? !rising : rising;
    return good ? 'ui-trend ui-trend--up' : 'ui-trend ui-trend--down';
  }

  trendText(k: ReportKpi): string {
    if (k.deltaPct == null) {
      return '—';
    }
    const sign = k.deltaPct > 0 ? '+' : '';
    return `${sign}${formatNumber(k.deltaPct, this.languageService.language())}%`;
  }

  trendArrow(k: ReportKpi): string {
    if (k.deltaPct == null || k.deltaPct === 0) {
      return '→';
    }
    return k.deltaPct > 0 ? '↑' : '↓';
  }

  /** Builds an SVG polyline path (viewBox 0 0 100 32) for a .ui-sparkline. */
  sparkPath(values: number[]): string {
    if (!values || values.length === 0) {
      return '';
    }
    if (values.length === 1) {
      return 'M0,16 L100,16';
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = 100 / (values.length - 1);
    return values
      .map((v, i) => {
        const x = i * stepX;
        const y = 30 - ((v - min) / span) * 28;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  // ── Agent cells ──
  formatResponse(sec: number): string {
    return formatDuration(sec);
  }
  formatPercent(v: number): string {
    return `${formatNumber(v, this.languageService.language())}%`;
  }
  formatCount(v: number): string {
    return formatNumber(v, this.languageService.language());
  }

  slaPct(): string {
    return `${formatNumber(this.response().slaPct, this.languageService.language())}%`;
  }

  // ── Routing helpers ──
  methodLabel(method: string): string {
    switch (method) {
      case 'manual':
        return this.t('rptRouteManual');
      case 'roundRobin':
        return this.t('rptRouteRoundRobin');
      case 'ai':
        return this.t('rptRouteAi');
      default:
        return method;
    }
  }
  private methodColor(method: string): string {
    switch (method) {
      case 'manual':
        return BRAND.primary;
      case 'roundRobin':
        return BRAND.cyan;
      case 'ai':
        return BRAND.accent;
      default:
        return BRAND.muted;
    }
  }
}

// ─── Pure helpers ────────────────────────────────────────────────────────────

function isoToday(): string {
  return toIso(new Date());
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toIso(d);
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function shortDate(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en', { month: 'short', day: 'numeric' });
}

function formatNumber(value: number, lang: string): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 1 }).format(value);
}

function formatDuration(sec: number): string {
  if (!sec || sec <= 0) {
    return '0s';
  }
  if (sec < 60) {
    return `${Math.round(sec)}s`;
  }
  if (sec < 3600) {
    return `${Math.round(sec / 60)}m`;
  }
  return `${(sec / 3600).toFixed(1)}h`;
}
