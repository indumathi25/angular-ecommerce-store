import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { getCookie } from './cookie.utils';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const token = getCookie('accessToken');

  // Clone request if token exists
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.log('AuthInterceptor: 401 detected, attempting refresh...');
        const authService = injector.get(AuthService);
        // Attempt to refresh session once
        return authService.refreshSession().pipe(
          switchMap((newTokens: any) => {
            const newToken = newTokens.accessToken || newTokens.token;
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            // clear state and redirect
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
