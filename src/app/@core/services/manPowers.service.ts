import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ManPower, Page } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class ManPowersService extends BaseService<ManPower> {

    constructor(httpClient: HttpClient) {
        super('manPowers', httpClient);
    }

    listManPowers(): Observable<ManPower[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<ManPower>) => page.docs),
        );
    }
}
