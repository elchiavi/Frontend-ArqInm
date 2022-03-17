import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
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
}
