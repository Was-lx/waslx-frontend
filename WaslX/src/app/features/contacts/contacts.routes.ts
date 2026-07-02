import { Routes } from '@angular/router';

export const contactsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/contacts/contacts.page').then((m) => m.ContactsPageComponent)
  }
];
