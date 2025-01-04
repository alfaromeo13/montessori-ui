import { Routes } from '@angular/router';
import { CoreService } from '../../core/services/core.service';
import { EventsComponent } from './events.component';
import { eventsResolver } from './resolvers/events.resolver';
import { EventCardComponent } from './event-card/event-card.component';
export const EventsRoutes: Routes = [
  CoreService.childRoutes([
    {
      path: '',
      component: EventsComponent,
      resolve: { eventsResolver }
    }
  ]),{
    path: ':id', // Event details
    component: EventCardComponent,
  },
];
