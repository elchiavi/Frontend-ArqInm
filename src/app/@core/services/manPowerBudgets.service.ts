import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ManPowerBudget } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ManPowerBudgetsService extends BaseService<ManPowerBudget> {

    constructor(httpClient: HttpClient) {
        super('manPowersBudgets', httpClient);
    }

    getManPowersBudgets(budgetId: string, filter?: string, option?: string): Observable<ManPowerBudget[]> {
        let params: HttpParams;
        if (filter && option) {
            params = new HttpParams().set('id', budgetId).set('filter', filter).set('option', option);
        } else {
            params = new HttpParams().set('id', budgetId);
        }
        return this.httpClient.get<ManPowerBudget[]>(`${this.fullPath}`, {params});
    }

    save(isUpdate: boolean, manPowerBudget: ManPowerBudget): Observable<ManPowerBudget> {
        return isUpdate ? this.update(manPowerBudget) : this.add(manPowerBudget);
    }

}
