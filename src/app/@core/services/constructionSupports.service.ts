import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Page, ConstructionSupport } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class ConstructionSupportsService extends BaseService<ConstructionSupport> {

    constructor(httpClient: HttpClient) {
        super('constructionSupports', httpClient);
    }

    listConstructionSupports(): Observable<ConstructionSupport[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<ConstructionSupport>) => page.docs),
        );
    }
}
