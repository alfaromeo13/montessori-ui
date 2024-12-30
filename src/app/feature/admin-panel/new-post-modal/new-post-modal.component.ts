import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-new-post-modal',
  templateUrl: './new-post-modal.component.html',
  styleUrls: [ './new-post-modal.component.scss' ],
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class NewPostModalComponent {
  createEventForm: FormGroup;
  selectedFiles: File[] = [];
  isDragging = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public modalService: NgbModal
  ) {
    this.createEventForm = this.fb.group({
      title: [''],
      content: [''],
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      Array.from(event.dataTransfer.files).forEach(file => this.selectedFiles.push(file));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => this.selectedFiles.push(file));
    }
  }

  onFormSubmit(): void {
    if (this.selectedFiles.length === 0) {
      alert('Please add at least one file.');
      return;
    }

    const token = localStorage.getItem('id_token');
    if (!token) {
      alert('User is not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'payload',
      JSON.stringify({
        content: {
          title: this.createEventForm.value.title,
          contentBlocks: [
            { type: 'text', value: this.createEventForm.value.content },
            { type: 'image', values: this.selectedFiles.map(f => f.name), imageCount: this.selectedFiles.length },
          ],
        },
      })
    );

    // Append the image files
    this.selectedFiles.forEach(file => formData.append('image', file));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(ConfigurationService.ENDPOINTS.event.create(), formData, { headers }).subscribe({
      next: () => alert('Event created successfully!'),
      error: err => console.error('Error creating event:', err),
    });
    this.modalService.dismissAll();
  }
}
