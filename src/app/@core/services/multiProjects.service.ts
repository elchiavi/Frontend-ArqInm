import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { MultiProject } from '../models/multi-project.model';


@Injectable({
    providedIn: 'root',
})
export class MultiProjectsService extends BaseService<MultiProject> {

    constructor(httpClient: HttpClient) {
        super('multiFamilyProjects', httpClient);
    }

    save(isNew: boolean, form: FormGroup): Observable<MultiProject> {
        const multiProject: MultiProject = form.getRawValue();
        return isNew ? this.add(multiProject) : this.update(multiProject);
    }
}
