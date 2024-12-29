import { Routes } from '@angular/router';
import { DonationComponent } from './donation.component';
import { CoreService } from '../../core/services/core.service';

export const DonationRoutes: Routes = [
  CoreService.childRoutes([
    {
      path: '',
      component: DonationComponent
    }
  ])
];
