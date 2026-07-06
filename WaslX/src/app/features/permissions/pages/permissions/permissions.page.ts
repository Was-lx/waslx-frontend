import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PermissionsApiService } from '../../../../core/api/permissions-api.service';
import type {
  PermissionCategory,
  PermissionMatrix,
  PermissionRow,
  PermissionUpdateItem,
} from '../../../../core/models/platform.models';

// ─────────────────────────────────────────────────────────────────────────────
// Bilingual copy — local to this screen (EN / AR).
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT = {
  en: {
    eyebrow: 'Access control',
    title: 'Roles & permissions',
    subtitle: 'Choose what each role can see and do in your workspace.',
    save: 'Save changes',
    saving: 'Saving…',
    discard: 'Discard',
    unsaved: (n: number) => `${n} unsaved ${n === 1 ? 'change' : 'changes'}`,
    loading: 'Loading permissions…',
    errorTitle: 'Could not load permissions',
    errorBody: 'Something went wrong while loading the permission matrix.',
    retry: 'Try again',
    savedToast: 'Permissions updated',
    savedToastBody: 'Your role permissions have been saved.',
    errorToast: 'Save failed',
    errorToastBody: 'We could not update the permissions. Please try again.',
    permissionCol: 'Permission',
    legendTitle: 'How access tiers work',
    legendConfigurable: 'Configurable',
    legendConfigurableDesc: 'Freely toggle on or off for any role.',
    legendManager: 'Manager & above',
    legendManagerDesc: 'Locked on for Manager and Admin, off for Agent.',
    legendAdmin: 'Admin-only',
    legendAdminDesc: 'Reserved for Admin. Cannot be granted to other roles.',
    alwaysOnAdmin: 'Always on for Admin',
    reservedAdmin: 'Reserved for Admin',
    managerAbove: 'Manager & above',
    scopeAssigned: 'Assigned only',
    scopeTeam: 'Team',
    scopeAll: 'All',
    on: 'On',
    off: 'Off',
    roleAdmin: 'Admin',
    roleManager: 'Manager',
    roleAgent: 'Agent',
  },
  ar: {
    eyebrow: 'التحكم في الصلاحيات',
    title: 'الأدوار والصلاحيات',
    subtitle: 'حدّد ما يمكن لكل دور رؤيته والقيام به داخل مساحة عملك.',
    save: 'حفظ التغييرات',
    saving: 'جارٍ الحفظ…',
    discard: 'تجاهل',
    unsaved: (n: number) => `${n} ${n === 1 ? 'تغيير غير محفوظ' : 'تغييرات غير محفوظة'}`,
    loading: 'جارٍ تحميل الصلاحيات…',
    errorTitle: 'تعذّر تحميل الصلاحيات',
    errorBody: 'حدث خطأ أثناء تحميل مصفوفة الصلاحيات.',
    retry: 'إعادة المحاولة',
    savedToast: 'تم تحديث الصلاحيات',
    savedToastBody: 'تم حفظ صلاحيات الأدوار بنجاح.',
    errorToast: 'فشل الحفظ',
    errorToastBody: 'تعذّر تحديث الصلاحيات. يُرجى المحاولة مرة أخرى.',
    permissionCol: 'الصلاحية',
    legendTitle: 'كيف تعمل مستويات الوصول',
    legendConfigurable: 'قابلة للتخصيص',
    legendConfigurableDesc: 'يمكن تفعيلها أو تعطيلها بحرية لأي دور.',
    legendManager: 'المدير فأعلى',
    legendManagerDesc: 'مفعّلة للمدير والمسؤول، ومعطّلة للموظف.',
    legendAdmin: 'للمسؤول فقط',
    legendAdminDesc: 'مخصّصة للمسؤول ولا يمكن منحها لأدوار أخرى.',
    alwaysOnAdmin: 'مفعّلة دائمًا للمسؤول',
    reservedAdmin: 'مخصّصة للمسؤول',
    managerAbove: 'المدير فأعلى',
    scopeAssigned: 'المسندة فقط',
    scopeTeam: 'الفريق',
    scopeAll: 'الكل',
    on: 'مفعّل',
    off: 'معطّل',
    roleAdmin: 'مسؤول',
    roleManager: 'مدير',
    roleAgent: 'موظف',
  },
} as const;

interface ScopeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-permissions-page',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './permissions.page.html',
  styleUrl: './permissions.page.css',
})
export class PermissionsPageComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly permissionsApiService = inject(PermissionsApiService);
  private readonly toastService = inject(ToastService);

  // ── i18n ──
  readonly language = this.languageService.language;
  readonly direction = computed(() => this.languageService.getDirection(this.language()));
  readonly c = computed(() => CONTENT[this.language() === 'ar' ? 'ar' : 'en']);

  // ── State ──
  readonly matrix = signal<PermissionMatrix | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly saving = signal(false);

  /** Collapsed category names. */
  readonly collapsed = signal<Set<string>>(new Set());

  /** Pending edits keyed by `role::code`. */
  readonly edits = signal<Map<string, PermissionUpdateItem>>(new Map());

  readonly editCount = computed(() => this.edits().size);
  readonly hasEdits = computed(() => this.editCount() > 0);

  ngOnInit(): void {
    this.load();
  }

  // ── Data loading ──
  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.permissionsApiService.getMatrix().subscribe({
      next: (matrix) => {
        this.matrix.set(matrix);
        this.edits.set(new Map());
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // ── Localised role header label ──
  roleLabel(role: string): string {
    const map: Record<string, string> = {
      Admin: this.c().roleAdmin,
      Manager: this.c().roleManager,
      Agent: this.c().roleAgent,
    };
    return map[role] ?? role;
  }

  // ── Visual-only role identity (glyph + tint key for the column header) ──
  roleGlyph(role: string): string {
    const map: Record<string, string> = {
      Admin: 'shield',
      Manager: 'users',
      Agent: 'headset',
    };
    return map[role] ?? 'user';
  }

  /** Tint key used to theme the role column (see .perms__rolehead--*). */
  roleTint(role: string): string {
    const map: Record<string, string> = {
      Admin: 'admin',
      Manager: 'manager',
      Agent: 'agent',
    };
    return map[role] ?? 'agent';
  }

  // ── Category completion ratio (0–1) for the progress ring / bar (visual) ──
  categoryRatio(category: PermissionCategory): number {
    const total = this.categoryTotalCount(category);
    if (total <= 0) {
      return 0;
    }
    return this.categoryGrantedCount(category) / total;
  }

  /** Whole-percent form of {@link categoryRatio}, used to drive the ring gradient. */
  categoryPercent(category: PermissionCategory): number {
    return Math.round(this.categoryRatio(category) * 100);
  }

  // ── Category collapse ──
  isCollapsed(name: string): boolean {
    return this.collapsed().has(name);
  }

  toggleCategory(name: string): void {
    this.collapsed.update((set) => {
      const next = new Set(set);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  categoryGrantedCount(category: PermissionCategory): number {
    let count = 0;
    for (const row of category.permissions) {
      for (const role of this.roles()) {
        if (this.effectiveGranted(row, role)) {
          count++;
        }
      }
    }
    return count;
  }

  categoryTotalCount(category: PermissionCategory): number {
    return category.permissions.length * this.roles().length;
  }

  // ── Convenience accessors ──
  roles(): string[] {
    return this.matrix()?.roles ?? [];
  }

  private key(role: string, code: string): string {
    return `${role}::${code}`;
  }

  // ── Effective (edited-or-original) state for a cell ──
  effectiveGranted(row: PermissionRow, role: string): boolean {
    const edit = this.edits().get(this.key(role, row.code));
    if (edit) {
      return edit.granted;
    }
    return row.cells[role]?.granted ?? false;
  }

  effectiveScope(row: PermissionRow, role: string): string | null {
    const edit = this.edits().get(this.key(role, row.code));
    if (edit) {
      return edit.scope;
    }
    return row.cells[role]?.scope ?? null;
  }

  isCellEdited(row: PermissionRow, role: string): boolean {
    return this.edits().has(this.key(role, row.code));
  }

  // ── Locked-cell tooltip text ──
  lockTooltip(row: PermissionRow, role: string): string {
    if (role === 'Admin') {
      return this.c().alwaysOnAdmin;
    }
    if (row.tier === 'AdminOnly') {
      return this.c().reservedAdmin;
    }
    return this.c().managerAbove;
  }

  // ── Scope options (parsed from CSV, nicely labelled) ──
  scopeOptions(row: PermissionRow): ScopeOption[] {
    if (!row.scopeOptions) {
      return [];
    }
    return row.scopeOptions
      .split(',')
      .map((raw) => raw.trim())
      .filter((v) => v.length > 0)
      .map((value) => ({ value, label: this.scopeLabel(value) }));
  }

  scopeLabel(value: string | null): string {
    switch (value) {
      case 'assigned':
        return this.c().scopeAssigned;
      case 'team':
        return this.c().scopeTeam;
      case 'all':
        return this.c().scopeAll;
      default:
        return value ?? '';
    }
  }

  // ── Edit tracking ──
  private stageEdit(row: PermissionRow, role: string, granted: boolean, scope: string | null): void {
    const original = row.cells[role];
    const originalGranted = original?.granted ?? false;
    const originalScope = original?.scope ?? null;

    this.edits.update((map) => {
      const next = new Map(map);
      const k = this.key(role, row.code);
      // If back to original, drop the edit; otherwise record it.
      if (granted === originalGranted && scope === originalScope) {
        next.delete(k);
      } else {
        next.set(k, { role, code: row.code, granted, scope });
      }
      return next;
    });
  }

  onToggle(row: PermissionRow, role: string): void {
    const cell = row.cells[role];
    if (!cell || cell.locked) {
      return;
    }
    const next = !this.effectiveGranted(row, role);
    this.stageEdit(row, role, next, this.effectiveScope(row, role));
  }

  onScopeChange(row: PermissionRow, role: string, event: Event): void {
    const cell = row.cells[role];
    if (!cell || cell.locked) {
      return;
    }
    const value = (event.target as HTMLSelectElement).value;
    // A scope row is considered granted whenever a scope is chosen.
    this.stageEdit(row, role, true, value);
  }

  // ── Save / discard ──
  discard(): void {
    this.edits.set(new Map());
  }

  save(): void {
    if (!this.hasEdits() || this.saving()) {
      return;
    }
    const changes = Array.from(this.edits().values());
    this.saving.set(true);
    this.permissionsApiService.update(changes).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.success(this.c().savedToast, this.c().savedToastBody);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error(this.c().errorToast, this.c().errorToastBody);
      },
    });
  }

  // ── Template helpers ──
  trackCategory(_: number, category: PermissionCategory): string {
    return category.name;
  }

  trackRow(_: number, row: PermissionRow): string {
    return row.code;
  }

  trackRole(_: number, role: string): string {
    return role;
  }
}
