import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class UserIdResolver implements Resolve<Observable<string>> {

  constructor(private roleService: RoleService) { }

  resolve(): Observable<string> {
    return this.roleService.getUserId();
  }
}
