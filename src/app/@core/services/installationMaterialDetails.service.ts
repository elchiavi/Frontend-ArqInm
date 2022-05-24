import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InstallationMaterialDetail } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class InstallationMaterialDetailsService extends BaseService<InstallationMaterialDetail> {

    constructor(httpClient: HttpClient) {
        super('installationMaterialDetails', httpClient);
    }

    listInstallationMaterialDetail(installationMaterialId: string ): Observable<InstallationMaterialDetail[]> {
        let params: HttpParams;
          params = new HttpParams().set('id', installationMaterialId);
        return this.httpClient.get<InstallationMaterialDetail[]>(`${this.fullPath}`, {params});
    }
}
