import { Component, DestroyRef, computed, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { PermissionsStore } from '../../../../core/services/permissions.store';
import { AgentsApiService, type AgentAvailability } from '../../../../core/api/agents-api.service';
import { InboxRealtimeService } from '../../../../core/services/inbox-realtime.service';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly menuTriggered = output<void>();

  readonly notifOpen = signal(false);
  readonly profileOpen = signal(false);
  readonly availOpen = signal(false);

  // Presence / break state for the current agent (null until loaded / when unavailable for the role).
  readonly availability = signal<AgentAvailability | null>(null);
  readonly breakBusy = signal(false);
  readonly onBreak = computed(() => this.availability()?.isOnBreak ?? false);

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly theme = computed(() => this.themeService.theme());

  constructor() {
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
