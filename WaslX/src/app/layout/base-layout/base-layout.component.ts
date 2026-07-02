import { Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthSessionService } from '../../core/services/auth-session.service';
import { AdminLayoutComponent } from '../admin/admin-layout/admin-layout.component';
import { AgentLayoutComponent } from '../agent/agent-layout/agent-layout.component';
import { ManagerLayoutComponent } from '../manager/manager-layout/manager-layout.component';
import { SuperAdminLayoutComponent } from '../superadmin/superadmin-layout/superadmin-layout.component';
import { ViewerLayoutComponent } from '../viewer/viewer-layout/viewer-layout.component';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [RouterOutlet, AdminLayoutComponent, ManagerLayoutComponent, AgentLayoutComponent, ViewerLayoutComponent, SuperAdminLayoutComponent],
  templateUrl: './base-layout.component.html'
})
export class BaseLayoutComponent {
  private readonly authSessionService = inject(AuthSessionService);
  
  readonly userRole = computed(() => this.authSessionService.getPrimaryRole());
}
