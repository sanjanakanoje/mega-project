import {
  HttpInterceptorFn
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const token = localStorage.getItem('token');

  console.log(
    'AUTH INTERCEPTOR:',
    req.method,
    req.url,
    'Token exists:',
    !!token
  );

  if (!token) {
    console.warn(
      'No token found in localStorage'
    );

    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log(
    'Authorization header added'
  );

  return next(authReq);
};