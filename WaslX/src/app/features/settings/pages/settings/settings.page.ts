import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ProfileApiService } from '../../../../core/api/profile-api.service';
import { MeApiService } from '../../../../core/api/me-api.service';
import { AuthSessionService } from '../../../../core/services/auth-session.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css'
})
export class SettingsPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly profileApiService = inject(ProfileApiService);
  private readonly meApiService = inject(MeApiService);
  private readonly toastService = inject(ToastService);
  private readonly authSessionService = inject(AuthSessionService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  readonly profileLoading = signal(false);
  readonly passwordLoading = signal(false);

  // ── Visual identity block (derived, read-only — no logic/state change) ──
  // Reflects the live form name where present, otherwise the session profile.
  private readonly liveName = signal('');

  readonly identity = computed(() => {
    const profile = this.authSessionService.userProfile();
    const name = (this.liveName() || profile?.fullName || '').trim();
    const email = profile?.email ?? '';
    const role = (profile?.role || '').trim();
    const initial = (name || email || '?').charAt(0).toUpperCase();
    return {
      name: name || email || this.t('identityMember'),
      email,
      role: role || this.t('identityRoleFallback'),
      initial,
    };
  });

  readonly profileForm = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    email: [{ value: '', disabled: true }] // Email read-only
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    // Prefill immediately from the signed-in session, then refine with the
    // authoritative /me record (which also carries the phone number).
    const profile = this.authSessionService.userProfile();
    this.profileForm.patchValue({
      name: profile?.fullName ?? '',
      email: profile?.email ?? ''
    });
    this.liveName.set(profile?.fullName ?? '');

    // Keep the visual identity block in sync with the name field as it's edited.
    this.profileForm.get('name')?.valueChanges.subscribe((value) =>
      this.liveName.set(value ?? '')
    );

    this.meApiService.get().subscribe({
      next: (me) => this.profileForm.patchValue({
        name: me.fullName,
        phone: me.phoneNumber ?? '',
        email: me.email
      }),
      error: () => { /* keep the session-based prefill */ }
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
    const raw = this.profileForm.getRawValue();
    this.profileApiService.updateProfile({ name: raw.name!, phone: raw.phone?.trim() || null }).subscribe({
      next: () => {
        this.profileLoading.set(false);
        this.toastService.success(this.t('profileUpdated'), '');
      },
      error: (err) => {
        this.profileLoading.set(false);
        this.toastService.error(this.t('error'), apiErrorMessage(err, this.t('genericError')));
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
      error: (err) => {
        this.passwordLoading.set(false);
        this.toastService.error(this.t('error'), apiErrorMessage(err, this.t('genericError')));
      }
    });
  }
}
