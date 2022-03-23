import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Page, Professional } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class ProfessionalsService extends BaseService<Professional> {

    constructor(httpClient: HttpClient) {
        super('professionals', httpClient);
    }

    listProfessionals(): Observable<Professional[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<Professional>) => page.docs),
        );
    }
}
