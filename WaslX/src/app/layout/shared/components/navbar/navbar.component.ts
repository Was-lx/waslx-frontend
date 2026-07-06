import { Component, computed, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { PermissionsStore } from '../../../../core/services/permissions.store';
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
  private readonly router = inject(Router);

  readonly menuTriggered = output<void>();

  readonly notifOpen = signal(false);
  readonly profileOpen = signal(false);

  readonly c = computed(() => CONTENT[this.languageService.language()]);
  readonly theme = computed(() => this.themeService.theme());

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
  }

  toggleProfile(): void {
    this.profileOpen.update((v) => !v);
    this.notifOpen.set(false);
  }

  closeMenus(): void {
    this.notifOpen.set(false);
    this.profileOpen.set(false);
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
