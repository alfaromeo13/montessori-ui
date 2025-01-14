import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, LoaderComponent, NgOptimizedImage ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  @Input() event: any = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() stopEditing = new EventEmitter<boolean>();
  createEventForm: FormGroup;
  selectedFiles: File[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public modalService: NgbModal
  ) {
    this.createEventForm = this.fb.group({
      title: ['', Validators.required],
      contentBlocks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.event) {
      this.createEventForm.patchValue({
        title: this.event.content.title
      });
  console.log(this.event);
  console.log(this.event.content.contentBlocks);
      this.event.content.contentBlocks.forEach((block: any) => {
        if (block.type === 'text') {
          this.addTextBlock(block.value);
        } else if (block.type === 'image') {
          this.addImageBlockFromEvent(block.values);
        }
      });
    }
  }

  get contentBlocks(): FormArray {
    return this.createEventForm.get('contentBlocks') as FormArray;
  }

  addTextBlock(value: string = ''): void {
    this.contentBlocks.push(
      this.fb.group({
        type: ['text'],
        value: [value, Validators.required]
      })
    );
  }

  addImageBlockFromEvent(imageValues: string[]): void {
    const filePromises = imageValues.map(async (imageUrl) => {
      try {
        const blob = await lastValueFrom(this.http.get(imageUrl, { responseType: 'blob' }));
        if (blob) {
          const fileName = imageUrl.split('/').pop() || 'image';
          const file = new File([blob], fileName, { type: blob.type });
          this.selectedFiles.push(file); // Add to selectedFiles for submission
        }
      } catch (error) {
        console.error(`Failed to fetch image: ${imageUrl}`, error);
      }
    });

    // Ensure all files are fetched before pushing to contentBlocks
    Promise.all(filePromises).then(() => {
      this.contentBlocks.push(
        this.fb.group({
          type: ['image'],
          values: [imageValues], // Keep URLs for display
          imageCount: [imageValues.length],
          files: [[]] // Placeholder for new uploads
        })
      );
    });
  }


  addImageBlock(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;

    fileInput.addEventListener('change', (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const imageValues = Array.from(input.files).map(() => 'Placeholder for image');

        this.contentBlocks.push(
          this.fb.group({
            type: ['image'],
            values: [imageValues],
            imageCount: [imageValues.length],
            files: [input.files]
          })
        );

        Array.from(input.files).forEach((file) => this.selectedFiles.push(file));
        alert(`${input.files.length} image(s) added.`);
      }
    });

    fileInput.click();
  }

  removeBlock(index: number): void {
    this.contentBlocks.removeAt(index);
  }

  onFormSubmit(): void {
    if (this.createEventForm.invalid) {
      alert('Please fill out all required fields.');
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
              value: block.value.trim()
            };
          }
          if (block.type === 'image') {
            // Include placeholders for new images
            return {
              type: block.type,
              values: block.values,
              imageCount: block.imageCount
            };
          }
          return null;
        }).filter((block: any) => block !== null)
      }
    };

    formData.append('payload', JSON.stringify(payload));

    // Append all files (existing and new) to FormData
    this.selectedFiles.forEach((file) => formData.append('image', file));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.loading = true;

    this.http.put(ConfigurationService.ENDPOINTS.event.update(this.event.id), formData, { headers }).subscribe({
      next: () => {
        this.loading = false;
        alert('Event updated successfully!');
        this.modalService.dismissAll();
        this.stopEditing.emit(false);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error updating event:', err);
        alert('An error occurred. Please try again.');
      }
    });
  }


  navigateToEvent(): void {
    this.stopEditing.emit(false);
  }
}
