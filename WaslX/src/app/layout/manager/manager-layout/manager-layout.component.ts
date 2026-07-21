import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent, type SidebarNavGroup } from '../../shared/components/sidebar/sidebar.component';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, FooterComponent],
  templateUrl: '../../shared/shell-layout.html',
  styleUrl: '../../shared/shell-layout.css'
})
export class ManagerLayoutComponent {
  readonly authSessionService = inject(AuthSessionService);
  private readonly themeService = inject(ThemeService);
  readonly languageService = inject(LanguageService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly brandName = computed(() => (this.languageService.language() === 'ar' ? 'WaslX' : 'WaslX'));
  readonly brandSubtitle = computed(() => this.languageService.text('brandSubtitle'));
  readonly sidebarSubtitle = computed(() => this.languageService.text('sidebarSubtitle'));
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
        id: 'main',
        label: t('main'),
        items: [
          { id: 'dashboard', label: t('dashboard'), description: t('dashboardDesc'), icon: 'grid', routerLink: '/app/dashboard' },
          { id: 'inbox', label: t('inbox'), description: t('inboxDesc'), icon: 'message', routerLink: '/app/inbox' },
          { id: 'contacts', label: t('contacts'), description: t('contactsDesc'), icon: 'folder', routerLink: '/app/contacts' },
          { id: 'whatsapp', label: t('whatsapp'), description: t('whatsappDesc'), icon: 'phone', routerLink: '/app/channels' },
          { id: 'channels', label: t('channelsNav'), description: t('channelsNavDesc'), icon: 'inbox', routerLink: '/app/channels-list' },
          { id: 'templates', label: t('templatesNav'), description: t('templatesNavDesc'), icon: 'layers', routerLink: '/app/templates' }
        ]
      },
      {
        id: 'management',
        label: t('management'),
        items: [
          { id: 'teams', label: t('teams'), description: t('teamsDesc'), icon: 'shield', routerLink: '/app/teams' },
          { id: 'pipeline', label: t('pipeline'), description: t('pipelineDesc'), icon: 'layers', routerLink: '/app/pipeline' },
          { id: 'tags', label: t('tagsNav'), description: t('tagsNavDesc'), icon: 'tag', routerLink: '/app/tags' },
          { id: 'campaigns', label: t('campaignsNav'), description: t('campaignsNavDesc'), icon: 'megaphone', routerLink: '/app/campaigns' },
          { id: 'reports', label: t('reports'), description: t('reportsDesc'), icon: 'trending-up', routerLink: '/app/reports' }
        ]
      },
      {
        id: 'working-hours',
        label: t('whNav'),
        items: [
          { id: 'company-hours', label: t('whCompanyNav'), description: t('whCompanyNavDesc'), icon: 'clock', routerLink: '/app/working-hours', exact: true },
          { id: 'shifts', label: t('whShiftsNav'), description: t('whShiftsNavDesc'), icon: 'users', routerLink: '/app/working-hours/shifts' }
        ]
      },
      {
        id: 'system',
        label: t('system'),
        items: [
          { id: 'audit', label: t('auditNav'), description: t('auditNavDesc'), icon: 'history', routerLink: '/app/audit' },
          { id: 'settings', label: t('settings'), description: t('settingsDesc'), icon: 'sliders', routerLink: '/app/settings' }
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
