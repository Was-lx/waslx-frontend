import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LanguageService } from '../../../../core/services/language.service';
import { ChannelStatusService } from '../../../../core/services/channel-status.service';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';
import { AppRole } from '../../../../core/services/auth-session.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

export interface SidebarNavItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Any name from the shared IconComponent set (unknown names fall back to a default glyph). */
  readonly icon: string;
  readonly routerLink: string;
  readonly badge?: string;
  readonly roles?: AppRole[];
  /** Highlight only on an exact URL match (use for a parent link whose children share its prefix). */
  readonly exact?: boolean;
}

export interface SidebarNavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly SidebarNavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private readonly languageService = inject(LanguageService);
  private readonly channelStatus = inject(ChannelStatusService);

  /** Live WhatsApp-channel health, surfaced as a dynamic badge on the inbox item. */
  readonly channelLive = this.channelStatus.isLive;
  readonly channelBadgeLabel = () =>
    this.channelStatus.isLive() ? this.languageService.text('live') : this.languageService.text('channelOffline');

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
