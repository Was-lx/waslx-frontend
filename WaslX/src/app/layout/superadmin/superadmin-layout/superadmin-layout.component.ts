import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent, type SidebarNavGroup } from '../../shared/components/sidebar/sidebar.component';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-superadmin-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, FooterComponent],
  templateUrl: '../../shared/shell-layout.html',
  styleUrl: '../../shared/shell-layout.css',
  // `is-platform-console` flips the shared shell into "platform mode":
  // deeper --primary-deep chrome + PLATFORM eyebrow (see sidebar/navbar CSS).
  host: { class: 'is-platform-console' }
})
export class SuperAdminLayoutComponent {
  readonly authSessionService = inject(AuthSessionService);
  private readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly brandName = computed(() => (this.languageService.language() === 'ar' ? 'WaslX Platform' : 'WaslX Platform'));
  readonly brandSubtitle = computed(() => this.languageService.text('brandSubtitle'));
  // Platform-mode eyebrow (rendered uppercased by the deep-chrome sidebar CSS).
  readonly sidebarSubtitle = computed(() => this.languageService.text('platformConsole'));
  readonly searchPlaceholder = computed(() => this.languageService.text('searchPlaceholder'));
  readonly notificationLabel = computed(() => this.languageService.text('openNotifications'));
  readonly profileLabel = computed(() => this.languageService.text('openProfileMenu'));
  readonly themeLabel = computed(() => this.languageService.text('toggleTheme'));
  readonly languageLabel = computed(() => this.languageService.text('toggleLanguage'));
  readonly footerLabel = computed(() => this.languageService.text('footerLabel'));

  readonly navigationGroups = computed<readonly SidebarNavGroup[]>(() => {
    const t = (key: any) => this.languageService.text(key);
    return [
      {
        id: 'platform',
        label: t('platform'),
        items: [
          { id: 'admins', label: t('admins'), description: t('adminsDesc'), icon: 'shield', routerLink: '/app/superadmin/admins' },
          { id: 'tenants', label: t('tenants'), description: t('tenantsDesc'), icon: 'building', routerLink: '/app/superadmin/tenants' },
          { id: 'plans', label: t('plans'), description: t('plansDesc'), icon: 'layers', routerLink: '/app/superadmin/plans' },
          { id: 'billing', label: t('billing'), description: t('billingDesc'), icon: 'credit-card', routerLink: '/app/superadmin/billing' },
          { id: 'usage', label: t('usage'), description: t('usageDesc'), icon: 'chart', routerLink: '/app/superadmin/usage' },
          { id: 'ai-cost', label: t('aiCost'), description: t('aiCostDesc'), icon: 'cpu', routerLink: '/app/superadmin/ai-cost' },
          { id: 'settings', label: t('platformSettings'), description: t('platformSettingsDesc'), icon: 'sliders', routerLink: '/app/superadmin/settings' }
        ]
      },
      {
        id: 'oversight',
        label: t('pcNavOversight'),
        items: [
          { id: 'audit', label: t('pcNavAudit'), description: t('pcNavAuditDesc'), icon: 'history', routerLink: '/app/superadmin/audit' },
          { id: 'health', label: t('pcNavHealth'), description: t('pcNavHealthDesc'), icon: 'zap', routerLink: '/app/superadmin/health' },
          { id: 'announcements', label: t('pcNavAnnouncements'), description: t('pcNavAnnouncementsDesc'), icon: 'megaphone', routerLink: '/app/superadmin/announcements' }
        ]
      }
    ];
  });

  readonly sidebarCollapsed = signal(false);
  readonly mobileMenuOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  handleNotifications(): void {
    this.toastService.info(this.languageService.text('openNotifications'), this.languageService.text('workspaceReady'));
    this.mobileMenuOpen.set(false);
  }

  handleProfile(): void {
    this.authSessionService.signOut();
    this.toastService.info(this.languageService.text('signOut'), '');
    void this.router.navigate(['/login']);
    this.mobileMenuOpen.set(false);
  }

  handleTheme(): void {
    this.themeService.toggleTheme();
    this.toastService.success(this.languageService.text('theme'), this.languageService.text('workspaceReady'));
    this.mobileMenuOpen.set(false);
  }

  handleLanguage(): void {
    this.languageService.toggleLanguage();
    this.toastService.success(this.languageService.text('language'), this.languageService.text('workspaceReady'));
    this.mobileMenuOpen.set(false);
  }
}
