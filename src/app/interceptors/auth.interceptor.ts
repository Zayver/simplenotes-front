import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@/app/services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  if(auth.isLogged){
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${auth.user.token}`
      }
    })
  }
  return next(req);
};
