import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError, switchMap, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const auth = inject(AuthService)
  const message = inject(MessageService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse)=>{
      switch(error.status){
        case 0: {
          message.add({
            severity: 'error',
            summary: 'Error connecting, ensure you have internet'
          })
          break
        }
        case HttpStatusCode.Unauthorized || HttpStatusCode.Forbidden:{
          if(req.url.includes("/login")){
            return throwError(()=> error)
          }
          message.add({
            severity: 'error',
            summary: 'Not authorized, try to login again'
          })
          auth.logout().pipe(
            switchMap(()=> timer(1200))
          ).subscribe(()=> router.navigate(['/login']))
          break
        }
        case HttpStatusCode.NotFound:{
          router.navigate(['/error'])
          break
        }
        case HttpStatusCode.InternalServerError:{
          message.add({
            severity: 'error',
            summary: 'Unkwown server error'
          })
          break
        }
        default:{
          return throwError(()=> error)
        }
      }
      return next(req)
    })
  )
};
