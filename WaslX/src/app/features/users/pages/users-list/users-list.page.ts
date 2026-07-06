import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { User, UsersApiService } from '../../../../core/api/users-api.service';
import { AppRole } from '../../../../core/services/auth-session.service';
import { apiErrorMessage } from '../../../../core/utils/api-error';

type SortKey = 'name' | 'role' | 'status' | 'joined';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './users-list.page.html',
  styleUrl: './users-list.page.css'
})
export class UsersListPageComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly usersApiService = inject(UsersApiService);
  private readonly toastService = inject(ToastService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  // ─── Search / sort / pagination state ──────────────────────────────────────
  readonly search = signal('');
  readonly sortKey = signal<SortKey>('name');
  readonly sortDir = signal<SortDir>('asc');
  readonly page = signal(1);
  readonly pageSize = PAGE_SIZE;

  /** User awaiting activate/deactivate confirmation (null = no dialog). */
  readonly pendingUser = signal<User | null>(null);

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  // ─── Derived lists: filter → sort → paginate ───────────────────────────────
  readonly filteredUsers = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.users();
    }
    return this.users().filter(
      (u) =>
        u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  });

  readonly sortedUsers = computed(() => {
    const key = this.sortKey();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...this.filteredUsers()].sort((a, b) => compareUsers(a, b, key) * dir);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedUsers().length / this.pageSize))
  );

  readonly pagedUsers = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.sortedUsers().slice(start, start + this.pageSize);
  });

  /** Count of active members — display-only summary chip in the header. */
  readonly activeCount = computed(() => this.users().filter((u) => u.isActive).length);

  /** Placeholder rows used to render the loading skeleton (visual only). */
  readonly skeletonRows = Array.from({ length: 6 });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(false);

    this.usersApiService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  // ─── Search ────────────────────────────────────────────────────────────────
  onSearchChange(value: string): void {
    this.search.set(value);
    this.page.set(1); // reset to first page whenever the query changes
  }

  // ─── Sorting ───────────────────────────────────────────────────────────────
  sortBy(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDir.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.page.set(1);
  }

  sortIndicator(key: SortKey): string {
    if (this.sortKey() !== key) {
      return '';
    }
    return this.sortDir() === 'asc' ? '▲' : '▼';
  }

  // ─── Pagination ────────────────────────────────────────────────────────────
  prevPage(): void {
    this.page.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.page.update((p) => Math.min(this.totalPages(), p + 1));
  }

  // ─── Activate / deactivate with confirmation ───────────────────────────────
  requestToggle(user: User): void {
    this.pendingUser.set(user);
  }

  cancelToggle(): void {
    this.pendingUser.set(null);
  }

  confirmToggle(): void {
    const user = this.pendingUser();
    if (user) {
      this.toggleStatus(user);
    }
    this.pendingUser.set(null);
  }

  toggleStatus(user: User): void {
    const newStatus = !user.isActive;
    this.usersApiService.setUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u));
        this.toastService.success(this.t('userStatusUpdated'), '');
      },
      error: (err) => {
        this.toastService.error(this.t('error'), apiErrorMessage(err, this.t('genericError')));
      }
    });
  }

  changeRole(user: User, newRole: string): void {
    const role = newRole as AppRole;
    const previous = user.role;
    // Optimistically reflect the change, roll back if the server rejects it.
    this.users.update(users => users.map(u => u.id === user.id ? { ...u, role } : u));
    this.usersApiService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.toastService.success(this.t('userRoleUpdated'), '');
      },
      error: (err) => {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, role: previous } : u));
        this.toastService.error(this.t('error'), apiErrorMessage(err, this.t('genericError')));
      }

    });
  }
}

function compareUsers(a: User, b: User, key: SortKey): number {
  switch (key) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'role':
      return a.role.localeCompare(b.role);
    case 'status':
      // active (true) sorts after inactive (false) in ascending order
      return Number(a.isActive) - Number(b.isActive);
    case 'joined':
      return (a.createdAt || '').localeCompare(b.createdAt || '');
    default:
      return 0;
  }
}
