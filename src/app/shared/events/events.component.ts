import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { faTrashCan, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth.service';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Event } from './interfaces/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: [ './events.component.scss' ],
  standalone: true,
  imports: [ CommonModule, LoaderComponent, FaIconComponent, NgOptimizedImage ]
})
export class EventsComponent implements OnInit {
  protected readonly faTrashCan = faTrashCan;
  protected readonly faUserEdit = faUserEdit;
  events: any[] = [];
  loading: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getAuthStatus();
    console.log('isAdmin:', this.isAdmin);
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.http.get<Event[]>(ConfigurationService.ENDPOINTS.event.list()).pipe(
      tap((data: any[]): void => {
        this.events = data;
        this.loading = false;
      }),
      catchError((error: any): any => {
        this.loading = false;
        return of(null);
      })
    ).subscribe();
  }

  deleteEvent(id: any): void {
    this.loading = true;
    const url = ConfigurationService.ENDPOINTS.event.cancel(id.toString());
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${ token }`
    });

    this.http.delete<void>(url, { headers }).pipe(
      tap((): void => {
        this.loading = false;
        this.fetchEvents();
        alert('Event canceled successfully!');
      }),
      catchError(err => {
        this.loading = false;
        console.error('Error canceling event:', err);
        alert('Failed to cancel the event. Please try again.');
        return of(null);
      })
    ).subscribe();
  }

  navigateToSingleEvent(id: any): void {
    if (this.isAdmin) {
      this.router.navigate([ `admin/edit/${ id }` ]);
    } else {
      this.router.navigate([ `dogodki/${ id }` ]);
    }
  }
}
