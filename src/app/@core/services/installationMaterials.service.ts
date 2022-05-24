import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Page, InstallationMaterial } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class InstallationMaterialsService extends BaseService<InstallationMaterial> {

    constructor(httpClient: HttpClient) {
        super('installationMaterials', httpClient);
    }

    listInstallationMaterial(): Observable<InstallationMaterial[]> {
        this.pageSize = 1000;
        return this.getPage().pipe(
            map((page: Page<InstallationMaterial>) => page.docs),
        );
    }
}
