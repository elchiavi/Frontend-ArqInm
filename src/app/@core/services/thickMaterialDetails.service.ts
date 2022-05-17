import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ThickMaterialDetail } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ThickMaterialDetailsService extends BaseService<ThickMaterialDetail> {

    constructor(httpClient: HttpClient) {
        super('thickMaterialDetails', httpClient);
    }

    listThickMaterialDetail(thickMaterialId: string ): Observable<ThickMaterialDetail[]> {
        let params: HttpParams;
          params = new HttpParams().set('id', thickMaterialId);
        return this.httpClient.get<ThickMaterialDetail[]>(`${this.fullPath}`, {params});
    }
}
