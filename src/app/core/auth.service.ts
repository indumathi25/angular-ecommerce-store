import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from './user.interface';
import { getCookie, setCookie, deleteCookie } from './cookie.utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  currentUserSignal = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = getCookie('accessToken');
      if (token) {
        this.fetchCurrentUser(token);
      }
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<User>(
        'https://dummyjson.com/auth/login',
        { username, password, expiresInMins: 30 },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        tap((user: User) => {
          this.currentUserSignal.set(user);
          if (isPlatformBrowser(this.platformId)) {
            setCookie('accessToken', user.accessToken, 1);
          }
        })
      );
  }

  logout() {
    this.currentUserSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      deleteCookie('accessToken');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (this.currentUserSignal()) {
      return true;
    }
    if (isPlatformBrowser(this.platformId)) {
      return !!getCookie('accessToken');
    }
    // Allow SSR to render the page; client will verify auth
    return true;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return getCookie('accessToken');
    }
    return null;
  }

  private fetchCurrentUser(token: string) {
    this.http.get<User>('https://dummyjson.com/auth/me').subscribe({
      next: (user: User) => {
        this.currentUserSignal.set(user);
      },
      error: (err) => {
        console.error('Session restore failed', err);
        this.logout();
      },
    });
  }
}
