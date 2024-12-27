import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature/about/about.routes').then(m => m.AboutRoutes)
  },
  {
    path: 'vpis',
    loadChildren: () => import('./feature/registration/registration.routes').then(m => m.RegistrationRoutes)
  }
];
