import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from './user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  currentUserSignal = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getCookie('accessToken');
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
            this.setCookie('accessToken', user.accessToken, 1);
          }
        })
      );
  }

  logout() {
    this.currentUserSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      this.deleteCookie('accessToken');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (this.currentUserSignal()) {
      return true;
    }
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getCookie('accessToken');
    }
    // Allow SSR to render the page; client will verify auth
    return true;
  }

  private fetchCurrentUser(token: string) {
    this.http
      .get<User>('https://dummyjson.com/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (user: User) => {
          this.currentUserSignal.set(user);
        },
        error: () => {
          this.logout();
        },
      });
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    const secureFlag = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      name + '=' + (value || '') + expires + '; path=/; SameSite=Strict' + secureFlag;
  }

  private deleteCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
