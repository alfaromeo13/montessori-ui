import { Component, OnInit } from '@angular/core';
import { EventsService } from './services/events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    //this.eventsService.getEventsData();
  }
}
