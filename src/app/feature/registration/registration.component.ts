import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ ReactiveFormsModule, NgOptimizedImage, NgbInputDatepicker, NgSelectModule, NgClass, FaIconComponent ],
  templateUrl: './registration.component.html',
  styleUrls: [ './registration.component.scss' ]
})
export class RegistrationComponent implements OnInit {
  @ViewChild('registrationFormRef') registrationFormRef!: NgForm;
  protected readonly faSpinner = faSpinner;
  registrationForm!: FormGroup;
  loading: boolean = false;
  schoolOptions = [
    { value: 'KINDERGARTEN', label: 'Vrtec' },
    { value: 'FIRST_GRADE', label: 'Prvi razred' },
    { value: 'SECOND_GRADE', label: 'Drugi razred' },
    { value: 'THIRD_GRADE', label: 'Treci razred' },
    { value: 'FOURTH_GRADE', label: 'Cetvrti razred' },
    { value: 'FIFTH_GRADE', label: 'Peti razred' },
    { value: 'SIXTH_GRADE', label: 'Sesti razred' },
    { value: 'SEVENTH_GRADE', label: 'Sedmi razred' },
    { value: 'EIGHTH_GRADE', label: 'Osmi razred' },
    { value: 'NINTH_GRADE', label: 'Deveti razred' }
  ];
  genderOptions = [
    { value: 'BOY', label: 'Fant' },
    { value: 'GIRL', label: 'Dekle' },
    { value: 'OTHER', label: 'Drugo' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Raje ne povem' }
  ];

  constructor(private http: HttpClient) {}

  private formBuilder: FormBuilder = inject(FormBuilder);

  get email(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.registrationForm.get('name') as FormControl;
  }

  get surname(): FormControl {
    return this.registrationForm.get('surname') as FormControl;
  }

  get dateOfBirth(): FormControl {
    return this.registrationForm.get('dateOfBirth') as FormControl;
  }

  get grade(): FormControl {
    return this.registrationForm.get('grade') as FormControl;
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

  get enrollmentYear(): FormControl {
    return this.registrationForm.get('enrollmentYear') as FormControl;
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      email: [ '', [ Validators.required, Validators.email ] ],
      name: [ '', Validators.required ],
      surname: [ '', Validators.required ],
      dateOfBirth: [ '', Validators.required ],
      enrollmentYear: [ '2025', Validators.min(2025) ],
      grade: [ '', Validators.required ],
      gender: [ '', Validators.required ],
      address: [ '', Validators.required ],
      postalCode: [ '', [ Validators.required, Validators.pattern(/^\d+$/) ] ],
      city: [ '', Validators.required ]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      const formValue = this.registrationForm.value;
      const { year, month, day } = formValue.dateOfBirth;
      const formattedDateOfBirth = `${ year }-${ String(month).padStart(2, '0') }-${ String(day).padStart(2, '0') }`;
      const payload = {
        parent: {
          email: formValue.email
        },
        name: formValue.name,
        surname: formValue.surname,
        dateOfBirth: formattedDateOfBirth,
        enrollmentYear: formValue.enrollmentYear,
        grade: formValue.grade,
        gender: formValue.gender.value,
        address: formValue.address,
        postalCode: formValue.postalCode,
        city: formValue.city
      };
      this.http.post(ConfigurationService.ENDPOINTS.child.register(), payload)
        .subscribe({
          next: (): void => {
            alert('Form submitted successfully');
            this.loading = false;
            this.registrationFormRef.resetForm();
          },
          error: (): void => {
            alert('Error submitting form');
            this.loading = false;
          }
        });
    }
  }
}
