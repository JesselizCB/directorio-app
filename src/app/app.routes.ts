import { Routes } from '@angular/router';
import { Organization } from './pages/organization/organization';
import { Dashboard } from './pages/dashboard/dashboard';
import { Divisions } from './pages/organization/divisions/divisions';
import { Collaborators } from './pages/organization/collaborators/collaborators';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard 
  },
  {
    path: 'organizations',
    component: Organization,
    children: [
      { path: '', redirectTo: 'divisions', pathMatch: 'full' },
      { path: 'divisions', component: Divisions },
      { path: 'collaborators', component: Collaborators }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
