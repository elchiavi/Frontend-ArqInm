import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ConstructionSupportBudget } from '../models';


@Injectable({
    providedIn: 'root',
})
export class ConstructionSupportBudgetsService extends BaseService<ConstructionSupportBudget> {

    constructor(httpClient: HttpClient) {
        super('constructionSupportsBudgets', httpClient);
    }
}
