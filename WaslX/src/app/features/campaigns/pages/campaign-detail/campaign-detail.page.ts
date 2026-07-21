import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NgApexchartsModule,
  type ApexAxisChartSeries,
  type ApexNonAxisChartSeries,
  type ApexChart,
  type ApexPlotOptions,
  type ApexDataLabels,
  type ApexXAxis,
  type ApexLegend,
  type ApexTooltip,
  type ApexGrid,
} from 'ng-apexcharts';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  Campaign,
  CampaignRecipient,
  CampaignStatus,
  CampaignsApiService,
  RecipientStatus,
} from '../../../../core/api/campaigns-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

/**
 * Brand series palette for charts — these hex values mirror the tokens in src/styles.css
 * (--primary/--cyan/--accent/--primary-deep/--success/--warning/--danger). ApexCharts renders
 * to SVG and cannot read CSS custom properties, so the exact token values are echoed here.
 * No new colours are introduced.
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

type ConfirmKind = 'pause' | 'cancel';
type RecipientFilter = 'all' | RecipientStatus;

@Component({
  selector: 'app-campaign-detail-page',
  standalone: true,
  imports: [RouterLink, IconComponent, NgApexchartsModule],
  templateUrl: './campaign-detail.page.html',
  styleUrl: './campaign-detail.page.css',
})
export class CampaignDetailPageComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(CampaignsApiService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly campaignId = signal<number>(0);
  readonly campaign = signal<Campaign | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly notFound = signal(false);

  // ── Recipients ──
  readonly recipients = signal<CampaignRecipient[]>([]);
  readonly recipientsLoading = signal(true);
  readonly recipientFilter = signal<RecipientFilter>('all');

  // ── Controls ──
  readonly confirmKind = signal<ConfirmKind | null>(null);
  readonly acting = signal(false);
  readonly resuming = signal(false);

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  readonly skeletonRows = Array.from({ length: 5 });

  readonly recipientFilters: readonly { value: RecipientFilter; key: TranslationKey }[] = [
    { value: 'all', key: 'cmpRecipFilterAll' },
    { value: 'read', key: 'cmpRstRead' },
    { value: 'delivered', key: 'cmpRstDelivered' },
    { value: 'sent', key: 'cmpRstSent' },
    { value: 'queued', key: 'cmpRstQueued' },
    { value: 'failed', key: 'cmpRstFailed' },
  ];

  // ── Derived counts ──
  readonly queuedCount = computed(() => {
    const c = this.campaign();
    if (!c) {
      return 0;
    }
    return Math.max(0, c.audienceSize - c.sentCount - c.failedCount);
  });

  readonly deliveryPct = computed(() => {
    const c = this.campaign();
    if (!c || c.audienceSize === 0) {
      return 0;
    }
    return Math.min(100, Math.round((c.deliveredCount / c.audienceSize) * 100));
  });

  /** Non-overlapping meter bands as % of the audience. */
  readonly meterSegments = computed(() => {
    const c = this.campaign();
    if (!c || c.audienceSize === 0) {
      return { read: 0, delivered: 0, sent: 0, failed: 0 };
    }
    const total = c.audienceSize;
    const pct = (n: number) => Math.min(100, Math.round((n / total) * 100));
    const read = pct(c.readCount);
    const delivered = Math.max(0, pct(c.deliveredCount) - read);
    const sent = Math.max(0, pct(c.sentCount) - pct(c.deliveredCount));
    const failed = pct(c.failedCount);
    return { read, delivered, sent, failed };
  });

  readonly filteredRecipients = computed(() => {
    const f = this.recipientFilter();
    const list = this.recipients();
    return f === 'all' ? list : list.filter((r) => r.status === f);
  });

  readonly hasChartData = computed(() => {
    const c = this.campaign();
    return !!c && (c.sentCount > 0 || c.deliveredCount > 0 || c.readCount > 0 || c.failedCount > 0);
  });

  // ── Chart: delivery funnel (horizontal bars) ──
  readonly funnelSeries = computed<ApexAxisChartSeries>(() => {
    const c = this.campaign();
    return [
      {
        name: this.t('cmpDeliveryProgress'),
        data: [c?.sentCount ?? 0, c?.deliveredCount ?? 0, c?.readCount ?? 0],
      },
    ];
  });

  readonly funnelChart: ApexChart = {
    type: 'bar',
    height: 240,
    toolbar: { show: false },
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 420 },
  };

  readonly funnelPlot: ApexPlotOptions = {
    bar: { horizontal: true, borderRadius: 6, distributed: true, barHeight: '58%' },
  };

  readonly funnelColors = [BRAND.cyan, BRAND.primary, BRAND.success];

  readonly funnelXaxis = computed<ApexXAxis>(() => ({
    categories: [this.t('cmpFunnelSent'), this.t('cmpFunnelDelivered'), this.t('cmpFunnelRead')],
    labels: { style: { colors: BRAND.muted, fontFamily: 'Inter, sans-serif' } },
    axisBorder: { color: BRAND.grid },
    axisTicks: { color: BRAND.grid },
  }));

  readonly funnelDataLabels: ApexDataLabels = {
    enabled: true,
    style: { fontFamily: 'Inter, sans-serif', fontWeight: 700, colors: ['#fff'] },
  };

  readonly funnelGrid: ApexGrid = { borderColor: BRAND.grid, strokeDashArray: 4 };
  readonly funnelLegend: ApexLegend = { show: false };

  // ── Chart: status breakdown (donut) ──
  readonly breakdownSeries = computed<ApexNonAxisChartSeries>(() => {
    const seg = this.rawBreakdown();
    return [seg.read, seg.delivered, seg.sent, seg.queued, seg.failed];
  });

  readonly breakdownLabels = computed<string[]>(() => [
    this.t('cmpRstRead'),
    this.t('cmpRstDelivered'),
    this.t('cmpRstSent'),
    this.t('cmpBreakdownPending'),
    this.t('cmpRstFailed'),
  ]);

  readonly breakdownColors = [BRAND.success, BRAND.primary, BRAND.cyan, BRAND.muted, BRAND.danger];

  readonly breakdownChart: ApexChart = {
    type: 'donut',
    height: 240,
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: { enabled: true, speed: 420 },
  };

  readonly breakdownLegend: ApexLegend = {
    position: 'bottom',
    fontFamily: 'Inter, sans-serif',
    labels: { colors: BRAND.muted },
  };

  readonly breakdownTooltip: ApexTooltip = { fillSeriesColor: false };

  /** Current-state buckets for the donut (mutually exclusive). */
  private rawBreakdown(): { read: number; delivered: number; sent: number; queued: number; failed: number } {
    const c = this.campaign();
    if (!c) {
      return { read: 0, delivered: 0, sent: 0, queued: 0, failed: 0 };
    }
    const read = c.readCount;
    const delivered = Math.max(0, c.deliveredCount - c.readCount);
    const sent = Math.max(0, c.sentCount - c.deliveredCount);
    const failed = c.failedCount;
    const queued = Math.max(0, c.audienceSize - c.sentCount - c.failedCount);
    return { read, delivered, sent, queued, failed };
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.campaignId.set(id);
    this.load();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getCampaign(this.campaignId()).subscribe({
      next: (c) => {
        this.campaign.set(c);
        this.loading.set(false);
        this.loadRecipients();
        this.syncPolling(c.status);
      },
      error: (err) => {
        this.loading.set(false);
        if ((err as { status?: number })?.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set(true);
        }
      },
    });
  }

  private loadRecipients(): void {
    this.recipientsLoading.set(true);
    this.api.getRecipients(this.campaignId()).subscribe({
      next: (list) => {
        this.recipients.set(list);
        this.recipientsLoading.set(false);
      },
      error: () => this.recipientsLoading.set(false),
    });
  }

  /** Silent refresh (no spinners) — used by the live poll. */
  private refreshSilently(): void {
    this.api.getCampaign(this.campaignId()).subscribe({
      next: (c) => {
        this.campaign.set(c);
        this.syncPolling(c.status);
      },
      error: () => {},
    });
  }

  private syncPolling(status: CampaignStatus): void {
    if (status === 'Running') {
      this.startPolling();
    } else {
      this.stopPolling();
    }
  }

  private startPolling(): void {
    if (this.pollTimer) {
      return;
    }
    this.pollTimer = setInterval(() => this.refreshSilently(), 6000);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  setRecipientFilter(value: RecipientFilter): void {
    this.recipientFilter.set(value);
  }

  // ── Presentation ──
  statusPillClass(status: CampaignStatus): string {
    switch (status) {
      case 'Running':
        return 'ui-pill ui-pill--info ui-pill--dot';
      case 'Scheduled':
        return 'ui-pill ui-pill--info';
      case 'Completed':
        return 'ui-pill ui-pill--success';
      case 'Paused':
        return 'ui-pill ui-pill--warning';
      case 'Cancelled':
        return 'ui-pill ui-pill--danger';
      default:
        return 'ui-pill';
    }
  }

  statusLabel(status: CampaignStatus): string {
    const map: Record<CampaignStatus, TranslationKey> = {
      Draft: 'cmpStatusDraft',
      Scheduled: 'cmpStatusScheduled',
      Running: 'cmpStatusRunning',
      Paused: 'cmpStatusPaused',
      Completed: 'cmpStatusCompleted',
      Cancelled: 'cmpStatusCancelled',
    };
    return this.t(map[status]);
  }

  recipientPillClass(status: RecipientStatus): string {
    switch (status) {
      case 'read':
        return 'ui-pill ui-pill--success';
      case 'delivered':
        return 'ui-pill ui-pill--info';
      case 'sent':
        return 'ui-pill';
      case 'failed':
        return 'ui-pill ui-pill--danger';
      default:
        return 'ui-pill';
    }
  }

  recipientLabel(status: RecipientStatus): string {
    const map: Record<RecipientStatus, TranslationKey> = {
      queued: 'cmpRstQueued',
      sent: 'cmpRstSent',
      delivered: 'cmpRstDelivered',
      read: 'cmpRstRead',
      failed: 'cmpRstFailed',
    };
    return this.t(map[status]);
  }

  formatTime(iso: string | null): string {
    if (!iso) {
      return '—';
    }
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? '—'
      : d.toLocaleString(this.languageService.language() === 'ar' ? 'ar' : 'en', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }

  // ── Run controls ──
  get canPause(): boolean {
    return this.campaign()?.status === 'Running';
  }
  get canResume(): boolean {
    return this.campaign()?.status === 'Paused';
  }
  get canCancel(): boolean {
    const s = this.campaign()?.status;
    return s === 'Running' || s === 'Paused' || s === 'Scheduled';
  }
  get canEdit(): boolean {
    return this.campaign()?.status === 'Draft';
  }

  requestConfirm(kind: ConfirmKind): void {
    this.confirmKind.set(kind);
  }

  cancelConfirm(): void {
    if (this.acting()) {
      return;
    }
    this.confirmKind.set(null);
  }

  confirmAction(): void {
    const kind = this.confirmKind();
    const id = this.campaignId();
    if (!kind || this.acting()) {
      return;
    }
    this.acting.set(true);
    const op = kind === 'pause' ? this.api.pause(id) : this.api.cancel(id);
    op.subscribe({
      next: (c) => {
        this.acting.set(false);
        this.confirmKind.set(null);
        this.campaign.set(c);
        this.syncPolling(c.status);
        this.toast.success(kind === 'pause' ? this.t('cmpPausedToast') : this.t('cmpCancelledToast'), '');
      },
      error: (err) => {
        this.acting.set(false);
        this.confirmKind.set(null);
        this.toast.error(this.t('cmpErrorToast'), apiErrorMessage(err, this.t('cmpErrorToast')));
      },
    });
  }

  resume(): void {
    const id = this.campaignId();
    if (this.resuming()) {
      return;
    }
    this.resuming.set(true);
    this.api.resume(id).subscribe({
      next: (c) => {
        this.resuming.set(false);
        this.campaign.set(c);
        this.syncPolling(c.status);
        this.toast.success(this.t('cmpResumedToast'), '');
      },
      error: (err) => {
        this.resuming.set(false);
        this.toast.error(this.t('cmpErrorToast'), apiErrorMessage(err, this.t('cmpErrorToast')));
      },
    });
  }
}
