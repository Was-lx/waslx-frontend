import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';

import { ImpersonationService } from '../../../../core/services/impersonation.service';
import { LanguageService, type TranslationKey } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

/**
 * FE-6.8 · The persistent, non-dismissible impersonation banner.
 *
 * Mounted once in the app shell (base layout) so it survives route changes.
 * Renders nothing unless an impersonation session is active; when it is, it
 * shows "Viewing as {tenant} · started {time} · expires in {countdown}" with a
 * one-click Exit. It slides down once on enter (via .ui-banner--enter) then
 * stays put — the countdown is the only thing that updates.
 */
@Component({
  selector: 'app-impersonation-banner',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './impersonation-banner.component.html'
})
export class ImpersonationBannerComponent implements OnInit, OnDestroy {
  private readonly impersonation = inject(ImpersonationService);
  private readonly languageService = inject(LanguageService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly session = this.impersonation.active;
  readonly exiting = signal(false);

  /** Ticks every second so the countdown recomputes live. */
  private readonly now = signal(Date.now());
  private timer: ReturnType<typeof setInterval> | null = null;

  /** Milliseconds remaining until the session's ExpiresAt (clamped at 0). */
  readonly remainingMs = computed(() => {
    const s = this.session();
    if (!s) {
      return 0;
    }
    const end = new Date(s.expiresAt).getTime();
    if (Number.isNaN(end)) {
      return 0;
    }
    return Math.max(0, end - this.now());
  });

  readonly expired = computed(() => this.session() !== null && this.remainingMs() === 0);

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.now.set(Date.now());
      // Auto-exit the moment the short-lived session lapses.
      if (this.session() && this.remainingMs() === 0) {
        this.impersonation.expire();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  countdown(): string {
    const total = Math.floor(this.remainingMs() / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  startedLabel(): string {
    const s = this.session();
    if (!s) {
      return '';
    }
    const d = new Date(s.startedAt);
    if (Number.isNaN(d.getTime())) {
      return s.startedAt;
    }
    return d.toLocaleTimeString(this.languageService.language() === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewingText(): string {
    return this.t('impBannerViewing').replace('{tenant}', this.session()?.tenantName ?? '');
  }

  startedText(): string {
    return this.t('impBannerStarted').replace('{time}', this.startedLabel());
  }

  expiresText(): string {
    return this.t('impBannerExpiresIn').replace('{time}', this.countdown());
  }

  exit(): void {
    if (this.exiting()) {
      return;
    }
    this.exiting.set(true);
    const result = this.impersonation.end();
    if (!result) {
      this.exiting.set(false);
      this.toast.info(this.t('impEndedToast'), '');
      return;
    }
    result.subscribe({
      next: () => {
        this.exiting.set(false);
        this.toast.info(this.t('impEndedToast'), '');
      },
      error: () => {
        // Token is already restored locally; surface a soft notice only.
        this.exiting.set(false);
        this.toast.info(this.t('impEndedToast'), '');
      }
    });
  }
}
