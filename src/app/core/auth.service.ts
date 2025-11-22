import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, AuthTokenResponse } from './user.interface';
import { getCookie, setCookie, deleteCookie } from './cookie.utils';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private httpBackend = inject(HttpBackend);
  private httpClientForRefresh = new HttpClient(this.httpBackend);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

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
        `${environment.apiUrl}/auth/login`,
        { username, password, expiresInMins: 30 },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        tap((user: User) => {
          this._currentUser.set(user);
          if (isPlatformBrowser(this.platformId)) {
            setCookie('accessToken', user.accessToken, 1);
            setCookie('refreshToken', user.refreshToken, 7);
          }
        })
      );
  }

  refreshSession() {
    if (!isPlatformBrowser(this.platformId)) return throwError(() => 'SSR');
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return throwError(() => 'No refresh token');

    return this.httpClientForRefresh
      .post<AuthTokenResponse>(`${environment.apiUrl}/auth/refresh`, {
        refreshToken,
        expiresInMins: 30,
      })
      .pipe(
        tap((tokens) => {
          setCookie('accessToken', tokens.accessToken || tokens.token || '', 1);
          setCookie('refreshToken', tokens.refreshToken, 7);
        })
      );
  }

  logout() {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (this.currentUser()) {
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
    this.http.get<User>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (user: User) => {
        this._currentUser.set(user);
      },
      error: () => {
        this.logout();
      },
    });
  }
}
