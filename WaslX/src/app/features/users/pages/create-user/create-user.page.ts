import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UsersApiService } from '../../../../core/api/users-api.service';
import { AppRole } from '../../../../core/services/auth-session.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.page.html',
  styleUrl: './create-user.page.css'
})
export class CreateUserPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersApiService = inject(UsersApiService);
  private readonly toastService = inject(ToastService);
  readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  readonly inviteForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['Agent' as AppRole, Validators.required]
  });

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  onSubmit(): void {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const request = {
      fullName: this.inviteForm.value.fullName!.trim(),
      email: this.inviteForm.value.email!,
      role: this.inviteForm.value.role!
    };

    this.usersApiService.inviteUser(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success(this.t('userInvited'), '');
        void this.router.navigate(['/app/users']);
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error(this.t('genericError'), apiErrorMessage(err, this.t('genericError')));
      }
    });
  }
}
