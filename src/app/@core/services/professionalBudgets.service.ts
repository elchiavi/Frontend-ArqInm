import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProfessionalBudget } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ProfessionalBudgetsService extends BaseService<ProfessionalBudget> {

    constructor(httpClient: HttpClient) {
        super('professionalsBudgets', httpClient);
    }

    getProfessionalBudgets(budgetId: string, filter?: string): Observable<ProfessionalBudget[]> {
        let params: HttpParams;
        if (filter) {
            params = new HttpParams().set('id', budgetId).set('filter', filter);
        } else {
            params = new HttpParams().set('id', budgetId);
        }
        return this.httpClient.get<ProfessionalBudget[]>(`${this.fullPath}`, {params});
    }
}
