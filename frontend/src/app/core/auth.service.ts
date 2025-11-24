import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of, Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User } from './user.interface';
import { environment } from '../../environments/environment';

/**
 * Service to handle user authentication via BFF.
 * Manages login, logout, session refresh, and current user state.
 *
 * Token Handling Approach:
 * 1. User logs in -> BFF sets HttpOnly cookies.
 * 2. AuthService checks auth status by calling /auth/me (BFF reads cookie).
 * 3. AuthGuard uses the service to allow or block routes.
 * 4. Future calls from HttpClient go to BFF, which attaches the token from the cookie.
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

      // Attempt to restore session on startup
      this.checkAuth().subscribe();
    }
  }

  /**
   * Authenticates the user with username and password.
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
        })
      );
  }

  /**
   * Refreshes the user's session using the refresh token (handled by BFF).
   */
  refreshSession() {
    return this.httpClientForRefresh.post(`${environment.apiUrl}/auth/refresh`, {});
  }

  /**
   * Logs the user out.
   */
  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe(() => {
      this.performLogout(true);
    });
  }

  private performLogout(broadcast: boolean) {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      if (broadcast && this.authChannel) {
        this.authChannel.postMessage('logout');
      }
    }
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the user is authenticated by verifying with the server.
   * Used by AuthGuard.
   */
  checkAuth(): Observable<boolean> {
    // If we already have a user, we are authenticated
    if (this.currentUser()) return of(true);

    // If we are on the server (SSR), we can't check cookies easily without passing them through.
    // Optimistically return true to allow rendering the shell.
    // The client will re-verify immediately upon hydration.
    if (!isPlatformBrowser(this.platformId)) {
      return of(true);
    }

    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => this._currentUser.set(user)),
      map(() => true),
      catchError(() => {
        this._currentUser.set(null);
        return of(false);
      })
    );
  }

  /**
   * Synchronous check for current state (used in templates/signals).
   */
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
