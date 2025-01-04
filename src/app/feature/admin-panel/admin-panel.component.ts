import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NewPostModalComponent } from './new-post-modal/new-post-modal.component';
import { EventsComponent } from '../../shared/events/events.component';
import { saveAs } from 'file-saver';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    EventsComponent,
    LoaderComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  private modalService: NgbModal = inject(NgbModal);
  loading: boolean = false;
  datePipe: DatePipe = new DatePipe('en-US');

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  logout(): void {
    this.loading = true;
    console.log('User is logged out');
    this.authService.logout();
    this.loading = false;
  }

  fetchExcelFile(): void {
    this.loading = true;
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(ConfigurationService.ENDPOINTS.admin.exportChildrenToExcel(), { headers, responseType: 'arraybuffer' })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching Excel file:', error);
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((response: ArrayBuffer | null) => {
        if (response) {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const fileName = `Children registry ${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}.xlsx`;
          saveAs(blob, fileName);
        }
        this.loading = false;
      });
  }

  openNewPostNgbModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(NewPostModalComponent, {
      fullscreen: false,
      animation: false
    });
  }
}
