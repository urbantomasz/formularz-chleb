import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenProvider } from '../services/token-provider.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenProvider = inject(TokenProvider); 
  const token = tokenProvider.getToken();

  if (req.url.includes('accounts.google.com')) {
    return next(req);
  }

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
