import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { TerminationMaterial, Page } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class TerminationMaterialsService extends BaseService<TerminationMaterial> {

    constructor(httpClient: HttpClient) {
        super('terminationMaterials', httpClient);
    }

    listTerminationMaterial(): Observable<TerminationMaterial[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<TerminationMaterial>) => page.docs),
        );
    }
}
