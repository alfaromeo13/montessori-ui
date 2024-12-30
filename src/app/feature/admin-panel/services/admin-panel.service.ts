import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  eventsSignal: WritableSignal<any[]> = signal([]);

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  fetchEvents(): void {
    this.http.get<any[]>(ConfigurationService.ENDPOINTS.event.list()).subscribe({
      next: (events: any[]): void => {
        this.eventsSignal.set(events);
      },
      error: (err): void => {
        console.error('Error fetching events:', err);
      }
    });
  }

  deleteEvent(id: number): void {
    const url = ConfigurationService.ENDPOINTS.event.cancel(id.toString());
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ token }`
    });

    this.http.delete<void>(url, { headers }).pipe(
      tap((): void => {
        this.fetchEvents();
        alert('Event canceled successfully!');
      }),
      catchError(err => {
        console.error('Error canceling event:', err);
        alert('Failed to cancel the event. Please try again.');
        return of(null);
      })
    ).subscribe();
  }
}
