import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { AppRole } from '../../../../core/services/auth-session.service';

export interface SidebarNavItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly icon: 'grid' | 'message' | 'chart' | 'folder' | 'sliders' | 'shield' | 'users';
  readonly routerLink: string;
  readonly badge?: string;
  readonly roles?: AppRole[];
}

export interface SidebarNavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly SidebarNavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly languageService = inject(LanguageService);
  readonly brandName = input('WaslX');
  readonly brandSubtitle = input('Workspace navigation');
  readonly groups = input<readonly SidebarNavGroup[]>([]);
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly toggleCollapsed = output<void>();
  readonly closeMobile = output<void>();

  readonly collapseLabel = () => (this.collapsed() ? this.languageService.text('expandSidebar') : this.languageService.text('collapseSidebar'));
  readonly closeNavigationLabel = () => this.languageService.text('closeNavigation');
}
