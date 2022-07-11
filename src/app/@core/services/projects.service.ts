import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Project } from '../models';


@Injectable({
    providedIn: 'root',
})
export class ProjectsService extends BaseService<Project> {

    constructor(httpClient: HttpClient) {
        super('projects', httpClient);
    }

    save(isNew: boolean, form: FormGroup): Observable<Project> {
        const project: Project = form.getRawValue();
        return isNew ? this.add(project) : this.update(project);
    }

    cloneProject(project: Project): Observable<Project> {
        return this.httpClient.post<Project>(`${this.fullPath}/clone`, project);
    }

    cloneFunctionalUnit(project: Project) {
        return this.httpClient.post(`${this.fullPath}/cloneFunctionaUnit`, project);
    }

    getMultiProject(id: string): Observable<Project> {
        const options = {
            params: new HttpParams().set('id', id.toString())
                .set('size', this.pageSize.toString()),
        };
        return this.httpClient.get<Project>(`${this.fullPath}`, options);
    }

    getProjectName(id: string) {
        return this.httpClient.get(`${this.fullPath}/project/${id}`);
    }

}
