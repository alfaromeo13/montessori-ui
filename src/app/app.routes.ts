import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature/about/about.routes').then(m => m.AboutRoutes)
  },
  {
    path: 'vpis',
    loadChildren: () => import('./feature/registration/registration.routes').then(m => m.RegistrationRoutes)
  },
  {
    path: 'dogodki',
    loadChildren: () => import('./shared/events/events.routes').then(m => m.EventsRoutes)
  },
  {
    path: 'donacija',
    loadChildren: () => import('./feature/donation/donation.routes').then(m => m.DonationRoutes)
  },
  {
    path: 'admin',
    loadComponent: () => import('./feature/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/panel',
    loadComponent: () => import('./feature/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'admin/panel/edit/:id',
    loadComponent: () => import('./shared/events/event-card/event-card.component').then(m => m.EventCardComponent),
    canActivate: [ AuthGuard ]
  },
  { path: '**', redirectTo: '' }
];
