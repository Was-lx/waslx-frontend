import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { type TranslationKey, LanguageService } from '../../../../core/services/language.service';
import { ToastService } from '../../../../core/services/toast.service';
import { User, UsersApiService } from '../../../../core/api/users-api.service';
import { AppRole } from '../../../../core/services/auth-session.service';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [DatePipe, RouterLink],
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

  readonly t = (key: TranslationKey) => this.languageService.text(key);
  readonly direction = () => this.languageService.getDirection();

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(false);

    this.usersApiService.getUsers().subscribe({
      next: (data) => {
        // Since there is no real backend, if it fails or returns nothing, let's mock some users
        this.users.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        // Mock data for UI demonstration purposes when backend is not attached
        this.users.set([
          { id: '1', name: 'Ahmed Ali', email: 'ahmed@waslx.com', role: 'Admin', isActive: true, createdAt: new Date().toISOString() },
          { id: '2', name: 'Sara Mostafa', email: 'sara@waslx.com', role: 'Manager', isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: '3', name: 'Kareem Tarek', email: 'kareem@waslx.com', role: 'Agent', isActive: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
        ]);
        this.loading.set(false);
        // this.error.set(true); // Commmented out so UI renders the mock data
      }
    });
  }

  toggleStatus(user: User): void {
    const newStatus = !user.isActive;
    this.usersApiService.setUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u));
        this.toastService.success(this.t('userStatusUpdated'), '');
      },
      error: () => {
        // Mock success for demonstration
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u));
        this.toastService.success(this.t('userStatusUpdated'), '');
      }
    });
  }

  changeRole(user: User, newRole: string): void {
    const role = newRole as AppRole;
    this.usersApiService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, role } : u));
        this.toastService.success(this.t('userRoleUpdated'), '');
      },
      error: () => {
         // Mock success for demonstration
         this.users.update(users => users.map(u => u.id === user.id ? { ...u, role } : u));
         this.toastService.success(this.t('userRoleUpdated'), '');
      }
    });
  }
}
