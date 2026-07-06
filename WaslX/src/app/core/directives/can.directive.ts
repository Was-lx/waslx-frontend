import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject, signal } from '@angular/core';

import { PermissionsStore } from '../services/permissions.store';

/**
 * Structural directive that shows its content only if the signed-in user has the
 * given permission code. Reactive — updates when the tenant Admin changes a role's
 * permissions. Usage: `<button *appCan="'campaign.create_send'">New campaign</button>`.
 */
@Directive({ selector: '[appCan]', standalone: true })
export class CanDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissions = inject(PermissionsStore);

  private readonly code = signal<string>('');
  private hasView = false;

  @Input() set appCan(code: string) {
    this.code.set(code ?? '');
  }

  constructor() {
    effect(() => {
      const code = this.code();
      const allowed = !code || this.permissions.can(code);

      if (allowed && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!allowed && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
