import { Component, computed, inject, input, output } from '@angular/core';

import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly languageService = inject(LanguageService);

  readonly brandName = input('WaslX');
  readonly brandSubtitle = input('Enterprise workspace');
  readonly searchPlaceholder = input('Search workspace');
  readonly notificationLabel = input('Open notifications');
  readonly profileLabel = input('Open profile menu');
  readonly themeLabel = input('Theme switch placeholder');
  readonly languageLabel = input('Language switch placeholder');
  readonly menuTriggered = output<void>();
  readonly notificationTriggered = output<void>();
  readonly profileTriggered = output<void>();
  readonly themeTriggered = output<void>();
  readonly languageTriggered = output<void>();

  readonly userName = computed(() => {
    const profile = this.authSessionService.userProfile();
    return profile?.fullName ?? profile?.email ?? 'Workspace User';
  });

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
}
