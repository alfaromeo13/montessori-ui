import { Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CoreService } from '../../core/services/core.service';
export const EventsRoutes: Routes = [
  CoreService.childRoutes([
    {
      path: '',
      component: EventsComponent
    },
    {
      path: ':id',
      component: EventCardComponent,
    }
  ])
];
