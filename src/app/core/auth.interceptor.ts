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

function addToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) return request;
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

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
