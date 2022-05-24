import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InstallationMaterialBudget } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class InstallationMaterialBudgetsService extends BaseService<InstallationMaterialBudget> {

    constructor(httpClient: HttpClient) {
        super('installationMaterialBudgets', httpClient);
    }

    getInstallationMaterialBudgets(budgetId: string, filter?: string, option?: string):
        Observable<InstallationMaterialBudget[]> {
        let params: HttpParams;
        if (filter && option) {
            params = new HttpParams().set('id', budgetId).set('filter', filter).set('option', option);
        } else {
            params = new HttpParams().set('id', budgetId);
        }
        return this.httpClient.get<InstallationMaterialBudget[]>(`${this.fullPath}`, { params });
    }

    save(isUpdate: boolean, installationMaterialBudget: InstallationMaterialBudget):
        Observable<InstallationMaterialBudget> {
        return isUpdate ? this.update(installationMaterialBudget) : this.add(installationMaterialBudget);
    }

}
