import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MultiProject } from '../models';
import { MultiProjectsService } from '../services/multiProjects.service';

@Injectable({
  providedIn: 'root',
})
export class MultiProjectResolver implements Resolve<MultiProject> {

  constructor(private multiProjectsService: MultiProjectsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<MultiProject> {
    if (route.params['id'] !== 'new') {
      return this.multiProjectsService.get(route.params['id']);
    } else {
      return of(null);
    }
  }
}
