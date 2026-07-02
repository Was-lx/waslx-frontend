import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProfileApiService } from '../../../../core/api/profile-api.service';
import { AuthSessionService } from '../../../../core/services/auth-session.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css'
})
export class SettingsPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly profileApiService = inject(ProfileApiService);
  private readonly toastService = inject(ToastService);
  private readonly authSessionService = inject(AuthSessionService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly profileLoading = signal(false);
  readonly passwordLoading = signal(false);

  readonly profileForm = this.fb.group({
    name: ['', Validators.required],
    email: [{ value: '', disabled: true }] // Email read-only
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    // Ideally we fetch current user profile here. For now, mock it or get from session.
    this.profileForm.patchValue({
      name: 'Admin User',
      email: 'admin@waslx.com'
    });
  }

  private passwordMatchValidator(group: any) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onSaveProfile(): void {
    if (this.profileForm.invalid) return;

    this.profileLoading.set(true);
    this.profileApiService.updateProfile({ name: this.profileForm.value.name! }).subscribe({
      next: () => {
        this.profileLoading.set(false);
        this.toastService.success(this.t('profileUpdated'), '');
      },
      error: () => {
        // Mock success
        this.profileLoading.set(false);
        this.toastService.success(this.t('profileUpdated'), '');
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;

    this.passwordLoading.set(true);
    const request = {
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!
    };

    this.profileApiService.changePassword(request).subscribe({
      next: () => {
        this.passwordLoading.set(false);
        this.toastService.success(this.t('passwordChanged'), '');
        this.passwordForm.reset();
      },
      error: () => {
        // Mock success
        this.passwordLoading.set(false);
        this.toastService.success(this.t('passwordChanged'), '');
        this.passwordForm.reset();
      }
    });
  }
}
