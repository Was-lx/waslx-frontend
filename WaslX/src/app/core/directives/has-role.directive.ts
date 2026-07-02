import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AppRole, AuthSessionService } from '../services/auth-session.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authSessionService = inject(AuthSessionService);

  private allowedRoles: AppRole[] = [];
  private hasView = false;

  constructor() {
    effect(() => {
      const currentRole = this.authSessionService.getPrimaryRole();
      this.updateView(currentRole);
    });
  }

  @Input() set appHasRole(roles: AppRole[] | AppRole | undefined) {
    if (!roles) {
      this.allowedRoles = []; // Empty implies no restriction
    } else {
      this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    }
    
    this.updateView(this.authSessionService.getPrimaryRole());
  }

  private updateView(currentRole: AppRole | null): void {
    const isAuthorized = !this.allowedRoles.length || (currentRole && this.allowedRoles.includes(currentRole));

    if (isAuthorized && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isAuthorized && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
