import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../models';
import { UsersService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {

  constructor(private usersService: UsersService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    if (route.params['id'] !== 'new') {
      return this.usersService.get(route.params['id']);
    } else {
      return of(null);
    }
  }
}
