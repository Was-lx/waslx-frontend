import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type {
  AiCostOverview,
  BudgetAlert,
  BudgetAlertScope,
  UpsertBudgetAlert,
} from '../../../../core/models/platform.models';

/** Brand series palette echoed for ApexCharts (SVG can't read CSS vars). AI = purple. */
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

type GaugeTone = 'ok' | 'warning' | 'danger';

const CONTENT = {
  en: {
    eyebrow: 'Platform console',
    title: 'AI cost',
    subtitle: 'Spend across the whole AI pipeline, and the budgets that guard it.',
    totalCost: 'Total AI spend',
    costPer1k: 'Per 1k conversations',
    mtd: 'Month to date',
    projected: 'Projected this month',
    costTitle: 'Cost over time',
    costSub: 'Daily AI spend across all tenants',
    perTenantTitle: 'Cost per tenant',
    perTenantSub: 'Highest AI spend this period',
    modelMixTitle: 'Model mix',
    modelMixSub: 'Share of spend by model',
    budgetTitle: 'Monthly budget',
    budgetSub: 'Spend against the platform ceiling',
    costSeries: 'AI cost',
    ofBudget: 'of budget',
    budget: 'Budget',
    spent: 'Spent',
    noData: 'No cost data for this range yet.',
    loading: 'Loading AI cost…',
    errorTitle: 'Could not load AI cost',
    errorBody: 'Something went wrong reaching the platform service.',
    retry: 'Retry',
    emptyTitle: 'No AI spend yet',
    emptyBody: 'Once the AI pipeline processes conversations, spend shows here.',
    vsPrev: 'vs. previous period',
    // budget alerts
    alertsTitle: 'Budget alerts',
    alertsSub: 'Get warned before a ceiling is crossed.',
    scope: 'Scope',
    scopePlatform: 'Platform',
    scopeTenant: 'Tenant',
    monthlyLimit: 'Monthly limit (USD)',
    warnAt: 'Warn at (%)',
    addAlert: 'Add alert',
    saving: 'Saving…',
    noAlerts: 'No budget alerts configured yet.',
    warnAtShort: 'warn',
    activeLabel: 'Active',
    remove: 'Remove',
    createdToast: 'Budget alert created',
    deletedToast: 'Budget alert removed',
    updatedToast: 'Budget alert updated',
    saveErr: 'Could not save the alert',
    required: 'Required',
  },
  ar: {
    eyebrow: 'لوحة المنصة',
    title: 'تكلفة الذكاء',
    subtitle: 'الإنفاق عبر خط الذكاء الاصطناعي بالكامل، والميزانيات التي تحرسه.',
    totalCost: 'إجمالي إنفاق الذكاء',
    costPer1k: 'لكل ألف محادثة',
    mtd: 'منذ بداية الشهر',
    projected: 'المتوقع هذا الشهر',
    costTitle: 'التكلفة عبر الوقت',
    costSub: 'إنفاق الذكاء اليومي عبر كل المستأجرين',
    perTenantTitle: 'التكلفة لكل مستأجر',
    perTenantSub: 'أعلى إنفاق للذكاء هذه الفترة',
    modelMixTitle: 'توزيع النماذج',
    modelMixSub: 'حصة الإنفاق حسب النموذج',
    budgetTitle: 'الميزانية الشهرية',
    budgetSub: 'الإنفاق مقابل سقف المنصة',
    costSeries: 'تكلفة الذكاء',
    ofBudget: 'من الميزانية',
    budget: 'الميزانية',
    spent: 'المصروف',
    noData: 'لا توجد بيانات تكلفة لهذه الفترة بعد.',
    loading: 'جارٍ تحميل تكلفة الذكاء…',
    errorTitle: 'تعذّر تحميل تكلفة الذكاء',
    errorBody: 'حدث خطأ أثناء الاتصال بخدمة المنصة.',
    retry: 'إعادة المحاولة',
    emptyTitle: 'لا يوجد إنفاق للذكاء بعد',
    emptyBody: 'بمجرد أن يعالج خط الذكاء المحادثات، يظهر الإنفاق هنا.',
    vsPrev: 'مقارنة بالفترة السابقة',
    alertsTitle: 'تنبيهات الميزانية',
    alertsSub: 'احصل على تحذير قبل تجاوز السقف.',
    scope: 'النطاق',
    scopePlatform: 'المنصة',
    scopeTenant: 'مستأجر',
    monthlyLimit: 'الحد الشهري (دولار)',
    warnAt: 'التحذير عند (%)',
    addAlert: 'إضافة تنبيه',
    saving: 'جارٍ الحفظ…',
    noAlerts: 'لا توجد تنبيهات ميزانية بعد.',
    warnAtShort: 'تحذير',
    activeLabel: 'نشط',
    remove: 'إزالة',
    createdToast: 'تم إنشاء تنبيه الميزانية',
    deletedToast: 'تمت إزالة تنبيه الميزانية',
    updatedToast: 'تم تحديث تنبيه الميزانية',
    saveErr: 'تعذّر حفظ التنبيه',
    required: 'مطلوب',
  },
} as const;

@Component({
  selector: 'app-superadmin-ai-cost-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, NgApexchartsModule],
  templateUrl: './ai-cost.page.html',
  styleUrl: './ai-cost.page.css',
})
export class SuperAdminAiCostPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly direction = computed(() => this.languageService.getDirection(this.languageService.language()));
  readonly c = computed(() => CONTENT[this.languageService.language() === 'ar' ? 'ar' : 'en']);

  readonly data = signal<AiCostOverview | null>(null);
  readonly alerts = signal<BudgetAlert[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly busyAlertId = signal<number | null>(null);

  readonly skeletonTiles = [1, 2, 3, 4];

  readonly hasSeries = computed(() => (this.data()?.series?.length ?? 0) > 0);
  readonly hasPerTenant = computed(() => (this.data()?.perTenant?.length ?? 0) > 0);
  readonly hasModelMix = computed(() => (this.data()?.modelMix?.length ?? 0) > 0);
  readonly isEmpty = computed(() => {
    const d = this.data();
    if (!d) return true;
    return d.totalCost === 0 && d.conversations === 0;
  });

  readonly form = this.fb.group({
    scope: ['Platform' as BudgetAlertScope, Validators.required],
    monthlyLimit: [1000, [Validators.required, Validators.min(1)]],
    warnAtPct: [80, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    forkJoin({
      cost: this.api.getAiCost(),
      alerts: this.api.getBudgetAlerts(),
    }).subscribe({
      next: (r) => {
        this.data.set(r.cost);
        this.alerts.set(r.alerts ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // ── Budget gauge tone (trips warning → danger near threshold) ──
  readonly budgetPct = computed(() => {
    const d = this.data();
    if (!d || d.monthlyBudget <= 0) return 0;
    return Math.min(100, Math.round((d.monthToDateCost / d.monthlyBudget) * 100));
  });
  readonly gaugeTone = computed<GaugeTone>(() => {
    const pct = this.budgetPct();
    if (pct >= 100) return 'danger';
    if (pct >= 80) return 'warning';
    return 'ok';
  });
  private gaugeColor(): string {
    switch (this.gaugeTone()) {
      case 'danger': return BRAND.danger;
      case 'warning': return BRAND.warning;
      default: return BRAND.primary;
    }
  }

  readonly gaugeSeries = computed<number[]>(() => [this.budgetPct()]);
  readonly gaugeChart: ApexChart = {
    type: 'radialBar',
    height: 260,
    sparkline: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 500 },
  };
  readonly gaugeColors = computed<string[]>(() => [this.gaugeColor()]);
  readonly gaugePlot = computed<ApexPlotOptions>(() => ({
    radialBar: {
      startAngle: -120,
      endAngle: 120,
      hollow: { size: '62%' },
      track: { background: BRAND.grid, strokeWidth: '100%' },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: 6,
          fontSize: '1.6rem',
          fontWeight: 800,
          color: this.gaugeColor(),
          formatter: (v: number) => `${Math.round(v)}%`,
        },
      },
    },
  }));

  // ── Cost over time (area) ──
  readonly costSeries = computed<ApexAxisChartSeries>(() => [
    { name: this.c().costSeries, data: (this.data()?.series ?? []).map((p) => round2(p.cost)) },
  ]);
  readonly costChart: ApexChart = {
    type: 'area',
    height: 300,
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 450 },
  };
  // AI-related series is purple (--accent) across the whole product.
  readonly costColors = [BRAND.accent];
  readonly costStroke: ApexStroke = { curve: 'smooth', width: 2 };
  readonly costFill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.22, opacityTo: 0.02, stops: [0, 90, 100] },
  };
  readonly costXaxis = computed<ApexXAxis>(() => ({
    categories: (this.data()?.series ?? []).map((p) => shortDate(p.date, this.languageService.language())),
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, hideOverlappingLabels: true },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
    tooltip: { enabled: false },
  }));
  readonly costYaxis: ApexYAxis = {
    labels: {
      style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' },
      formatter: (v: number) => `$${compact(v)}`,
    },
    min: 0,
    forceNiceScale: true,
  };
  readonly costGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly costDataLabels: ApexDataLabels = { enabled: false };
  readonly costLegend: ApexLegend = { show: false };
  readonly costTooltip: ApexTooltip = { y: { formatter: (v: number) => `$${money(v)}` } };

  // ── Cost per tenant (horizontal bars) ──
  readonly perTenantSeries = computed<ApexAxisChartSeries>(() => [
    { name: this.c().costSeries, data: (this.data()?.perTenant ?? []).map((r) => round2(r.cost)) },
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
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' }, formatter: (v: string) => `$${compact(Number(v))}` },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
  }));
  readonly perTenantYaxis: ApexYAxis = { labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' } } };
  readonly perTenantGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly perTenantDataLabels: ApexDataLabels = { enabled: false };
  readonly perTenantLegend: ApexLegend = { show: false };
  readonly perTenantTooltip: ApexTooltip = { y: { formatter: (v: number) => `$${money(v)}` } };

  // ── Model mix (donut; agent model = purple) ──
  readonly modelSeries = computed<ApexNonAxisChartSeries>(() => (this.data()?.modelMix ?? []).map((m) => round2(m.cost)));
  readonly modelLabels = computed<string[]>(() => (this.data()?.modelMix ?? []).map((m) => m.model));
  readonly modelColors = computed<string[]>(() => {
    const palette = [BRAND.primary, BRAND.cyan, BRAND.primaryDeep, BRAND.success, BRAND.warning];
    let i = 0;
    return (this.data()?.modelMix ?? []).map((m) => (m.isAgent ? BRAND.accent : palette[i++ % palette.length]));
  });
  readonly modelChart: ApexChart = {
    type: 'donut',
    height: 280,
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 420 },
  };
  readonly modelLegend: ApexLegend = {
    position: 'bottom',
    fontFamily: 'Inter, sans-serif',
    labels: { colors: BRAND.muted },
    markers: { strokeWidth: 0 },
  };
  readonly modelPlot: ApexPlotOptions = { pie: { donut: { size: '68%' } } };
  readonly modelDataLabels: ApexDataLabels = { enabled: true, style: { fontFamily: 'Inter, sans-serif', fontWeight: 700 } };
  readonly modelTooltip: ApexTooltip = { fillSeriesColor: false, y: { formatter: (v: number) => `$${money(v)}` } };

  // ── Budget alert form ──
  submitAlert(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: UpsertBudgetAlert = {
      scope: (raw.scope ?? 'Platform') as BudgetAlertScope,
      tenantId: null,
      monthlyLimit: Number(raw.monthlyLimit ?? 0),
      warnAtPct: Number(raw.warnAtPct ?? 80) / 100,
      isActive: true,
    };
    this.submitting.set(true);
    this.api.createBudgetAlert(payload).subscribe({
      next: (created) => {
        this.alerts.update((list) => [created, ...list]);
        this.submitting.set(false);
        this.submitted.set(false);
        this.form.reset({ scope: 'Platform', monthlyLimit: 1000, warnAtPct: 80 });
        this.toast.success(this.c().createdToast, '');
      },
      error: () => {
        this.submitting.set(false);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }

  toggleAlert(alert: BudgetAlert): void {
    this.busyAlertId.set(alert.id);
    const next = !alert.isActive;
    this.api
      .updateBudgetAlert(alert.id, {
        scope: alert.scope,
        tenantId: alert.tenantId,
        monthlyLimit: alert.monthlyLimit,
        warnAtPct: alert.warnAtPct,
        isActive: next,
      })
      .subscribe({
        next: (updated) => {
          this.alerts.update((list) => list.map((a) => (a.id === alert.id ? updated : a)));
          this.busyAlertId.set(null);
          this.toast.success(this.c().updatedToast, '');
        },
        error: () => {
          this.busyAlertId.set(null);
          this.toast.error(this.c().saveErr, this.c().errorBody);
        },
      });
  }

  removeAlert(alert: BudgetAlert): void {
    this.busyAlertId.set(alert.id);
    this.api.deleteBudgetAlert(alert.id).subscribe({
      next: () => {
        this.alerts.update((list) => list.filter((a) => a.id !== alert.id));
        this.busyAlertId.set(null);
        this.toast.success(this.c().deletedToast, '');
      },
      error: () => {
        this.busyAlertId.set(null);
        this.toast.error(this.c().saveErr, this.c().errorBody);
      },
    });
  }

  // ── Presentation helpers ──
  money(v: number | null | undefined): string {
    return money(v ?? 0);
  }
  num(v: number | null | undefined): string {
    return formatNumber(v ?? 0, this.languageService.language());
  }
  warnPctLabel(a: BudgetAlert): string {
    return `${Math.round((a.warnAtPct ?? 0) * 100)}%`;
  }
  scopeLabel(scope: BudgetAlertScope): string {
    return scope === 'Tenant' ? this.c().scopeTenant : this.c().scopePlatform;
  }

  trendClass(delta: number | null | undefined): string {
    if (delta == null || delta === 0) return 'ui-trend ui-trend--flat';
    // Rising AI cost is a caution, not a win — flip good/bad.
    return delta > 0 ? 'ui-trend ui-trend--down' : 'ui-trend ui-trend--up';
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

  invalid(control: string): boolean {
    const ctl = this.form.get(control);
    return !!ctl && ctl.invalid && (ctl.touched || this.submitted());
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
function money(value: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
function compact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
