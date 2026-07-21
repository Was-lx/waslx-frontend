import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { SuperAdminApiService } from '../../../../core/api/superadmin-api.service';
import type { HealthComponent, HealthStatus, SystemHealth } from '../../../../core/models/platform.models';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const POLL_MS = 15000;

/** Icon + label-key lookup keyed off the component's stable `key`. */
const COMPONENT_META: Record<string, { icon: string; labelKey: TranslationKey }> = {
  api: { icon: 'globe', labelKey: 'hlCompApi' },
  db: { icon: 'folder', labelKey: 'hlCompDb' },
  signalr: { icon: 'zap', labelKey: 'hlCompSignalr' },
  whatsapp: { icon: 'message', labelKey: 'hlCompWhatsapp' },
  ai: { icon: 'bot', labelKey: 'hlCompAi' },
  hangfire: { icon: 'clock', labelKey: 'hlCompHangfire' }
};

/**
 * FE-6.9 · System health board. One .ui-health-dot per monitored component with
 * status + latency, polled every ~15s. ok pulses softly; degraded/down are steady
 * (motion draws the eye to trouble, not calm — plan §05).
 */
@Component({
  selector: 'app-superadmin-health-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './health.page.html',
  styleUrl: './health.page.css'
})
export class SuperAdminHealthPageComponent implements OnInit, OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(SuperAdminApiService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly health = signal<SystemHealth | null>(null);
  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly error = signal(false);

  readonly skeletons = Array.from({ length: 6 });
  private timer: ReturnType<typeof setInterval> | null = null;

  readonly overallStatus = computed<HealthStatus>(() => this.health()?.status ?? 'ok');

  readonly counts = computed(() => {
    const comps = this.health()?.components ?? [];
    return {
      ok: comps.filter((c) => c.status === 'ok').length,
      degraded: comps.filter((c) => c.status === 'degraded').length,
      down: comps.filter((c) => c.status === 'down').length,
      total: comps.length
    };
  });

  ngOnInit(): void {
    this.load(true);
    this.timer = setInterval(() => this.load(false), POLL_MS);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  load(initial: boolean): void {
    if (initial) {
      this.loading.set(true);
    } else {
      this.refreshing.set(true);
    }
    this.api.getHealth().subscribe({
      next: (data) => {
        this.health.set(data);
        this.error.set(false);
        this.loading.set(false);
        this.refreshing.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.refreshing.set(false);
        // Keep the last-known board on a transient poll failure; only hard-fail
        // when we have nothing to show yet.
        if (!this.health()) {
          this.error.set(true);
        }
      }
    });
  }

  // ── Presentation ──
  dotClass(status: HealthStatus): string {
    return `ui-health-dot ui-health-dot--${status}`;
  }

  statusLabel(status: HealthStatus): string {
    const map: Record<HealthStatus, TranslationKey> = {
      ok: 'hlOk',
      degraded: 'hlDegraded',
      down: 'hlDown'
    };
    return this.t(map[status]);
  }

  overallLabel(): string {
    const map: Record<HealthStatus, TranslationKey> = {
      ok: 'hlStatusOk',
      degraded: 'hlStatusDegraded',
      down: 'hlStatusDown'
    };
    return this.t(map[this.overallStatus()]);
  }

  componentIcon(c: HealthComponent): string {
    return COMPONENT_META[c.key]?.icon ?? 'sliders';
  }

  componentName(c: HealthComponent): string {
    if (c.name?.trim()) {
      return c.name;
    }
    const meta = COMPONENT_META[c.key];
    return meta ? this.t(meta.labelKey) : c.key;
  }

  checkedLabel(): string {
    const iso = this.health()?.checkedAt;
    if (!iso) {
      return '';
    }
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return iso;
    }
    const time = d.toLocaleTimeString(this.languageService.language() === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return this.t('hlChecked').replace('{time}', time);
  }
}
