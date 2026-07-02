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
  selector: 'app-viewer-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, FooterComponent],
  templateUrl: '../../shared/shell-layout.html',
  styleUrl: '../../shared/shell-layout.css'
})
export class ViewerLayoutComponent {
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
          { id: 'dashboard', label: t('dashboard'), description: t('dashboardDesc'), icon: 'grid', routerLink: '/app/dashboard' }
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
