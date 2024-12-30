import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  imports: [ ReactiveFormsModule ],
  standalone: true
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string = '';

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
    const val = this.form.value;

    if (val.username && val.password) {
      this.authService.login(val.username, val.password).subscribe({
        next: (): void => {
          console.log('User is logged in');
          this.router.navigate([ 'admin/panel' ]);
        },
        error: (err): void => {
          console.error('Login error:', err);
          this.errorMessage = err.status === 401
            ? 'Invalid credentials. Please try again.'
            : 'An error occurred. Please try again later.';
        }
      });
    }
  }
}
