import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthSessionService } from '../../core/services/auth-session.service';
import { ImpersonationService } from '../../core/services/impersonation.service';
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { AgentLayoutComponent } from '../agent/agent-layout/agent-layout.component';
import { ManagerLayoutComponent } from '../manager/manager-layout/manager-layout.component';
import { SuperAdminLayoutComponent } from '../superadmin/superadmin-layout/superadmin-layout.component';
import { ViewerLayoutComponent } from '../viewer/viewer-layout/viewer-layout.component';
import { ImpersonationBannerComponent } from '../shared/components/impersonation-banner/impersonation-banner.component';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AdminLayoutComponent,
    ManagerLayoutComponent,
    AgentLayoutComponent,
    ViewerLayoutComponent,
    SuperAdminLayoutComponent,
    ImpersonationBannerComponent
  ],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.css'
})
export class BaseLayoutComponent {
  private readonly authSessionService = inject(AuthSessionService);
  private readonly impersonation = inject(ImpersonationService);

  readonly userRole = computed(() => this.authSessionService.getPrimaryRole());
  /** Drives the shell height offset so the pinned banner never overlaps content. */
  readonly impersonating = this.impersonation.isImpersonating;
}
