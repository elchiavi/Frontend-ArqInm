import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Client, Page, Payment } from '../models';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class PaymentsService extends BaseService<Payment> {

    constructor(httpClient: HttpClient) {
        super('payments', httpClient);
    }

    save(isNew: boolean, form: FormGroup): Observable<Payment> {
        const payment: Payment = form.getRawValue();
        return isNew ? this.add(payment) : this.update(payment);
    }

    getPageObj(id: string): Observable<Payment> {
        return this.httpClient.get<Payment>(`${this.fullPath}/${id}`);
      }

}
