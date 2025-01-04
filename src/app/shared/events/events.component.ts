import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from './services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null; // Holds the selected event details

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventsService.getEventsList().subscribe({
      next: (data: any[]) => {
        this.events = data;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
      },
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
      },
    });
  }

  backToEvents(): void {
    this.selectedEvent = null; // Clear the selected event and show the list
  }
}
