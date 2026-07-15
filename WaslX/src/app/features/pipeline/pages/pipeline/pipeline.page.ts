import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { BoardColumn, BoardConversation, Group, GroupsApiService } from '../../../../core/api/groups-api.service';
import { ConversationsApiService } from '../../../inbox/services/conversations-api.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

// SignalR isn't wired into this read-only board; a light poll keeps it near-live.
const REFRESH_MS = 15_000;

@Component({
  selector: 'app-pipeline-page',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './pipeline.page.html',
  styleUrl: './pipeline.page.css',
})
export class PipelinePageComponent implements OnInit, OnDestroy {
  private readonly language = inject(LanguageService);
  private readonly groupsApi = inject(GroupsApiService);
  private readonly conversationsApi = inject(ConversationsApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly t = (key: TranslationKey): string => this.language.text(key);
  readonly direction = (): 'rtl' | 'ltr' => this.language.getDirection();

  readonly groups = signal<Group[]>([]);
  readonly groupsLoading = signal(true);
  readonly selectedGroupId = signal<number | null>(null);

  readonly columns = signal<BoardColumn[]>([]);
  readonly loading = signal(false);
  readonly error = signal(false);

  /** Conversation ids with a stage move in flight (guards double-clicks / disables their buttons). */
  private readonly movingIds = signal<Set<number>>(new Set());

  // ── Drag & drop state ─────────────────────────────────────────────────────
  /** Conversation currently being dragged (null when idle). */
  readonly draggingId = signal<number | null>(null);
  /** stageId of the column being hovered as a drop target (null = none). */
  readonly dragOverStageId = signal<number | null>(null);
  /** Stage the dragged card started in — a drop back onto it is a no-op. */
  private dragSourceStageId: number | null = null;

  readonly skeletonCols = Array.from({ length: 4 });

  readonly totalConversations = computed(() =>
    this.columns().reduce((sum, c) => sum + c.conversations.length, 0),
  );

  private poll: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadGroups();
    this.poll = setInterval(() => {
      if (this.selectedGroupId() != null) this.loadBoard(false);
    }, REFRESH_MS);
  }

  ngOnDestroy(): void {
    if (this.poll) clearInterval(this.poll);
  }

  private loadGroups(): void {
    this.groupsLoading.set(true);
    this.groupsApi.getGroups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => {
        this.groups.set(list ?? []);
        this.groupsLoading.set(false);
        const first = (list ?? [])[0];
        if (first) this.selectGroup(first.id);
      },
      error: () => this.groupsLoading.set(false),
    });
  }

  protected onGroupChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (Number.isFinite(value) && value > 0) this.selectGroup(value);
  }

  selectGroup(groupId: number): void {
    if (this.selectedGroupId() === groupId) return;
    this.selectedGroupId.set(groupId);
    this.columns.set([]);
    this.loadBoard(true);
  }

  loadBoard(showSpinner: boolean): void {
    const groupId = this.selectedGroupId();
    if (groupId == null) return;
    if (showSpinner) this.loading.set(true);
    this.error.set(false);

    this.groupsApi.getBoard(groupId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (cols) => {
        if (this.selectedGroupId() !== groupId) return;
        this.columns.set(cols);
        this.loading.set(false);
      },
      error: () => {
        if (showSpinner) this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // ── Card movement ─────────────────────────────────────────────────────────
  protected isMoving(conversationId: number): boolean {
    return this.movingIds().has(conversationId);
  }

  /** A move is possible only into an adjacent column that maps to a real stage. */
  protected canMove(columnIndex: number, dir: -1 | 1): boolean {
    const target = this.columns()[columnIndex + dir];
    return !!target && target.stageId != null;
  }

  protected move(conv: BoardConversation, columnIndex: number, dir: -1 | 1): void {
    const target = this.columns()[columnIndex + dir];
    if (!target || target.stageId == null) return;
    this.commitMove(conv, target.stageId);
  }

  /** Shared move → stage worker used by both the arrow buttons and drag-and-drop. */
  private commitMove(conv: BoardConversation, targetStageId: number): void {
    if (this.isMoving(conv.id)) return;
    this.movingIds.update((s) => new Set(s).add(conv.id));
    this.conversationsApi.moveToStage(conv.id, targetStageId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.unmark(conv.id);
        this.toast.success(this.t('pipMovedToast'), '');
        this.loadBoard(false);
      },
      error: (err) => {
        this.unmark(conv.id);
        this.toast.error(this.t('pipMoveError'), apiErrorMessage(err, this.t('pipMoveError')));
      },
    });
  }

  // ── Drag & drop ───────────────────────────────────────────────────────────
  protected onDragStart(conv: BoardConversation, sourceStageId: number | null, event: DragEvent): void {
    if (this.isMoving(conv.id)) { event.preventDefault(); return; }
    this.draggingId.set(conv.id);
    this.dragSourceStageId = sourceStageId;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      // Firefox needs data set for the drag to start.
      event.dataTransfer.setData('text/plain', String(conv.id));
    }
  }

  protected onDragEnd(): void {
    this.draggingId.set(null);
    this.dragOverStageId.set(null);
    this.dragSourceStageId = null;
  }

  /** A column accepts a drop only if it maps to a real stage and isn't the card's own stage. */
  protected onColDragOver(col: BoardColumn, event: DragEvent): void {
    if (this.draggingId() == null || col.stageId == null || col.stageId === this.dragSourceStageId) return;
    event.preventDefault(); // allow drop
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    if (this.dragOverStageId() !== col.stageId) this.dragOverStageId.set(col.stageId);
  }

  protected onColDragLeave(col: BoardColumn): void {
    if (this.dragOverStageId() === col.stageId) this.dragOverStageId.set(null);
  }

  protected onColDrop(col: BoardColumn, event: DragEvent): void {
    event.preventDefault();
    const convId = this.draggingId();
    const source = this.dragSourceStageId;
    this.onDragEnd();
    if (convId == null || col.stageId == null || col.stageId === source) return;
    const conv = this.findConversation(convId);
    if (conv) this.commitMove(conv, col.stageId);
  }

  protected isDropTarget(col: BoardColumn): boolean {
    return this.dragOverStageId() != null && this.dragOverStageId() === col.stageId;
  }

  private findConversation(id: number): BoardConversation | null {
    for (const col of this.columns()) {
      const found = col.conversations.find((c) => c.id === id);
      if (found) return found;
    }
    return null;
  }

  private unmark(conversationId: number): void {
    this.movingIds.update((s) => {
      const next = new Set(s);
      next.delete(conversationId);
      return next;
    });
  }

  // ── Presentation helpers ──────────────────────────────────────────────────
  protected columnLabel(col: BoardColumn): string {
    return col.stageId == null ? this.t('pipUnstaged') : col.stageName;
  }

  protected statusClass(status: string): string {
    return 'pip-card__status--' + status.toLowerCase();
  }

  protected shortDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
}
