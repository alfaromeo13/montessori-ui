import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { ConfigurationService } from '../../core/constants/configuration.service';
import { FormsModule } from '@angular/forms';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faEuroSign, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [
    FormsModule,
    FaIconComponent,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss'
})
export class DonationComponent implements AfterViewInit {
  protected readonly faEuroSign: IconDefinition = faEuroSign;
  protected readonly faSpinner: IconDefinition = faSpinner;
  amount: number = 0;
  donorName: string = '';
  donorEmail: string = '';
  message: string = '';
  stripe: Stripe | null = null;
  cardElement?: StripeCardElement | null = null;
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  async ngAfterViewInit() {
    this.stripe = await loadStripe('pk_test_51QTSvbKf6bYNlWkBwKdziX98BFJyML6IRRvxWEhMscyl0lx33rTRllOtUB0zAKg6y27B0D3XwcCQ1WcmQ2Q4Oun100EnWkj4td');
    const elements = this.stripe?.elements();
    this.cardElement = elements?.create('card');
    this.cardElement?.mount('#card-element');
  }

  async donate() {
    this.loading = true;
    if (!this.stripe || !this.cardElement) {
      alert('Stripe or card element not initialized!');
      this.loading = false;
      return;
    }

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement
    });

    if (error) {
      alert(`Payment method creation failed: ${ error.message }`);
      this.loading = false;
      return;
    }

    this.http.post(ConfigurationService.ENDPOINTS.donation.create(),
        {
          donorName: this.donorName || 'Anonymous',
          donorEmail: this.donorEmail,
          amount: this.amount * 100,
          message: this.message || 'No message provided'
        })
      .subscribe(async (response: any) => {
        const { clientSecret } = response;
        const result = await this.stripe?.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id
        });

        if (result?.error) {
          alert(`Payment failed: ${ result.error.message }`);
          this.loading = false;
        } else {
          alert('Payment successful!');
          this.loading = false;
        }
      });
  }
}
