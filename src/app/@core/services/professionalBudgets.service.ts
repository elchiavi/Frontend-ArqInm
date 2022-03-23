import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ProfessionalBudget } from '../models';


@Injectable({
    providedIn: 'root',
})
export class ProfessionalBudgetsService extends BaseService<ProfessionalBudget> {

    constructor(httpClient: HttpClient) {
        super('professionalsBudgets', httpClient);
    }
}
