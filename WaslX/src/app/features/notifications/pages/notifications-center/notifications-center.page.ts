import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { NotificationsStore } from '../../../../core/services/notifications.store';
import {
  NotificationsApiService,
  notificationTarget,
  notificationVisual,
  type AppNotification,
  type NotificationTint,
} from '../../../../core/api/notifications-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type NotifFilter = 'all' | 'unread';

/** A notification prepared for the list: source row + resolved icon/tint/time. */
interface NotifRow {
  n: AppNotification;
  icon: string;
  tint: NotificationTint;
  timeLabel: string;
}

/**
 * Notifications center (FR-NOTIF · FE-5.7) — full history with an unread filter.
 * Reads the list from the API, keeps the bell badge in sync via NotificationsStore,
 * and live-prepends new pushes while open.
 */
@Component({
  selector: 'app-notifications-center-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './notifications-center.page.html',
  styleUrl: './notifications-center.page.css',
})
export class NotificationsCenterPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly api = inject(NotificationsApiService);
  private readonly store = inject(NotificationsStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly filter = signal<NotifFilter>('all');
  readonly loading = signal(true);
  readonly error = signal(false);
  private readonly all = signal<AppNotification[]>([]);

  readonly skeletonRows = Array.from({ length: 6 });

  readonly unreadCount = this.store.unreadCount;

  readonly rows = computed<NotifRow[]>(() => {
    const list = this.filter() === 'unread' ? this.all().filter((n) => !n.isRead) : this.all();
    return list.map((n) => this.toRow(n));
  });

  readonly isEmpty = computed(() => !this.loading() && !this.error() && this.rows().length === 0);

  constructor() {
    // Live-prepend pushes for the signed-in user while the page is open.
    this.store.incoming$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((n) => {
      this.all.update((list) => [n, ...list.filter((x) => x.id !== n.id)]);
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getNotifications(false, 200).subscribe({
      next: (list) => {
        this.all.set(list ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  setFilter(value: NotifFilter): void {
    this.filter.set(value);
  }

  markAllRead(): void {
    this.all.update((list) => list.map((n) => ({ ...n, isRead: true })));
    this.store.markAllRead();
  }

  open(row: NotifRow): void {
    if (!row.n.isRead) {
      this.all.update((list) => list.map((n) => (n.id === row.n.id ? { ...n, isRead: true } : n)));
      this.store.markRead(row.n.id);
    }
    const target = notificationTarget(row.n);
    if (target) {
      void this.router.navigate(target.commands, target.query ? { queryParams: target.query } : {});
    }
  }

  private toRow(n: AppNotification): NotifRow {
    const visual = notificationVisual(n.type);
    return { n, icon: visual.icon, tint: visual.tint, timeLabel: this.relativeTime(n.createdAt) };
  }

  /** Localised "5 minutes ago" / "منذ ٥ دقائق" via Intl (RTL-safe). */
  private relativeTime(iso: string): string {
    const then = new Date(iso).getTime();
    if (!Number.isFinite(then)) {
      return '';
    }
    const diffSec = Math.round((then - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    const rtf = new Intl.RelativeTimeFormat(this.languageService.language(), { numeric: 'auto' });
    if (abs < 60) {
      return rtf.format(Math.round(diffSec), 'second');
    }
    if (abs < 3600) {
      return rtf.format(Math.round(diffSec / 60), 'minute');
    }
    if (abs < 86400) {
      return rtf.format(Math.round(diffSec / 3600), 'hour');
    }
    if (abs < 604800) {
      return rtf.format(Math.round(diffSec / 86400), 'day');
    }
    return new Date(iso).toLocaleDateString(this.languageService.language(), {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
