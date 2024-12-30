import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { Events } from '../interfaces/events';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  #state: WritableSignal<Events> = signal({} as Events);
  readonly eventsData: Signal<Events> = this.#state.asReadonly();

  set(value: Events): void { this.#state.set(value); }

  constructor(private http: HttpClient) {}

  getEventsData(): Observable<Events> {
    return this.http.get<Events>(ConfigurationService.ENDPOINTS.event.list())
      .pipe(
        tap((data: Events): void => this.set(data))
      );
  }
}
