import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { EventsService } from '../services/events.service';
import { inject } from '@angular/core';
import { Events } from '../interfaces/events';

export const eventsResolver: ResolveFn<Events> =
  (): Observable<Events> => {
    return inject(EventsService).getEventsData();
  };
