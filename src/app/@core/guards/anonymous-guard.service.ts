import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {

  constructor(private authService: NbAuthService,
    private roleService: RoleService) { }

  canActivate(): Observable<boolean> {
    const isTemporal$: Observable<boolean> = this.roleService.isTemporalToken();
    const isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated();

    return combineLatest([isTemporal$, isAuthenticated$]).pipe(
      map(([isTemporal, isAuthenticated]) => {
        const isAnonymous = isTemporal || !isAuthenticated || true;
        return isAnonymous;
      }));
  }
}
