import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { EventFormComponent } from '../../event-form/event-form.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    EventFormComponent
  ],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  event: any = null; // Loaded event
  isEditMode = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.fetchEvent(eventId);
    }
  }

  fetchEvent(eventId: string): void {
    this.http.get(ConfigurationService.ENDPOINTS.event.get(`${eventId}`)).subscribe(
      (data) => {
        this.event = data;
      },
      (error) => {
        console.error('Error fetching event:', error);
      }
    );
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  handleFormSubmit(formData: any): void {
    if(this.isEditMode) {
      this.http.post(ConfigurationService.ENDPOINTS.event.update(this.event.id), formData).subscribe(
        (response) => {
          console.log('Event saved successfully:', response);
          this.isEditMode = false;
          this.fetchEvent(this.event?.id);
        },
        (error) => {
          console.error('Error saving event:', error);
        }
      );
    } else {
      this.http.post(ConfigurationService.ENDPOINTS.event.create(), formData).subscribe(
        (response) => {
          console.log('Event created successfully:', response);
          this.isEditMode = false;
          this.fetchEvent(this.event?.id);
        },
        (error) => {
          console.error('Error creating event:', error);
        }
      );
    }
  }
}