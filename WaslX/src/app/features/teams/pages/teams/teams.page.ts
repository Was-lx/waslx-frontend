import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Group, GroupsApiService, UpsertGroupRequest } from '../../../../core/api/groups-api.service';
import { User, UsersApiService } from '../../../../core/api/users-api.service';
import { AgentAccessApiService } from '../../../../core/api/agent-access-api.service';
import { apiError, apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

/** A user row inside the "manage members" modal, with live membership + pending flag. */
interface MemberRow {
  user: User;
  isMember: boolean;
  busy: boolean;
}

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './teams.page.html',
  styleUrl: './teams.page.css',
})
export class TeamsPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly usersApi = inject(UsersApiService);
  private readonly accessApi = inject(AgentAccessApiService);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ─── Data ──────────────────────────────────────────────────────────────────
  readonly groups = signal<Group[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly search = signal('');

  readonly skeletonRows = Array.from({ length: 3 });

  readonly filteredGroups = computed(() => {
    const term = this.search().trim().toLowerCase();
    const list = this.groups();
    if (!term) {
      return list;
    }
    return list.filter(
      (g) =>
        g.name.toLowerCase().includes(term) ||
        (g.description ?? '').toLowerCase().includes(term),
    );
  });

  // ─── Create / edit modal ─────────────────────────────────────────────────────
  readonly modalOpen = signal(false);
  readonly editing = signal<Group | null>(null);
  readonly draftName = signal('');
  readonly draftDescription = signal('');
  readonly draftDistribution = signal(true);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  // ─── Delete confirm ──────────────────────────────────────────────────────────
  readonly pendingDelete = signal<Group | null>(null);
  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  // ─── Members modal ───────────────────────────────────────────────────────────
  readonly membersOpen = signal(false);
  readonly membersGroup = signal<Group | null>(null);
  readonly membersLoading = signal(false);
  readonly membersError = signal(false);
  readonly membersSearch = signal('');
  readonly memberRows = signal<MemberRow[]>([]);

  readonly memberCountInModal = computed(() => this.memberRows().filter((r) => r.isMember).length);
  readonly filteredMemberRows = computed(() => {
    const term = this.membersSearch().trim().toLowerCase();
    const rows = this.memberRows();
    if (!term) {
      return rows;
    }
    return rows.filter(
      (r) => r.user.name.toLowerCase().includes(term) || r.user.email.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading.set(true);
    this.error.set(false);
    this.groupsApi.getGroups().subscribe({
      next: (list) => {
        this.groups.set(list ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
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
    this.draftDistribution.set(true);
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  openEdit(group: Group): void {
    this.editing.set(group);
    this.draftName.set(group.name);
    this.draftDescription.set(group.description ?? '');
    this.draftDistribution.set(group.isAssignableByDistribution);
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (this.saving()) {
      return;
    }
    this.modalOpen.set(false);
  }

  toggleDistribution(): void {
    this.draftDistribution.update((v) => !v);
  }

  save(): void {
    const name = this.draftName().trim();
    if (!name) {
      this.formError.set(this.t('grpNameRequired'));
      return;
    }
    if (this.saving()) {
      return;
    }

    this.formError.set(null);
    this.saving.set(true);

    const payload: UpsertGroupRequest = {
      name,
      description: this.draftDescription().trim() || null,
      isAssignableByDistribution: this.draftDistribution(),
    };

    const current = this.editing();
    const request$ = current
      ? this.groupsApi.updateGroup(current.id, payload)
      : this.groupsApi.createGroup(payload);

    request$.subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.groups.update((list) =>
          current ? list.map((g) => (g.id === saved.id ? saved : g)) : [saved, ...list],
        );
        this.toast.success(current ? this.t('grpUpdatedToast') : this.t('grpCreatedToast'), '');
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(apiErrorMessage(err, this.t('grpErrorToast')));
      },
    });
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────
  requestDelete(group: Group): void {
    if (group.isDefault) {
      return;
    }
    this.deleteError.set(null);
    this.pendingDelete.set(group);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const group = this.pendingDelete();
    if (!group || this.deleting()) {
      return;
    }
    this.deleteError.set(null);
    this.deleting.set(true);

    this.groupsApi.deleteGroup(group.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.groups.update((list) => list.filter((g) => g.id !== group.id));
        this.toast.success(this.t('grpDeletedToast'), '');
      },
      error: (err) => {
        this.deleting.set(false);
        const info = apiError(err);
        const inUse =
          err?.status === 409 || (info.code ?? '').toLowerCase().includes('inuse');
        // A "still in use" failure is expected and shown inline; keep the dialog open.
        this.deleteError.set(inUse ? this.t('grpInUseError') : apiErrorMessage(err, this.t('grpErrorToast')));
      },
    });
  }

  // ─── Members ──────────────────────────────────────────────────────────────────
  openMembers(group: Group): void {
    this.membersGroup.set(group);
    this.membersSearch.set('');
    this.memberRows.set([]);
    this.membersError.set(false);
    this.membersLoading.set(true);
    this.membersOpen.set(true);

    this.usersApi.getUsers().subscribe({
      next: (users) => {
        const list = users ?? [];
        if (list.length === 0) {
          this.memberRows.set([]);
          this.membersLoading.set(false);
          return;
        }
        // Membership lives on each agent's access record (groupIds); resolve it per user.
        // A single failing lookup falls back to "not a member" instead of aborting.
        forkJoin(
          list.map((u) =>
            this.accessApi.getAccess(u.id).pipe(catchError(() => of(null))),
          ),
        ).subscribe({
          next: (accesses) => {
            const rows: MemberRow[] = list.map((u, i) => ({
              user: u,
              isMember: (accesses[i]?.groupIds ?? []).includes(group.id),
              busy: false,
            }));
            this.memberRows.set(rows);
            this.membersLoading.set(false);
          },
          error: () => {
            this.memberRows.set(list.map((u) => ({ user: u, isMember: false, busy: false })));
            this.membersLoading.set(false);
          },
        });
      },
      error: () => {
        this.membersError.set(true);
        this.membersLoading.set(false);
      },
    });
  }

  closeMembers(): void {
    this.membersOpen.set(false);
    this.membersGroup.set(null);
  }

  toggleMember(row: MemberRow): void {
    const group = this.membersGroup();
    if (!group || row.busy) {
      return;
    }
    const willBeMember = !row.isMember;
    this.setRowBusy(row.user.id, true);

    const request$ = willBeMember
      ? this.groupsApi.addMember(group.id, row.user.id)
      : this.groupsApi.removeMember(group.id, row.user.id);

    request$.subscribe({
      next: () => {
        this.memberRows.update((rows) =>
          rows.map((r) => (r.user.id === row.user.id ? { ...r, isMember: willBeMember, busy: false } : r)),
        );
        // Keep the card's member count in sync.
        this.groups.update((list) =>
          list.map((g) =>
            g.id === group.id
              ? { ...g, memberCount: Math.max(0, g.memberCount + (willBeMember ? 1 : -1)) }
              : g,
          ),
        );
        this.membersGroup.update((g) =>
          g ? { ...g, memberCount: Math.max(0, g.memberCount + (willBeMember ? 1 : -1)) } : g,
        );
        this.toast.success(
          willBeMember ? this.t('grpMemberAddedToast') : this.t('grpMemberRemovedToast'),
          '',
        );
      },
      error: (err) => {
        this.setRowBusy(row.user.id, false);
        this.toast.error(this.t('grpErrorToast'), apiErrorMessage(err, this.t('grpErrorToast')));
      },
    });
  }

  private setRowBusy(userId: string, busy: boolean): void {
    this.memberRows.update((rows) =>
      rows.map((r) => (r.user.id === userId ? { ...r, busy } : r)),
    );
  }
}
