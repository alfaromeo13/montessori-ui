import { Injectable, Signal, signal, WritableSignal, computed  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { Events } from '../interfaces/events';
import { Event } from '../interfaces/event';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  #state: WritableSignal<Events> = signal({ events: [] as Event[] });
  readonly eventsData: Signal<Event[]> = computed(() => this.#state().events);

  set(value: Events): void {
    this.#state.set(value);
  }

  constructor(private http: HttpClient) {}

  getEventsData(): Observable<Events> {
    return this.http.get<Events>(ConfigurationService.ENDPOINTS.event.list()).pipe(
      tap((data: Events): void => this.set(data))
    );
  }

  getEventsList(): Observable<Event[]> {
    return this.http.get<Event[]>(ConfigurationService.ENDPOINTS.event.list());
  }
}