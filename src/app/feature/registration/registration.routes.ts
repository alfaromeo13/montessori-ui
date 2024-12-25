import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { CoreService } from '../../core/services/core.service';

export const RegistrationRoutes: Routes = [
  CoreService.childRoutes([
    {
      path: '',
      component: RegistrationComponent
    }
  ])
];
