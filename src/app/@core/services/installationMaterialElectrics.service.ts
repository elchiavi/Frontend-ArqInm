import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InstallationMaterialDetailElectric } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class InstallationMaterialElectricsService extends BaseService<InstallationMaterialDetailElectric> {

    constructor(httpClient: HttpClient) {
        super('installationMaterialDetailElectrics', httpClient);
    }

    listInstallationMaterialElectric(installationMaterialDetailId: string):
        Observable<InstallationMaterialDetailElectric[]> {
        let params: HttpParams;
        params = new HttpParams().set('id', installationMaterialDetailId);
        return this.httpClient.get<InstallationMaterialDetailElectric[]>(`${this.fullPath}`, { params });
    }

    getWithOtherId(id: InstallationMaterialDetailElectric): Observable<InstallationMaterialDetailElectric> {
        return this.httpClient.get<InstallationMaterialDetailElectric>(`${this.fullPath}/${id}`);
    }
}
