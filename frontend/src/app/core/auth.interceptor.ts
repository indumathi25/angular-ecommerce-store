import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { getCookie } from './cookie.utils';
import { AuthService } from './auth.service';
import { AuthTokenResponse } from './user.interface';

/**
 * Intercepts HTTP requests to add the authentication token.
 * Also handles 401 Unauthorized errors by attempting to refresh the session.
 */
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const token = getCookie('accessToken');

  const authReq = addToken(req, token);

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, injector);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Clones the request and adds the Authorization header with the provided token.
 * @param request The original HTTP request.
 * @param token The access token to add.
 * @returns The cloned request with the Authorization header.
 */
function addToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) return request;
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Handles 401 Unauthorized errors.
 * Attempts to refresh the session and retry the original request with the new token.
 * If refresh fails, logs the user out.
 * @param request The original HTTP request that failed.
 * @param next The HTTP handler.
 * @param injector The dependency injector to get AuthService.
 * @returns An Observable of the HTTP event.
 */
function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, injector: Injector) {
  const authService = injector.get(AuthService);

  return authService.refreshSession().pipe(
    switchMap((newTokens: AuthTokenResponse) => {
      const newToken = newTokens.accessToken || newTokens.token || '';
      return next(addToken(request, newToken));
    }),
    catchError((refreshError) => {
      authService.logout();
      return throwError(() => refreshError);
    })
  );
}
