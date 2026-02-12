import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'organizations',
    loadComponent: () => import('./pages/organization/organization').then(m => m.Organization),
    children: [
      { path: '', redirectTo: 'divisions', pathMatch: 'full' },
      { 
        path: 'divisions',
        loadComponent: () => import('./pages/organization/divisions/divisions').then(m => m.Divisions)
      },
      { 
        path: 'collaborators',
        loadComponent: () => import('./pages/organization/collaborators/collaborators').then(m => m.Collaborators)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
