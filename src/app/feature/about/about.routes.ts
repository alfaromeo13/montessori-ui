import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { CoreService } from '../../core/services/core.service';

export const AboutRoutes: Routes = [
  CoreService.childRoutes([
    {
      path: '',
      component: AboutComponent
    }
  ])
];
