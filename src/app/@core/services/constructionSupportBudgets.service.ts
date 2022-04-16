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

    getConstructionSupportsBudgets(budgetId: string): Observable<ConstructionSupportBudget[]> {
        let params: HttpParams;
          params = new HttpParams().set('id', budgetId);
        return this.httpClient.get<ConstructionSupportBudget[]>(`${this.fullPath}`, {params});
    }
}
