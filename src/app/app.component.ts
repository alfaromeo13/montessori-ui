import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title: string = 'montessori-ui';
  private adminPaths: string[] = [ '/admin', '/admin/panel', '/admin/edit' ];

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const url: string = (event as NavigationEnd).url;
      const isAdminRoute: boolean = this.adminPaths.some((path: string) => url.startsWith(path));
      if (!isAdminRoute && this.authService.getAuthStatus()) {
        this.authService.logout();
      }
    });
  }
}
