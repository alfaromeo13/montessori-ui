import { Routes } from '@angular/router';

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
    loadChildren: () => import('./feature/events/events.routes').then(m => m.EventsRoutes)
  },
  {
    path: 'donacija',
    loadChildren: () => import('./feature/donation/donation.routes').then(m => m.DonationRoutes)
  },
  { path: '**', redirectTo: '' } // Fallback route
];
