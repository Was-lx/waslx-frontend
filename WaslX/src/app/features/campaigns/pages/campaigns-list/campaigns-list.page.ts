import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Campaign, CampaignStatus, CampaignsApiService } from '../../../../core/api/campaigns-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type StatusFilter = 'All' | CampaignStatus;

/** Proportional meter segments for a campaign row (read·delivered·sent shares of the audience). */
interface MeterShares {
  read: number;
  delivered: number;
  sent: number;
  failed: number;
}

@Component({
  selector: 'app-campaigns-list-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './campaigns-list.page.html',
  styleUrl: './campaigns-list.page.css',
})
export class CampaignsListPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(CampaignsApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly campaigns = signal<Campaign[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly search = signal('');
  readonly statusFilter = signal<StatusFilter>('All');

  readonly skeletonRows = Array.from({ length: 4 });

  readonly statusFilters: readonly { value: StatusFilter; key: TranslationKey }[] = [
    { value: 'All', key: 'cmpFilterAll' },
    { value: 'Draft', key: 'cmpFilterDraft' },
    { value: 'Scheduled', key: 'cmpFilterScheduled' },
    { value: 'Running', key: 'cmpFilterRunning' },
    { value: 'Paused', key: 'cmpFilterPaused' },
    { value: 'Completed', key: 'cmpFilterCompleted' },
    { value: 'Cancelled', key: 'cmpFilterCancelled' },
  ];

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.campaigns().filter((c) => {
      if (status !== 'All' && c.status !== status) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        c.name.toLowerCase().includes(term) || (c.templateName ?? '').toLowerCase().includes(term)
      );
    });
  });

  // ── Delete confirm ──
  readonly pendingDelete = signal<Campaign | null>(null);
  readonly deleting = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getCampaigns().subscribe({
      next: (list) => {
        this.campaigns.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  setStatusFilter(value: StatusFilter): void {
    this.statusFilter.set(value);
  }

  // ── Presentation helpers ──
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

  /** Segment widths as percentages of the audience for the compact row meter. */
  meterShares(c: Campaign): MeterShares {
    const total = Math.max(c.audienceSize, 1);
    const pct = (n: number) => Math.min(100, Math.round((n / total) * 100));
    // Sent is the outermost cohort; read ⊆ delivered ⊆ sent. Show non-overlapping bands.
    const read = pct(c.readCount);
    const delivered = Math.max(0, pct(c.deliveredCount) - read);
    const sent = Math.max(0, pct(c.sentCount) - pct(c.deliveredCount));
    const failed = pct(c.failedCount);
    return { read, delivered, sent, failed };
  }

  requestDelete(campaign: Campaign): void {
    this.pendingDelete.set(campaign);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const campaign = this.pendingDelete();
    if (!campaign || this.deleting()) {
      return;
    }
    this.deleting.set(true);
    this.api.deleteCampaign(campaign.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.campaigns.update((list) => list.filter((c) => c.id !== campaign.id));
        this.toast.success(this.t('cmpDeletedToast'), '');
      },
      error: (err) => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(this.t('cmpErrorToast'), apiErrorMessage(err, this.t('cmpErrorToast')));
      },
    });
  }

  formatSchedule(c: Campaign): string {
    if (!c.scheduledAt) {
      return c.status === 'Draft' ? this.t('cmpNotScheduled') : this.t('cmpImmediate');
    }
    const d = new Date(c.scheduledAt);
    return Number.isNaN(d.getTime())
      ? this.t('cmpNotScheduled')
      : d.toLocaleString(this.languageService.language() === 'ar' ? 'ar' : 'en', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  }
}
