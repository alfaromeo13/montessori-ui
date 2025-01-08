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
    path: 'kontakt',
    loadChildren: () => import('./feature/contact/contact.routes').then(m => m.ContactRoutes)
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/panel',
    loadComponent: () => import('./feature/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'admin/edit/:id',
    loadComponent: () => import('./shared/events/event-card/event-card.component').then(m => m.EventCardComponent),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./feature/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  { path: '**', redirectTo: '' }
];
