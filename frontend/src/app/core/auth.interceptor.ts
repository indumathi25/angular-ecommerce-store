import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Intercepts HTTP requests.
 * Since we use a BFF with HttpOnly cookies, we don't need to manually attach tokens.
 * The browser handles the cookie.
 * This interceptor primarily handles 401 Unauthorized errors by attempting to refresh the session.
 *
 * Token Handling Approach:
 * - Future calls from HttpClient attach the token from the cookie via this Interceptor (implicitly via browser cookie).
 */
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error) => {
      // Skip 401 handling on Server (SSR) to prevent redirect loops
      if (!isPlatformBrowser(platformId)) {
        return throwError(() => error);
      }

      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Ignore 401s from auth endpoints to prevent loops
        if (
          req.url.includes('/auth/login') ||
          req.url.includes('/auth/refresh') ||
          req.url.includes('/auth/me')
        ) {
          return throwError(() => error);
        }
        return handle401Error(req, next, injector);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, injector: Injector) {
  const authService = injector.get(AuthService);

  return authService.refreshSession().pipe(
    switchMap(() => {
      // Retry the request. The browser will send the new cookie.
      return next(request);
    }),
    catchError((refreshError) => {
      authService.logout();
      return throwError(() => refreshError);
    })
  );
}
