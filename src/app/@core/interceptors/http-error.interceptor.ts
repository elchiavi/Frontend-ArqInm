import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormUtils } from '../../@theme/utils/form';
import { Router } from '@angular/router';
import { ToastService,  } from '../../@theme/utils';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private toastService: ToastService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((httpError: HttpErrorResponse) => {
          let errorMessage = '';
          if (httpError.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${httpError.error.message}`;
            this.toastService.error(errorMessage);
          } else {
            // server-side error
            if (FormUtils.handleFormValidationErrors(httpError.error)) {
              const customError = FormUtils.getErrorCustomError(httpError);
              if (customError) {
                return throwError(customError);
              } else {
                errorMessage = `Error Code: ${httpError.error.code}\nMessage: ${httpError.error.message}`;
                this.toastService.error(errorMessage);
              }
            } else {
              if (httpError.status === 409) {
                if (httpError.error.type === 'application/json') {
                  this.toastService.error('No se puede cerrar el informe porque hay uno o más' + '\n' +
                    'países que no se encuentran en estado Terminado');
                }
              } else {
                errorMessage = `Error Code: ${httpError.status}\nMessage: ${httpError.message}`;
              }
            }
          }
          return throwError(errorMessage);
        }),
      );
  }
}
