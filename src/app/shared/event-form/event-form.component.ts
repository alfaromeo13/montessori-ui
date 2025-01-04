import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../core/constants/configuration.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Include CommonModule and ReactiveFormsModule
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  @Input() event: any = null;
  @Output() formSubmit = new EventEmitter<any>();
  createEventForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, public modalService: NgbModal) {
    this.createEventForm = this.fb.group({
      title: [''],
      content: [''],
      additionalTexts: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.event) {
      this.createEventForm.patchValue({
        title: this.event.content.title,
        content: this.event.content.contentBlocks
          .filter((block: any) => block.type === 'text')
          .map((block: any) => block.value)
          .join('\n\n'),
      });

      const additionalTexts = this.event.content.contentBlocks.filter((block: any) => block.type === 'text');
      additionalTexts.forEach((block: any) => this.addAdditionalTextArea(block.value));
    }
  }

  get additionalTexts(): FormArray {
    return this.createEventForm.get('additionalTexts') as FormArray;
  }

  get additionalTextGroups(): FormGroup[] {
    return this.additionalTexts.controls as FormGroup[];
  }

  addAdditionalTextArea(value: string = ''): void {
    this.additionalTexts.push(this.fb.group({ value: [value, Validators.required] }));
  }

  removeAdditionalTextArea(index: number): void {
    this.additionalTexts.removeAt(index);
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => this.selectedFiles.push(file));
    }
  }

  onFormSubmit(): void {
    const token = localStorage.getItem('id_token');
    if (!token) {
      alert('User is not authenticated.');
      return;
    }
  

    const contentBlocks = [
      { type: 'text', value: this.createEventForm.value.content.trim() }, // Main content
      ...this.additionalTexts.value.map((text: { value: string }) => ({
        type: 'text',
        value: text.value.trim(), // Allow empty or whitespace-only values
      })),
    ];
    
    // Add image block only if there are selected files
    if (this.selectedFiles.length > 0) {
      contentBlocks.push({
        type: 'image',
        values: this.selectedFiles.map((file) => file.name),
        imageCount: this.selectedFiles.length,
      });
    }
  
    const payload = {
      content: {
        title: this.createEventForm.value.title.trim(),
        contentBlocks,
      },
    };
  
    // Create FormData and append payload
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
  
    // Always append the 'image' field, even if it's empty
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => formData.append('image', file));
    } else {
      // Ensure the 'image' field exists with an empty array if no files are selected
      formData.append('image', new Blob(), 'empty-image-placeholder');
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.http
      .put(ConfigurationService.ENDPOINTS.event.update(this.event.id), formData, { headers })
      .subscribe({
        next: () => {
          alert('Event updated successfully!');
          this.modalService.dismissAll();
          //this.formSubmit.emit(null); 
        },
        error: (err) => {
          console.error('Error updating event:', err);
          alert('An error occurred. Please try again.');
        },
      });
  }
}
