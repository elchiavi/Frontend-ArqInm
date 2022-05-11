import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TerminationMaterialDetail } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class TerminationMaterialDetailsService extends BaseService<TerminationMaterialDetail> {

    constructor(httpClient: HttpClient) {
        super('terminationMaterialDetails', httpClient);
    }

    listTerminationMaterialDetail(terminationMaterialId: string ): Observable<TerminationMaterialDetail[]> {
        let params: HttpParams;
          params = new HttpParams().set('id', terminationMaterialId);
        return this.httpClient.get<TerminationMaterialDetail[]>(`${this.fullPath}`, {params});
    }
}
