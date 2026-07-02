import { Component, inject, computed } from '@angular/core';

import { AuthSessionService } from '../../../core/services/auth-session.service';
import { LanguageService, type TranslationKey } from '../../../core/services/language.service';

@Component({
  selector: 'app-viewer-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ViewerDashboardComponent {
  private readonly authSessionService = inject(AuthSessionService);
  readonly languageService = inject(LanguageService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly userName = computed(() => {
    const profile = this.authSessionService.userProfile();
    return profile?.fullName ?? profile?.email ?? 'Viewer';
  });

  readonly userRole = computed(() => this.languageService.text('roleViewer'));
}
