import { Routes } from '@angular/router';

export const workingHoursRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/company-hours/company-hours.page').then((m) => m.CompanyHoursPageComponent),
  },
  {
    path: 'shifts',
    loadComponent: () =>
      import('./pages/shifts/shifts.page').then((m) => m.ShiftsPageComponent),
  },
];
