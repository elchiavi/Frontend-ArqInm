import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ThickMaterialBudget } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ThickMaterialBudgetsService extends BaseService<ThickMaterialBudget> {

    constructor(httpClient: HttpClient) {
        super('thickMaterialBudgets', httpClient);
    }

    getThickMaterialBudgets(budgetId: string, filter?: string, option?: string):
        Observable<ThickMaterialBudget[]> {
        let params: HttpParams;
        if (filter && option) {
            params = new HttpParams().set('id', budgetId).set('filter', filter).set('option', option);
        } else {
            params = new HttpParams().set('id', budgetId);
        }
        return this.httpClient.get<ThickMaterialBudget[]>(`${this.fullPath}`, { params });
    }

    save(isUpdate: boolean, thickMaterialBudget: ThickMaterialBudget):
        Observable<ThickMaterialBudget> {
        return isUpdate ? this.update(thickMaterialBudget) : this.add(thickMaterialBudget);
    }

}
