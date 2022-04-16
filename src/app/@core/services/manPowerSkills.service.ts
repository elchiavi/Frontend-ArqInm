import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ManPowerSkill } from '../models';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ManPowerSkillsService extends BaseService<ManPowerSkill> {

    constructor(httpClient: HttpClient) {
        super('manPowerSkills', httpClient);
    }

    listManPowerSkills(manPowerId: string ): Observable<ManPowerSkill[]> {
        let params: HttpParams;
          params = new HttpParams().set('id', manPowerId);
        return this.httpClient.get<ManPowerSkill[]>(`${this.fullPath}`, {params});
    }
}
