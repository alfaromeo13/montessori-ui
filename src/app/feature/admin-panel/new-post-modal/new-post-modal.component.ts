import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../../core/constants/configuration.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-post-modal',
  templateUrl: './new-post-modal.component.html',
  styleUrls: ['./new-post-modal.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true,
})
export class NewPostModalComponent {
  createEventForm: FormGroup;
  loading: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public modalService: NgbModal
  ) {
    this.createEventForm = this.fb.group({
      title: ['', Validators.required],
      contentBlocks: this.fb.array([]), // Initialize as an empty FormArray
    });
  }

  get contentBlocks(): FormArray {
    return this.createEventForm.get('contentBlocks') as FormArray;
  }

  // Add a new text block
  addTextBlock(): void {
    this.contentBlocks.push(
      this.fb.group({
        type: ['text'],
        value: ['', Validators.required], // Text block with a required value
      })
    );
  }

  // Add a new image block
 // Add a new image block
// Add a new image block
addImageBlock(): void {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*'; // Accept only image files
  fileInput.multiple = true; // Allow multiple images

  fileInput.addEventListener('change', (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const imageValues = Array.from(input.files).map(() => 'Placeholder for image');

      // Correctly push a new image block
      this.contentBlocks.push(
        this.fb.group({
          type: ['image'], // Set the block type
          values: [imageValues], // Set the image values (array of placeholders)
          imageCount: [imageValues.length], // Set the image count
          files: [input.files], // Store the file list for upload
        })
      );

      alert(`${input.files.length} image(s) added.`);
    }
  });

  fileInput.click();
}

  // Remove a block (text or image)
  removeBlock(index: number): void {
    this.contentBlocks.removeAt(index);
  }

  // On form submit
  onFormSubmit(): void {
    if (this.createEventForm.invalid) {
      alert('Please provide a title and all content blocks.');
      return;
    }

    const token = localStorage.getItem('id_token');
    if (!token) {
      alert('User is not authenticated.');
      return;
    }

    const formData = new FormData();
    const payload = {
      content: {
        title: this.createEventForm.value.title,
        contentBlocks: this.createEventForm.value.contentBlocks.map((block: any) => {
          if (block.type === 'text') {
            return {
              type: block.type,
              value: block.value.trim() || '', // Ensure value is not empty
            };
          }
          if (block.type === 'image') {
            Array.from(block.files as FileList).forEach((file) =>
              formData.append('image', file)
            );
            return {
              type: block.type,
              values: block.values, // Add placeholder for each image
              imageCount: block.imageCount, // Add image count
            };
          }
          return null; // Fallback for unexpected block types
        }).filter((block: null) => block !== null),
      },
    };

    formData.append('payload', JSON.stringify(payload));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.loading = true;

    this.http.post(ConfigurationService.ENDPOINTS.event.create(), formData, { headers }).subscribe({
      next: () => {
        this.loading = false;
        alert('Event created successfully!');
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error creating event:', err);
        alert('An error occurred. Please try again.');
      },
    });
  }
}
