import { Component, DestroyRef, computed, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { PermissionsStore } from '../../../../core/services/permissions.store';
import { AgentsApiService, type AgentAvailability } from '../../../../core/api/agents-api.service';
import { InboxRealtimeService } from '../../../../core/services/inbox-realtime.service';
import { NotificationsStore } from '../../../../core/services/notifications.store';
import {
  notificationTarget,
  notificationVisual,
  type AppNotification,
  type NotificationTint,
} from '../../../../core/api/notifications-api.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const CONTENT = {
  en: {
    search: 'Search workspace…',
    notifications: 'Notifications',
    notifEmpty: "You're all caught up",
    notifHint: 'New activity will show up here.',
    accountSettings: 'Account & password',
    signOut: 'Sign out',
    theme: 'Toggle theme',
    language: 'العربية',
    openMenu: 'Open navigation',
    presence: 'Availability',
    available: 'Available',
    onBreak: 'On break',
    goOnBreak: 'Go on break',
    endBreak: 'End break',
    breakHint: "You won't receive new conversation assignments while on break.",
  },
  ar: {
    search: 'ابحث في مساحة العمل…',
    notifications: 'الإشعارات',
    notifEmpty: 'مفيش جديد دلوقتي',
    notifHint: 'أي نشاط جديد هيظهر هنا.',
    accountSettings: 'الحساب وكلمة المرور',
    signOut: 'تسجيل الخروج',
    theme: 'تبديل المظهر',
    language: 'English',
    openMenu: 'فتح التنقل',
    presence: 'الحالة',
    available: 'متاح',
    onBreak: 'في استراحة',
    goOnBreak: 'بدء استراحة',
    endBreak: 'إنهاء الاستراحة',
    breakHint: 'لن تصلك محادثات جديدة أثناء الاستراحة.',
  },
} as const;

/** A notification prepared for the panel: source row + resolved icon/tint/time. */
interface NotifRow {
  n: AppNotification;
  icon: string;
  tint: NotificationTint;
  timeLabel: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);
  private readonly permissions = inject(PermissionsStore);
  private readonly agentsApi = inject(AgentsApiService);
  private readonly realtime = inject(InboxRealtimeService);
  private readonly notifStore = inject(NotificationsStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly menuTriggered = output<void>();

  readonly t = (key: TranslationKey) => this.languageService.text(key);

  readonly notifOpen = signal(false);
  readonly profileOpen = signal(false);
  readonly availOpen = signal(false);

  // Presence / break state for the current agent (null until loaded / when unavailable for the role).
  readonly availability = signal<AgentAvailability | null>(null);
  readonly breakBusy = signal(false);
  readonly onBreak = computed(() => this.availability()?.isOnBreak ?? false);

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly theme = computed(() => this.themeService.theme());

  // ─── Notifications (FR-NOTIF) ────────────────────────────────────────────────
  readonly unreadCount = this.notifStore.unreadCount;
  readonly browserState = this.notifStore.browserState;

  readonly unreadLabel = computed(() => {
    const n = this.unreadCount();
    return n > 99 ? '99+' : String(n);
  });

  /** Platform (SuperAdmin) accounts have no tenant-scoped notifications feed or notifications route. */
  readonly isPlatform = computed(() => this.authSessionService.getPrimaryRole() === 'SuperAdmin');

  /** Panel items split into Today / Earlier for grouped display. */
  readonly notifGroups = computed(() => {
    const now = new Date();
    const today: NotifRow[] = [];
    const earlier: NotifRow[] = [];
    for (const n of this.notifStore.items()) {
      const row = this.toRow(n);
      (this.isToday(n.createdAt, now) ? today : earlier).push(row);
    }
    return { today, earlier };
  });

  constructor() {
    // Platform (SuperAdmin) accounts have no tenant, so tenant-scoped notifications and agent
    // presence don't apply — skip those calls so the console never fires 400 (NoTenantContext).
    if (this.authSessionService.getPrimaryRole() !== 'SuperAdmin') {
      this.notifStore.init();

      // Best-effort: agents get a presence chip; if the endpoint is not available for this role it
      // simply stays hidden. SignalR keeps it in sync when the backend pushes a PresenceChanged event.
      this.agentsApi.getMyAvailability().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (a) => this.availability.set(a),
        error: () => {}
      });
      this.realtime.presenceChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((p) =>
        this.availability.set({ isOnline: p.isOnline, isOnBreak: p.isOnBreak, lastSeenAt: p.lastSeenAt })
      );
    }
  }

  toggleAvail(): void {
    this.availOpen.update((v) => !v);
    this.notifOpen.set(false);
    this.profileOpen.set(false);
  }

  setBreak(onBreak: boolean): void {
    if (this.breakBusy()) return;
    this.breakBusy.set(true);
    this.agentsApi.setMyBreak(onBreak).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.breakBusy.set(false);
        this.availability.update((a) => (a ? { ...a, isOnBreak: onBreak, isOnline: onBreak ? a.isOnline : true } : a));
        this.availOpen.set(false);
      },
      error: () => this.breakBusy.set(false)
    });
  }

  readonly userName = computed(() => {
    const p = this.authSessionService.userProfile();
    return p?.fullName?.trim() || p?.email || 'User';
  });

  readonly email = computed(() => this.authSessionService.userProfile()?.email ?? '');

  readonly tenantName = computed(() => this.permissions.tenantName());

  readonly userRole = computed(() => {
    const role = this.authSessionService.getPrimaryRole();
    switch (role) {
      case 'SuperAdmin': return this.languageService.text('roleSuperAdmin');
      case 'Admin': return this.languageService.text('roleAdmin');
      case 'Manager': return this.languageService.text('roleManager');
      case 'Agent': return this.languageService.text('roleAgent');
      default: return '';
    }
  });

  readonly initials = computed(() => {
    const p = this.authSessionService.userProfile();
    const name = p?.fullName?.trim();
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      const a = parts[0]?.[0] ?? '';
      const b = parts[1]?.[0] ?? '';
      return (a + b || a).toUpperCase();
    }
    return (p?.email?.[0] ?? 'U').toUpperCase();
  });

  toggleNotif(): void {
    this.notifOpen.update((v) => !v);
    this.profileOpen.set(false);
    this.availOpen.set(false);
  }

  // ─── Notifications actions ───────────────────────────────────────────────────
  markAllRead(): void {
    this.notifStore.markAllRead();
  }

  openNotification(row: NotifRow): void {
    this.notifStore.markRead(row.n.id);
    const target = notificationTarget(row.n);
    this.closeMenus();
    if (target) {
      void this.router.navigate(target.commands, target.query ? { queryParams: target.query } : {});
    } else if (!this.isPlatform()) {
      // The /app/notifications center is a tenant route; a SuperAdmin hitting it is bounced by the
      // role guard (looks like a logout). The platform console has no notifications route.
      void this.router.navigate(['/app/notifications']);
    }
  }

  seeAll(): void {
    this.closeMenus();
    if (this.isPlatform()) {
      return;
    }
    void this.router.navigate(['/app/notifications']);
  }

  enableBrowser(): void {
    void this.notifStore.requestBrowserPermission();
  }

  private toRow(n: AppNotification): NotifRow {
    const visual = notificationVisual(n.type);
    return { n, icon: visual.icon, tint: visual.tint, timeLabel: this.relativeTime(n.createdAt) };
  }

  private isToday(iso: string, now: Date): boolean {
    const d = new Date(iso);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  /** Localised "5 minutes ago" / "منذ ٥ دقائق" via Intl (RTL-safe, no extra keys). */
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
    });
  }

  toggleProfile(): void {
    this.profileOpen.update((v) => !v);
    this.notifOpen.set(false);
    this.availOpen.set(false);
  }

  closeMenus(): void {
    this.notifOpen.set(false);
    this.profileOpen.set(false);
    this.availOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  logout(): void {
    this.closeMenus();
    this.authSessionService.signOut();
    void this.router.navigate(['/login']);
  }
}
