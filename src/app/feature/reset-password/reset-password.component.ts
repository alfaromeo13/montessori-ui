import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { NgClass, NgIf } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    LoaderComponent
  ],
  styleUrls: [ './reset-password.component.scss' ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient) {}

  get code() {
    return this.resetPasswordForm.get('code');
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      code: [ '', Validators.required ],
      password: [ '', [ Validators.required, Validators.minLength(6) ] ]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.loading = true;

      const payload = {
        code: this.resetPasswordForm.value.code,
        password: this.resetPasswordForm.value.password
      };

      this.http.post(
        ConfigurationService.ENDPOINTS.admin.resetPassword(), // API endpoint
        payload,
        { responseType: 'text' } // Expecting plain text response
      ).subscribe({
        next: (response: string): void => {
          console.log('API Response:', response);

          if (response === 'Password changed successfully!') {
            alert(response); // Notify user about success
            this.router.navigate(['/login']); // Redirect to /reset-password
          } else {
            alert('Unexpected response from the server.');
          }

          this.loading = false;
        },
        error: (error: any): void => {
          this.loading = false;
          console.error('API Error:', error);

          if (error.status === 404) {
            alert('Account not found'); // Specific error handling for 404
          } else {
            alert('An error occurred. Please try again.'); // General error handling
          }
        }
      });
    }
  }



}
