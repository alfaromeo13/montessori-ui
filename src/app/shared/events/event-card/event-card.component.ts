import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { EventFormComponent } from '../../event-form/event-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgOptimizedImage,
    EventFormComponent,
    LoaderComponent
  ],
  templateUrl: './event-card.component.html',
  styleUrls: [ './event-card.component.scss' ]
})
export class EventCardComponent implements OnInit {
  event: any = null; // Loaded event
  isEditMode = false;
  isAdmin: boolean = false;
  loading: boolean = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private http: HttpClient) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getAuthStatus();
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.fetchEvent(eventId);
    }
  }

  fetchEvent(eventId: string): void {
    this.loading = true;
    this.http.get(ConfigurationService.ENDPOINTS.event.get(`${ eventId }`)).subscribe(
      (data) => {
        this.event = data;
        this.ensureUniqueImages();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching event:', error);
        this.loading = false;
      }
    );
  }

  ensureUniqueImages(): void {
    if (this.event?.content?.contentBlocks) {
      const imageBlocks = this.event.content.contentBlocks.filter(
        (block: { type: string }) => block.type === 'image'
      );
      imageBlocks.forEach((block: { values: string[] }) => {
        block.values = [ ...new Set(block.values) ]; // Remove duplicate images
      });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  handleFormSubmit(formData: any): void {
    this.loading = true;
    const url = this.isEditMode
      ? ConfigurationService.ENDPOINTS.event.update(this.event.id)
      : ConfigurationService.ENDPOINTS.event.create();

    this.http.post(url, formData).subscribe(
      (response) => {
        this.loading = false;
        console.log('Event saved successfully:', response);
        this.isEditMode = false;
        this.fetchEvent(this.event?.id);
      },
      (error) => {
        this.loading = false;
        console.error('Error saving event:', error);
      }
    );
  }
  // Handle the stopEditing event emitted from EventFormComponent
  stopEditing(isEditMode: boolean): void {
    this.isEditMode = isEditMode;
  }
}
