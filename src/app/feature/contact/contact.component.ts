import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage], // Ensure FormsModule is imported for the form
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  navigateToFacebook(): void {
    window.open('https://www.facebook.com', '_blank');
  }

  navigateToInstagram(): void {
    window.open('https://www.instagram.com', '_blank');
  }
}
