import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Page, ThickMaterial } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class ThickMaterialsService extends BaseService<ThickMaterial> {

    constructor(httpClient: HttpClient) {
        super('thickMaterials', httpClient);
    }

    listThickMaterial(): Observable<ThickMaterial[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<ThickMaterial>) => page.docs),
        );
    }
}
