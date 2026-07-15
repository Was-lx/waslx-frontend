import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UsersApiService } from '../../../../core/api/users-api.service';
import { AgentAccessApiService } from '../../../../core/api/agent-access-api.service';
import { Channel, ChannelsApiService } from '../../../../core/api/channels-api.service';
import { WhatsAppAccountSummary, WhatsAppApiService } from '../../../../core/api/whatsapp-api.service';
import { Group, GroupsApiService } from '../../../../core/api/groups-api.service';
import { Shift, WorkingHoursApiService } from '../../../../core/api/working-hours-api.service';
import { AppRole } from '../../../../core/services/auth-session.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import {
  AccessSelection,
  UserAccessPickerComponent,
} from '../../components/user-access-picker/user-access-picker.component';

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UserAccessPickerComponent],
  templateUrl: './create-user.page.html',
  styleUrl: './create-user.page.css'
})
export class CreateUserPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersApiService = inject(UsersApiService);
  private readonly accessApi = inject(AgentAccessApiService);
  private readonly channelsApi = inject(ChannelsApiService);
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly workingHoursApi = inject(WorkingHoursApiService);
  private readonly toastService = inject(ToastService);
  readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  // ─── Access source data (channels / numbers / groups / shifts) ───────────────
  readonly channels = signal<Channel[]>([]);
  readonly numbers = signal<WhatsAppAccountSummary[]>([]);
  readonly groups = signal<Group[]>([]);
  readonly shifts = signal<Shift[]>([]);

  readonly access = signal<AccessSelection>({
    channelIds: [],
    distributionWhatsAppAccountIds: [],
    groupIds: [],
    shiftIds: [],
  });

  readonly inviteForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['Agent' as AppRole, Validators.required]
  });

  /** Live role signal so the access picker + section visibility react to the select. */
  readonly role = toSignal(this.inviteForm.controls.role.valueChanges, {
    initialValue: this.inviteForm.controls.role.value,
  });

  /** Access & routing only apply to Agents and Managers. */
  readonly showAccess = computed(() => {
    const r = this.role();
    return r === 'Agent' || r === 'Manager';
  });

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  ngOnInit(): void {
    this.channelsApi.getChannels().subscribe({
      next: (list) => this.channels.set(list ?? []),
      error: () => this.channels.set([]),
    });
    this.whatsAppApi.getAccounts().subscribe({
      next: (list) => this.numbers.set(list ?? []),
      error: () => this.numbers.set([]),
    });
    this.groupsApi.getGroups().subscribe({
      next: (list) => {
        this.groups.set(list ?? []);
        // Pre-select the tenant's default group so a new agent lands somewhere sensible.
        const fallback = (list ?? []).find((g) => g.isDefault);
        if (fallback) {
          this.access.update((v) => ({ ...v, groupIds: [fallback.id] }));
        }
      },
      error: () => this.groups.set([]),
    });
    this.workingHoursApi.getShifts().subscribe({
      next: (list) => this.shifts.set(list ?? []),
      error: () => this.shifts.set([]),
    });
  }

  onSubmit(): void {
    if (this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const role = this.inviteForm.value.role!;
    const request = {
      fullName: this.inviteForm.value.fullName!.trim(),
      email: this.inviteForm.value.email!,
      role,
    };
    const wantsAccess = role === 'Agent' || role === 'Manager';
    const access = this.access();

    this.usersApiService
      .inviteUser(request)
      .pipe(
        switchMap((newUserId) => {
          // Persist the chosen access once the user exists; skip if we have no id.
          if (wantsAccess && typeof newUserId === 'string' && newUserId) {
            return this.accessApi.updateAccess(newUserId, access).pipe(switchMap(() => EMPTY));
          }
          return EMPTY;
        }),
      )
      .subscribe({
        complete: () => {
          this.loading.set(false);
          this.toastService.success(this.t('userInvited'), '');
          void this.router.navigate(['/app/users']);
        },
        error: (err) => {
          this.loading.set(false);
          this.toastService.error(this.t('genericError'), apiErrorMessage(err, this.t('genericError')));
        },
      });
  }
}
