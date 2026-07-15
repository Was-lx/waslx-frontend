import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
  Channel,
  ChannelsApiService,
  UpsertChannelRequest,
} from '../../../../core/api/channels-api.service';
import {
  WhatsAppApiService,
  WhatsAppAccountSummary,
} from '../../../../core/api/whatsapp-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-channels-list-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './channels-list.page.html',
  styleUrl: './channels-list.page.css',
})
export class ChannelsListPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly channelsApi = inject(ChannelsApiService);
  private readonly whatsAppApi = inject(WhatsAppApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ─── Data ──────────────────────────────────────────────────────────────────
  readonly channels = signal<Channel[]>([]);
  readonly numbers = signal<WhatsAppAccountSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly search = signal('');

  readonly filteredChannels = computed(() => {
    const term = this.search().trim().toLowerCase();
    const list = this.channels();
    if (!term) {
      return list;
    }
    return list.filter(
      (ch) =>
        ch.name.toLowerCase().includes(term) ||
        (ch.description ?? '').toLowerCase().includes(term) ||
        ch.whatsAppAccounts.some((a) => a.phoneNumber.toLowerCase().includes(term)),
    );
  });

  readonly skeletonRows = Array.from({ length: 3 });

  // ─── Create / edit modal state ───────────────────────────────────────────────
  readonly modalOpen = signal(false);
  readonly editing = signal<Channel | null>(null);
  readonly draftName = signal('');
  readonly draftDescription = signal('');
  readonly selectedIds = signal<Set<number>>(new Set<number>());
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly selectedCount = computed(() => this.selectedIds().size);

  // ─── Delete confirm state ────────────────────────────────────────────────────
  readonly pendingDelete = signal<Channel | null>(null);
  readonly deleting = signal(false);

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.error.set(false);

    this.channelsApi.getChannels().subscribe({
      next: (list) => {
        this.channels.set(list ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });

    // WhatsApp numbers power the modal's multi-select; a failure here shouldn't
    // block the list — the modal simply shows its "no numbers" hint.
    this.whatsAppApi.getAccounts().subscribe({
      next: (list) => this.numbers.set(list ?? []),
      error: () => this.numbers.set([]),
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  // ─── Create / edit ───────────────────────────────────────────────────────────
  openCreate(): void {
    this.editing.set(null);
    this.draftName.set('');
    this.draftDescription.set('');
    this.selectedIds.set(new Set<number>());
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  openEdit(channel: Channel): void {
    this.editing.set(channel);
    this.draftName.set(channel.name);
    this.draftDescription.set(channel.description ?? '');
    this.selectedIds.set(new Set(channel.whatsAppAccounts.map((a) => a.whatsAppAccountId)));
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (this.saving()) {
      return;
    }
    this.modalOpen.set(false);
  }

  toggleNumber(id: number): void {
    this.selectedIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  save(): void {
    const name = this.draftName().trim();
    if (!name) {
      this.formError.set(this.t('chNameRequired'));
      return;
    }
    if (this.saving()) {
      return;
    }

    this.formError.set(null);
    this.saving.set(true);

    const payload: UpsertChannelRequest = {
      name,
      description: this.draftDescription().trim() || null,
      whatsAppAccountIds: Array.from(this.selectedIds()),
    };

    const current = this.editing();
    const request$ = current
      ? this.channelsApi.updateChannel(current.id, payload)
      : this.channelsApi.createChannel(payload);

    request$.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.channels.update((list) =>
          current ? list.map((ch) => (ch.id === saved.id ? saved : ch)) : [saved, ...list],
        );
        this.toast.success(current ? this.t('chUpdatedToast') : this.t('chCreatedToast'), '');
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(apiErrorMessage(err, this.t('chErrorToast')));
      },
    });
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────
  requestDelete(channel: Channel): void {
    this.pendingDelete.set(channel);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const channel = this.pendingDelete();
    if (!channel || this.deleting()) {
      return;
    }
    this.deleting.set(true);

    this.channelsApi.deleteChannel(channel.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.channels.update((list) => list.filter((ch) => ch.id !== channel.id));
        this.toast.success(this.t('chDeletedToast'), '');
      },
      error: (err) => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(this.t('chErrorToast'), apiErrorMessage(err, this.t('chErrorToast')));
      },
    });
  }
}
