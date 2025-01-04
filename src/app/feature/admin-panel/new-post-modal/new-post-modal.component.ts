import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-new-post-modal',
  templateUrl: './new-post-modal.component.html',
  styleUrls: ['./new-post-modal.component.scss'],
  imports: [ReactiveFormsModule, NgForOf],
  standalone: true,
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
      title: ['', Validators.required],
      content: ['', Validators.required],
      additionalTexts: this.fb.array([]), // FormArray for additional text areas
    });
  }

  // New getter to ensure controls are typed as FormGroup
  get additionalTextGroups(): FormGroup[] {
    return this.additionalTexts.controls as FormGroup[];
  }

  get additionalTexts(): FormArray {
    return this.createEventForm.get('additionalTexts') as FormArray;
  }

  addAdditionalTextArea(): void {
    this.additionalTexts.push(
      this.fb.group({
        value: ['', Validators.required],
      })
    );
  }

  removeAdditionalTextArea(index: number): void {
    this.additionalTexts.removeAt(index);
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove the file at the given index
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
      Array.from(event.dataTransfer.files).forEach((file) => this.selectedFiles.push(file));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => this.selectedFiles.push(file));
    }
  }

  addAdditionalImage(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Accept only image files
    fileInput.multiple = false; // Allow one file per input
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.selectedFiles.push(input.files[0]);
        alert(`Additional image added: ${input.files[0].name}`);
      }
    });

    // Trigger file input click to open the file dialog
    document.body.appendChild(fileInput);
    fileInput.click();

    // Clean up the DOM
    document.body.removeChild(fileInput);
  }

  onFormSubmit(): void {
    // Validate the form to ensure required fields are filled
    if (this.createEventForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    // Ensure at least one file is selected
    if (this.selectedFiles.length === 0) {
      alert('Please add at least one file.');
      return;
    }

    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('id_token');
    if (!token) {
      alert('User is not authenticated.');
      return;
    }

    // Construct additional text blocks from the form array
    const additionalTextBlocks = this.additionalTexts.value.map((text: any) => ({
      type: 'text',
      value: text.value,
    }));

    // Prepare the payload for submission
   const payload = {
      content: {
        title: this.createEventForm.value.title,
        contentBlocks: [
          { type: 'text', value: this.createEventForm.value.content }, // Main content
          ...additionalTextBlocks, // Additional text areas
          {
            type: 'image',
            values: this.selectedFiles.map((f) => f.name), // Image file names
            imageCount: this.selectedFiles.length, // Total image count
          },
        ],
      },
    };

    // Create FormData for the payload and image files
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    this.selectedFiles.forEach((file) => formData.append('image', file));

    // Set headers with the authorization token
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Send the POST request to the backend
    this.http.post(ConfigurationService.ENDPOINTS.event.create(), formData, { headers }).subscribe({
      next: () => {
        // Success callback
        alert('Event created successfully!');
        this.modalService.dismissAll(); // Close the modal
      },
      error: (err) => {
        // Error callback
        console.error('Error creating event:', err);
        alert('An error occurred while creating the event. Please try again.');
      },
    });
  }
}
