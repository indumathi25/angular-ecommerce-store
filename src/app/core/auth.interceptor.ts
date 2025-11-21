import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { getCookie } from './cookie.utils';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = getCookie('accessToken');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
