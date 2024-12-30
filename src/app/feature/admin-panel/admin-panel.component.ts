import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {

  constructor(private authService: AuthService) {}

  logout(): void {
    console.log('User is logged out');
    this.authService.logout();
  }

  ngOnInit(): void {
  }

  fetchExcelFile(): void {
  
  }
}
