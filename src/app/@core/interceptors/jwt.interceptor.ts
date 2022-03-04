import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import { switchMap } from 'rxjs/operators';
import { FormUtils } from '../../@theme/utils/form';


@Injectable({
  providedIn: 'root',
})
export class NbAuthJWTInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private authService: NbAuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.isAuthenticated()
      .pipe(
        switchMap(authenticated => {
          if (authenticated) {
            return this.authService.getToken().pipe(
              switchMap((token: NbAuthToken) => {
                req = req.clone({
                  setHeaders: {
                    Authorization: `x-token ${token.getValue()}`,
                  },
                });
                return next.handle(req);
              }),
            );
          } else {
            return next.handle(req).catch((errorResponse: any) => {
              if (errorResponse instanceof HttpErrorResponse) {
                if (FormUtils.handleFormValidationErrors(errorResponse.error)) {
                  if (errorResponse.status === 400 && errorResponse.error.code === 'TOKEN_EXPIRED') {
                    this.router.navigate(['/auth/logout']);
                  }
                }
              }
              return throwError(errorResponse);
            });
          }
        }),
      );

  }

}
