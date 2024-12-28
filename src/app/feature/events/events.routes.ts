import { Routes } from '@angular/router';
import { CoreService } from '../../core/services/core.service';
import { EventsComponent } from './events.component';
import { eventsResolver } from './resolvers/events.resolver';

export const EventsRoutes: Routes = [
  CoreService.childRoutes([
    {
      path: '',
      component: EventsComponent,
      resolve: { eventsResolver }
    }
  ])
];
