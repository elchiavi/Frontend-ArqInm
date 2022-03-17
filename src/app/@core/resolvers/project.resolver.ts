import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Project } from '../models';
import { ProjectsService } from '../services/projects.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolver implements Resolve<Project> {

  constructor(private projectsService: ProjectsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Project> {
    if (route.params['id'] !== 'new') {
      return this.projectsService.get(route.params['id']);
    } else {
      return of(null);
    }
  }
}
