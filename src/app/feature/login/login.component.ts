import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  imports: [ ReactiveFormsModule, FaIconComponent, LoaderComponent ],
  standalone: true
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [ '', Validators.required ],
      password: [ '', Validators.required ]
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
