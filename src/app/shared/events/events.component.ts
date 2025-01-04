import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from './services/events.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: [ './events.component.scss' ],
  standalone: true,
  imports: [ CommonModule, LoaderComponent ]
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  loading = false;

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.eventsService.getEventsList().subscribe({
      next: (data: any[]): void => {
        this.events = data;
        this.loading = false;
      },
      error: (error: any): void => {
        this.loading = false;
      }
    });
  }

  viewEventDetails(id: number): void {
    // Fetch event details and display them
    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        this.selectedEvent = event;
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
      }
    });
  }

  backToEvents(): void {
    this.selectedEvent = null; // Clear the selected event and show the list
  }
}
