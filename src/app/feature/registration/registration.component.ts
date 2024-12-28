import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-registration',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ ReactiveFormsModule, NgOptimizedImage, NgbInputDatepicker, NgSelectModule, NgClass ],
  templateUrl: './registration.component.html',
  styleUrls: [ './registration.component.scss' ]
})
export class RegistrationComponent implements OnInit {
  @ViewChild('registrationFormRef') registrationFormRef!: NgForm;
  registrationForm!: FormGroup;
  schoolOptions = [
    { value: 'kindergarten', label: 'Vrtec' },
    { value: 'primary_school', label: 'Osnovna šola' },
    { value: 'high_school', label: 'Srednja šola' }
  ];
  genderOptions = [
    { value: 'male', label: 'Fant' },
    { value: 'female', label: 'Dekle' }
  ];

  private formBuilder: FormBuilder = inject(FormBuilder);

  get email(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }

  get firstName(): FormControl {
    return this.registrationForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.registrationForm.get('lastName') as FormControl;
  }

  get birthDate(): FormControl {
    return this.registrationForm.get('birthDate') as FormControl;
  }

  get schoolYear(): FormControl {
    return this.registrationForm.get('schoolYear') as FormControl;
  }

  get gender(): FormControl {
    return this.registrationForm.get('gender') as FormControl;
  }

  get address(): FormControl {
    return this.registrationForm.get('address') as FormControl;
  }

  get postalCode(): FormControl {
    return this.registrationForm.get('postalCode') as FormControl;
  }

  get city(): FormControl {
    return this.registrationForm.get('city') as FormControl;
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      firstName: [ '', Validators.required ],
      lastName: [ '', Validators.required ],
      birthDate: [ '', Validators.required ],
      schoolYear: [ '', Validators.required ],
      gender: [ '', Validators.required ],
      address: [ '', Validators.required ],
      postalCode: [ '', [ Validators.required, Validators.pattern(/^\d+$/) ] ],
      city: [ '', Validators.required ]
    });
  }

  onSubmit(): void {

  }
}
