import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Group, GroupsApiService, Stage } from '../../../../core/api/groups-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-stages-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './stages.page.html',
  styleUrl: './stages.page.css',
})
export class StagesPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  private readonly groupId = Number(this.route.snapshot.paramMap.get('groupId'));

  readonly group = signal<Group | null>(null);
  readonly stages = signal<Stage[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly notFound = signal(false);

  // ─── Add stage ───────────────────────────────────────────────────────────────
  readonly newName = signal('');
  readonly adding = signal(false);

  // ─── Reorder (guards double-clicks while a request is in flight) ──────────────
  readonly reordering = signal(false);

  // ─── Rename modal ────────────────────────────────────────────────────────────
  readonly renaming = signal<Stage | null>(null);
  readonly renameValue = signal('');
  readonly renameError = signal<string | null>(null);
  readonly renameSaving = signal(false);

  // ─── Delete confirm ──────────────────────────────────────────────────────────
  readonly pendingDelete = signal<Stage | null>(null);
  readonly deleting = signal(false);

  readonly skeletonCols = Array.from({ length: 3 });

  readonly canAdd = computed(() => this.newName().trim().length > 0 && !this.adding());

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.notFound.set(false);

    // No single-group endpoint exists; the list already carries each group's stages.
    this.groupsApi.getGroups().subscribe({
      next: (list) => {
        const found = (list ?? []).find((g) => g.id === this.groupId) ?? null;
        if (!found) {
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }
        this.group.set(found);
        this.stages.set([...found.stages].sort((a, b) => a.sequenceOrder - b.sequenceOrder));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // ─── Add ─────────────────────────────────────────────────────────────────────
  addStage(): void {
    const name = this.newName().trim();
    if (!name || this.adding()) {
      return;
    }
    this.adding.set(true);
    this.groupsApi.addStage(this.groupId, name).subscribe({
      next: (stage) => {
        this.stages.update((list) => [...list, stage]);
        this.newName.set('');
        this.adding.set(false);
        this.toast.success(this.t('stgAddedToast'), '');
      },
      error: (err) => {
        this.adding.set(false);
        this.toast.error(this.t('stgErrorToast'), apiErrorMessage(err, this.t('stgErrorToast')));
      },
    });
  }

  // ─── Reorder (move a stage earlier / later) ───────────────────────────────────
  move(index: number, dir: -1 | 1): void {
    const target = index + dir;
    const list = this.stages();
    if (this.reordering() || target < 0 || target >= list.length) {
      return;
    }

    const reordered = [...list];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    const previous = list;
    this.stages.set(reordered); // optimistic
    this.reordering.set(true);

    this.groupsApi.reorderStages(this.groupId, reordered.map((s) => s.id)).subscribe({
      next: () => {
        // Re-sequence locally so the "Stage N" labels stay in sync.
        this.stages.update((s) => s.map((stage, i) => ({ ...stage, sequenceOrder: i })));
        this.reordering.set(false);
        this.toast.success(this.t('stgReorderedToast'), '');
      },
      error: (err) => {
        this.stages.set(previous); // revert
        this.reordering.set(false);
        this.toast.error(this.t('stgErrorToast'), apiErrorMessage(err, this.t('stgErrorToast')));
      },
    });
  }

  // ─── Rename ────────────────────────────────────────────────────────────────────
  openRename(stage: Stage): void {
    this.renaming.set(stage);
    this.renameValue.set(stage.name);
    this.renameError.set(null);
  }

  closeRename(): void {
    if (this.renameSaving()) {
      return;
    }
    this.renaming.set(null);
  }

  saveRename(): void {
    const stage = this.renaming();
    if (!stage) {
      return;
    }
    const name = this.renameValue().trim();
    if (!name) {
      this.renameError.set(this.t('stgNameRequired'));
      return;
    }
    if (this.renameSaving()) {
      return;
    }
    this.renameSaving.set(true);
    this.groupsApi.renameStage(this.groupId, stage.id, name).subscribe({
      next: (saved) => {
        this.stages.update((list) => list.map((s) => (s.id === saved.id ? { ...s, name: saved.name } : s)));
        this.renameSaving.set(false);
        this.renaming.set(null);
        this.toast.success(this.t('stgRenamedToast'), '');
      },
      error: (err) => {
        this.renameSaving.set(false);
        this.renameError.set(apiErrorMessage(err, this.t('stgErrorToast')));
      },
    });
  }

  // ─── Delete ────────────────────────────────────────────────────────────────────
  requestDelete(stage: Stage): void {
    this.pendingDelete.set(stage);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const stage = this.pendingDelete();
    if (!stage || this.deleting()) {
      return;
    }
    this.deleting.set(true);
    this.groupsApi.deleteStage(this.groupId, stage.id).subscribe({
      next: () => {
        this.stages.update((list) =>
          list.filter((s) => s.id !== stage.id).map((s, i) => ({ ...s, sequenceOrder: i })),
        );
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.success(this.t('stgDeletedToast'), '');
      },
      error: (err) => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(this.t('stgErrorToast'), apiErrorMessage(err, this.t('stgErrorToast')));
      },
    });
  }
}
