import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../core/constants/configuration.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  @Input() event: any = null;
  @Output() formSubmit = new EventEmitter<any>();
  createEventForm: FormGroup;
  selectedFiles: File[] = [];
  isDragging = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient, public modalService: NgbModal) {
    this.createEventForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
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
    }
  }

  get additionalTexts(): FormArray {
    return this.createEventForm.get('additionalTexts') as FormArray;
  }

  // New getter to ensure controls are typed as FormGroup
  get additionalTextGroups(): FormGroup[] {
    return this.additionalTexts.controls as FormGroup[];
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
            ...this.additionalTexts.value.map((text: any) => ({
              type: 'text',
              value: text.value,
            })),
            { type: 'image', values: this.selectedFiles.map(f => f.name), imageCount: this.selectedFiles.length },
          ].filter(block => block.type !== 'image' || block.values.length > 0),
        },
      })
    );

    this.selectedFiles.forEach(file => formData.append('image', file));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(ConfigurationService.ENDPOINTS.event.create(), formData, { headers }).subscribe({
      next: () => alert('Event created successfully!'),
      error: err => console.error('Error creating event:', err),
    });

    this.modalService.dismissAll();
  }
}