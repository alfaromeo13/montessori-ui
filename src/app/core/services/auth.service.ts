import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import moment from 'moment';
import { ConfigurationService } from '../constants/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  private tokenKey: string = 'id_token';
  private expirationKey: string = 'expires_at';

  constructor(private http: HttpClient,
              private router: Router) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post(ConfigurationService.ENDPOINTS.admin.login(), {
      username,
      password
    }, { responseType: 'text' }).pipe(
      tap((token: string): void => this.setSession(token)),
      catchError((error) => {
        alert('Wrong credentials');  // Show alert for 401 or any error
        return throwError(() => new Error('Wrong credentials'));  // Properly return the error
      })
    );
  }

  private setSession(token: string): void {
    const expiresAt = moment().add(20, 'minutes');
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.expirationKey, JSON.stringify(expiresAt.valueOf()));
    this.authStatus.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationKey);
    this.authStatus.next(false);
    this.router.navigate([ '/' ]);
  }

  isLoggedIn(): boolean {
    const expiration = localStorage.getItem(this.expirationKey);
    return expiration ? moment().isBefore(moment(JSON.parse(expiration))) : false;
  }

  getAuthStatus(): boolean {
    return this.isLoggedIn();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
