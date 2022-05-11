import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TerminationMaterialBudget } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class TerminationMaterialBudgetsService extends BaseService<TerminationMaterialBudget> {

    constructor(httpClient: HttpClient) {
        super('terminationMaterialBudgets', httpClient);
    }

    getTerminationMaterialBudgets(budgetId: string, filter?: string, option?: string):
        Observable<TerminationMaterialBudget[]> {
        let params: HttpParams;
        if (filter && option) {
            params = new HttpParams().set('id', budgetId).set('filter', filter).set('option', option);
        } else {
            params = new HttpParams().set('id', budgetId);
        }
        return this.httpClient.get<TerminationMaterialBudget[]>(`${this.fullPath}`, { params });
    }

    save(isUpdate: boolean, terminationMaterialBudget: TerminationMaterialBudget):
        Observable<TerminationMaterialBudget> {
        return isUpdate ? this.update(terminationMaterialBudget) : this.add(terminationMaterialBudget);
    }

}
