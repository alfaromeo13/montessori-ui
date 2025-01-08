import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { HttpClient } from '@angular/common/http';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  imports: [ ReactiveFormsModule, LoaderComponent ],
  standalone: true
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  loadingResetPassword: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [ '', Validators.required ],
      password: [ '', Validators.required ]
    });
  }

  resetPassword(): void {
    this.loadingResetPassword = true;
    this.http.post(ConfigurationService.ENDPOINTS.admin.requestPasswordReset(), {},
        { responseType: 'text' })
      .subscribe((response: any): void => {
        this.loadingResetPassword = false;
        alert(response);
      });
  }

  login(): void {
    this.loading = true;
    const val = this.form.value;

    if (val.username && val.password) {
      this.authService.login(val.username, val.password).subscribe({
        next: (): void => {
          this.loading = false;
          console.log('User is logged in');
          this.router.navigate([ 'admin/panel' ]);
        },
        error: (err): void => {
          this.loading = false;
          console.error('Login error:', err);
          this.errorMessage = err.status === 401
            ? 'Invalid credentials. Please try again.'
            : 'An error occurred. Please try again later.';
        }
      });
    }
  }
}
