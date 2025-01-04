import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NewPostModalComponent } from './new-post-modal/new-post-modal.component';
import { EventsComponent } from '../../shared/events/events.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    EventsComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  private modalService: NgbModal = inject(NgbModal);
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  logout(): void {
    this.loading = true;
    console.log('User is logged out');
    this.authService.logout();
    this.loading = false;
  }

  fetchExcelFile(): void {

  }

  openNewPostNgbModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(NewPostModalComponent, {
      fullscreen: false,
      animation: false
    });
  }
}
