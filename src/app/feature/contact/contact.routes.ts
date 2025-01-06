import { Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { CoreService } from '../../core/services/core.service';

export const ContactRoutes: Routes = [
  CoreService.childRoutes([
    {
    path: '',
    component: ContactComponent,
  }])
];
