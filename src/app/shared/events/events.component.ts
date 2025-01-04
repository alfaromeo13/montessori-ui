import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from './services/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [CommonModule], // Import CommonModule for *ngFor
})
export class EventsComponent implements OnInit {
  events: any[] = []; // Adjust type based on your API structure

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
    this.router.navigate([`/events/${id}`]);
  }
}
