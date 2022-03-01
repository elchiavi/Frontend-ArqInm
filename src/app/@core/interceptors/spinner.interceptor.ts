import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SpinnerInterceptor implements HttpInterceptor {

    contador = 0;

    constructor(private spinner: NgxSpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.contador++;
        if (!req.headers.get('hiddenSpinner')) {
            setTimeout(() => this.spinner.show(), 25);
        } else {
            req = req.clone({ headers: req.headers.delete('hiddenSpinner') });
        }
        return next.handle(req).pipe(
            finalize(() => {
                this.contador--;
                if (this.contador === 0) {
                    setTimeout(() => this.spinner.hide(), 25);
                }
            }),
        );
    }
}
