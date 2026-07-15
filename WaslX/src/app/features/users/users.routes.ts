import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/users-list/users-list.page').then(m => m.UsersListPageComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-user/create-user.page').then(m => m.CreateUserPageComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/edit-user/edit-user.page').then(m => m.EditUserPageComponent)
  }
];
