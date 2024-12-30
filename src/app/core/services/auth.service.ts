import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = 'https://dedis-production-1-0-0.onrender.com/api/admin/login';
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  private tokenKey = 'id_token';
  private expirationKey = 'expires_at';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post(this.loginUrl, { username, password }, { responseType: 'text' }).pipe(
      tap((token: string) => this.setSession(token))
    );
  }


  private setSession(token: string) {
    const expiresAt = moment().add(3600, 'seconds'); // Assuming a default expiration of 1 hour

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

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
