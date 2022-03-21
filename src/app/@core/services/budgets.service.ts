import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Budget } from '../models';


@Injectable({
    providedIn: 'root',
})
export class BudgetsService extends BaseService<Budget> {

    constructor(httpClient: HttpClient) {
        super('budgets', httpClient);
    }

    getBudget(id: string) {
        return this.httpClient.get<Budget>(`${this.fullPath}/project?project=${id}`);
    }

    // save(isNew: boolean, form: FormGroup): Observable<Budget> {
    //     const budget: Budget = form.getRawValue();
    //     return isNew ? this.add(budget) : this.update(budget);
    // }
}
