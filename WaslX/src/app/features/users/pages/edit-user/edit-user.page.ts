import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { User, UsersApiService } from '../../../../core/api/users-api.service';
import { AgentAccessApiService } from '../../../../core/api/agent-access-api.service';
import { Channel, ChannelsApiService } from '../../../../core/api/channels-api.service';
import { WhatsAppAccountSummary, WhatsAppApiService } from '../../../../core/api/whatsapp-api.service';
import { Group, GroupsApiService } from '../../../../core/api/groups-api.service';
import { Shift, WorkingHoursApiService } from '../../../../core/api/working-hours-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import {
  AccessSelection,
  UserAccessPickerComponent,
} from '../../components/user-access-picker/user-access-picker.component';

@Component({
  selector: 'app-edit-user-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UserAccessPickerComponent],
  templateUrl: './edit-user.page.html',
  styleUrl: './edit-user.page.css',
})
export class EditUserPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersApi = inject(UsersApiService);
  private readonly accessApi = inject(AgentAccessApiService);
  private readonly channelsApi = inject(ChannelsApiService);
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly workingHoursApi = inject(WorkingHoursApiService);
  private readonly toast = inject(ToastService);
  readonly languageService = inject(LanguageService);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly saving = signal(false);

  readonly user = signal<User | null>(null);
  private userId = '';

  // ─── Access source data ──────────────────────────────────────────────────────
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

  readonly editForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: [''],
  });

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    forkJoin({
      user: this.usersApi.getUser(this.userId),
      access: this.accessApi.getAccess(this.userId),
      channels: this.channelsApi.getChannels(),
      numbers: this.whatsAppApi.getAccounts(),
      groups: this.groupsApi.getGroups(),
      shifts: this.workingHoursApi.getShifts(),
    }).subscribe({
      next: ({ user, access, channels, numbers, groups, shifts }) => {
        if (!user) {
          this.error.set(true);
          this.loading.set(false);
          return;
        }
        this.user.set(user);
        this.editForm.patchValue({
          fullName: user.name,
          phoneNumber: user.phoneNumber ?? '',
        });
        this.access.set({
          channelIds: access.channelIds,
          distributionWhatsAppAccountIds: access.distributionWhatsAppAccountIds,
          groupIds: access.groupIds,
          shiftIds: access.shiftIds,
        });
        this.channels.set(channels ?? []);
        this.numbers.set(numbers ?? []);
        this.groups.set(groups ?? []);
        this.shifts.set(shifts ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid || this.saving()) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const fullName = this.editForm.value.fullName!.trim();
    const phoneNumber = this.editForm.value.phoneNumber?.trim() || null;

    forkJoin({
      profile: this.usersApi.updateUser(this.userId, fullName, phoneNumber),
      access: this.accessApi.updateAccess(this.userId, this.access()),
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(this.t('userUpdated'), '');
        void this.router.navigate(['/app/users']);
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(this.t('genericError'), apiErrorMessage(err, this.t('genericError')));
      },
    });
  }
}
