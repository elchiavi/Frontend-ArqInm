import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Payment } from '../models';
import { PaymentsService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class PaymentListResolver implements Resolve<Payment> {

  constructor(private paymentsService: PaymentsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Payment> {
    if (route.params['id'] !== 'new') {
      return this.paymentsService.getPageObj(route.params['id']);
    } else {
      return of(null);
    }
  }
}
