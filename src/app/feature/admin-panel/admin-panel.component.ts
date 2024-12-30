import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AdminPanelService } from './services/admin-panel.service';
import { NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrashCan, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NewPostModalComponent } from './new-post-modal/new-post-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  protected readonly faTrashCan = faTrashCan;
  private modalService: NgbModal = inject(NgbModal);

  constructor(protected adminPanelService: AdminPanelService,
              private router: Router,
              private authService: AuthService) {}

  logout(): void {
    console.log('User is logged out');
    this.authService.logout();
  }

  ngOnInit(): void {
    this.adminPanelService.fetchEvents();
  }

  fetchExcelFile(): void {

  }

  deleteEvent(id: any): void {
    this.adminPanelService.deleteEvent(id);
  }

  openNewPostNgbModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(NewPostModalComponent, {
      fullscreen: false,
      animation: false
    });
  }

  protected readonly faUserEdit = faUserEdit;

  navigateToSingleEvent(id: any): void {
    this.router.navigate([ `admin/panel/edit/${ id }` ]);
  }
}
