import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConstructionSupportBudget } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ConstructionSupportBudgetsService extends BaseService<ConstructionSupportBudget> {

    constructor(httpClient: HttpClient) {
        super('constructionSupportsBudgets', httpClient);
    }

    getConstructionSupportsBudgets(budgetId: string, filter?: string): Observable<ConstructionSupportBudget[]> {
        let params: HttpParams;
        if (filter) {
            params = new HttpParams().set('id', budgetId).set('filter', filter);
        } else {
            params = new HttpParams().set('id', budgetId);
        }
        return this.httpClient.get<ConstructionSupportBudget[]>(`${this.fullPath}`, { params });
    }

    save(isUpdate: boolean, constructionSupportBudget: ConstructionSupportBudget):
        Observable<ConstructionSupportBudget> {
        return isUpdate ? this.update(constructionSupportBudget) : this.add(constructionSupportBudget);
    }
}
