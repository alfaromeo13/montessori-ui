import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  @Input() event: any = null; // Pass the event data for editing
  @Output() formSubmit = new EventEmitter<any>(); // Emit event data on form submission
  createEventForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.createEventForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      images: [[]] // Handle image uploads
    });
  }

  ngOnInit(): void {
    // Populate form if editing
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

  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onFormSubmit(): void {
    const formData = new FormData();
    const payload = {
      content: {
        title: this.createEventForm.value.title,
        contentBlocks: [
          { type: 'text', value: this.createEventForm.value.content },
          {
            type: 'image',
            values: this.selectedFiles.map((file) => file.name),
            imageCount: this.selectedFiles.length
          }
        ]
      }
    };

    formData.append('payload', JSON.stringify(payload));
    this.selectedFiles.forEach((file) => formData.append('image', file));

    this.formSubmit.emit(formData);
  }
}
