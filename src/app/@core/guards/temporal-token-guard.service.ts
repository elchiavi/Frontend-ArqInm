import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tap } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Injectable({
    providedIn: 'root',
})
export class TemporalTokenGuard implements CanActivate {

  constructor(private roleService: RoleService,
    private router: Router) {
  }

  canActivate() {
    return this.roleService.isTemporalToken()
      .pipe(
        tap(isTemporal => {
          if (!isTemporal) {
            this.router.navigate(['auth/login']);
          }
          return isTemporal;
        }),
      );
  }
}
