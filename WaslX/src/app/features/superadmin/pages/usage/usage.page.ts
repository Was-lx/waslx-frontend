import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  NgApexchartsModule,
  type ApexAxisChartSeries,
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

import { LanguageService } from '../../../../core/services/language.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type { UsageOverview } from '../../../../core/models/platform.models';

/**
 * Brand series palette — ApexCharts renders to SVG and cannot read CSS custom
 * properties, so the token hex values are echoed here (Design Law §06). No new
 * colours are introduced; series are DERIVED from the brand tokens. AI = purple.
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

const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    title: 'Global usage',
    subtitle: 'Volume across every tenant on the platform.',
    activeTenants: 'Active tenants',
    conversations: 'Conversations',
    messages: 'Messages',
    activeAgents: 'Active agents',
    volumeTitle: 'Volume over time',
    volumeSub: 'Conversations and messages, platform-wide',
    tenantsTrendTitle: 'Active tenants over time',
    tenantsTrendSub: 'Workspaces sending or receiving in each window',
    perTenantTitle: 'Busiest tenants',
    perTenantSub: 'Conversations this period, top workspaces',
    convSeries: 'Conversations',
    msgSeries: 'Messages',
    tenantsSeries: 'Active tenants',
    noData: 'No data for this range yet.',
    loading: 'Loading usage…',
    errorTitle: 'Could not load usage',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    emptyTitle: 'No usage yet',
    emptyBody: 'Once tenants start handling conversations, platform volume shows here.',
    vsPrev: 'vs. previous period',
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    title: 'الاستخدام العام',
    subtitle: 'الحجم عبر كل المستأجرين على المنصة.',
    activeTenants: 'المستأجرون النشطون',
    conversations: 'المحادثات',
    messages: 'الرسائل',
    activeAgents: 'الوكلاء النشطون',
    volumeTitle: 'الحجم عبر الوقت',
    volumeSub: 'المحادثات والرسائل على مستوى المنصة',
    tenantsTrendTitle: 'المستأجرون النشطون عبر الوقت',
    tenantsTrendSub: 'المساحات المرسلة أو المستقبلة في كل فترة',
    perTenantTitle: 'أكثر المستأجرين نشاطًا',
    perTenantSub: 'المحادثات هذه الفترة، أعلى المساحات',
    convSeries: 'المحادثات',
    msgSeries: 'الرسائل',
    tenantsSeries: 'المستأجرون النشطون',
    noData: 'لا توجد بيانات لهذه الفترة بعد.',
    loading: 'جارٍ تحميل الاستخدام…',
    errorTitle: 'تعذّر تحميل الاستخدام',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    emptyTitle: 'لا يوجد استخدام بعد',
    emptyBody: 'بمجرد أن يبدأ المستأجرون بمعالجة المحادثات، يظهر حجم المنصة هنا.',
    vsPrev: 'مقارنة بالفترة السابقة',
  },
} as const;

@Component({
  selector: 'app-superadmin-usage-page',
  standalone: true,
  imports: [IconComponent, NgApexchartsModule],
  templateUrl: './usage.page.html',
  styleUrl: './usage.page.css',
})
export class SuperAdminUsagePageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);

  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);

  readonly data = signal<UsageOverview | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly skeletonTiles = [1, 2, 3, 4];

  readonly hasSeries = computed(() => (this.data()?.series?.length ?? 0) > 0);
  readonly hasPerTenant = computed(() => (this.data()?.perTenant?.length ?? 0) > 0);
  readonly isEmpty = computed(() => {
    const d = this.data();
    if (!d) return true;
    return d.totalConversations === 0 && d.totalMessages === 0 && d.activeTenants === 0;
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getUsage().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // ── Volume chart (smooth area: conversations + messages) ──
  readonly volumeSeries = computed<ApexAxisChartSeries>(() => {
    const pts = this.data()?.series ?? [];
    return [
      { name: this.c().convSeries, data: pts.map((p) => p.conversations) },
      { name: this.c().msgSeries, data: pts.map((p) => p.messages) },
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
  // Not colour-alone: messages dashed, conversations solid.
  readonly volumeStroke: ApexStroke = { curve: 'smooth', width: 2, dashArray: [0, 5] };
  readonly volumeFill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.02, stops: [0, 90, 100] },
  };
  readonly volumeXaxis = computed<ApexXAxis>(() => ({
    categories: (this.data()?.series ?? []).map((p) => shortDate(p.date, this.languageService.language())),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, rotate: 0, hideOverlappingLabels: true },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
    tooltip: { enabled: false },
  }));
  readonly volumeYaxis: ApexYAxis = {
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, formatter: (v: number) => compact(v) },
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

  // ── Active-tenants trend (line) ──
  readonly tenantsSeries = computed<ApexAxisChartSeries>(() => [
    { name: this.c().tenantsSeries, data: (this.data()?.series ?? []).map((p) => p.activeTenants) },
  ]);
  readonly tenantsChart: ApexChart = {
    type: 'line',
    height: 240,
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 450 },
  };
  readonly tenantsColors = [BRAND.primaryDeep];
  readonly tenantsStroke: ApexStroke = { curve: 'smooth', width: 2 };
  readonly tenantsXaxis = computed<ApexXAxis>(() => ({
    categories: (this.data()?.series ?? []).map((p) => shortDate(p.date, this.languageService.language())),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, hideOverlappingLabels: true },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
    tooltip: { enabled: false },
  }));
  readonly tenantsYaxis: ApexYAxis = {
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' } },
    min: 0,
    forceNiceScale: true,
  };
  readonly tenantsGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly tenantsDataLabels: ApexDataLabels = { enabled: false };
  readonly tenantsLegend: ApexLegend = { show: false };
  readonly tenantsTooltip: ApexTooltip = { shared: false, intersect: false };

  // ── Per-tenant ranking (horizontal bars) ──
  readonly perTenantSeries = computed<ApexAxisChartSeries>(() => [
    { name: this.c().convSeries, data: (this.data()?.perTenant ?? []).map((r) => r.conversations) },
  ]);
  readonly perTenantChart = computed<ApexChart>(() => ({
    type: 'bar',
    height: Math.max(200, (this.data()?.perTenant?.length ?? 0) * 42 + 40),
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 420 },
  }));
  readonly perTenantColors = [BRAND.primary];
  readonly perTenantPlot: ApexPlotOptions = { bar: { horizontal: true, borderRadius: 5, barHeight: '58%' } };
  readonly perTenantXaxis = computed<ApexXAxis>(() => ({
    categories: (this.data()?.perTenant ?? []).map((r) => r.tenantName),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, formatter: (v: string) => compact(Number(v)) },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
  }));
  readonly perTenantYaxis: ApexYAxis = {
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' } },
  };
  readonly perTenantGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly perTenantDataLabels: ApexDataLabels = { enabled: false };
  readonly perTenantLegend: ApexLegend = { show: false };
  readonly perTenantTooltip: ApexTooltip = { shared: false, intersect: true };

  // ── KPI helpers ──
  num(v: number | null | undefined): string {
    return formatNumber(v ?? 0, this.languageService.language());
  }

  trendClass(delta: number | null | undefined): string {
    if (delta == null || delta === 0) return 'ui-trend ui-trend--flat';
    return delta > 0 ? 'ui-trend ui-trend--up' : 'ui-trend ui-trend--down';
  }
  trendText(delta: number | null | undefined): string {
    if (delta == null) return '—';
    const sign = delta > 0 ? '+' : '';
    return `${sign}${formatNumber(delta, this.languageService.language())}%`;
  }
  trendArrow(delta: number | null | undefined): string {
    if (delta == null || delta === 0) return '→';
    return delta > 0 ? '↑' : '↓';
  }
}

// ─── Pure helpers ────────────────────────────────────────────────────────────
function shortDate(iso: string, lang: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en', { month: 'short', day: 'numeric' });
}
function formatNumber(value: number, lang: string): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 1 }).format(value);
}
function compact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
