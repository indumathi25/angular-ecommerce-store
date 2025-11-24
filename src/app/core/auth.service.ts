import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, AuthTokenResponse } from './user.interface';
import { getCookie, setCookie, deleteCookie } from './cookie.utils';
import { environment } from '../../environments/environment';

/**
 * Service to handle user authentication.
 * Manages login, logout, session refresh, and current user state.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private httpBackend = inject(HttpBackend);
  private httpClientForRefresh = new HttpClient(this.httpBackend);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  private authChannel: BroadcastChannel | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize BroadcastChannel for tab synchronization
      this.authChannel = new BroadcastChannel('auth_channel');
      this.authChannel.onmessage = (event) => {
        if (event.data === 'logout') {
          this.performLogout(false); // false = don't broadcast again
        }
      };

      const token = getCookie('accessToken');
      if (token) {
        this.fetchCurrentUser();
      }
    }
  }

  /**
   * Authenticates the user with username and password.
   * Stores the access and refresh tokens in cookies upon successful login.
   * @param username The user's username.
   * @param password The user's password.
   * @returns An Observable of the User object.
   */
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

  /**
   * Refreshes the user's session using the refresh token stored in cookies.
   * @returns An Observable of the new tokens.
   */
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

  /**
   * Logs the user out by clearing the session and removing cookies.
   * Redirects to the login page.
   */
  logout() {
    this.performLogout(true);
  }

  /**
   * Internal logout handler.
   * @param broadcast Whether to notify other tabs about the logout.
   */
  private performLogout(broadcast: boolean) {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      if (broadcast && this.authChannel) {
        this.authChannel.postMessage('logout');
      }
    }
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the user is currently authenticated.
   * @returns True if the user is logged in, false otherwise.
   */
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

  /**
   * Retrieves the access token from cookies.
   * @returns The access token string or null if not found.
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return getCookie('accessToken');
    }
    return null;
  }

  /**
   * Fetches the current user's profile from the server.
   * The authentication token is automatically added by the AuthInterceptor.
   */
  private fetchCurrentUser() {
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
