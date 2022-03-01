import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class DueChangePasswordGuard implements CanActivate {

  constructor(private roleService: RoleService,
    private authService: NbAuthService,
    private router: Router) {
  }

  canActivate() {
    const dueChangePassword$: Observable<boolean> = this.roleService.dueChangePassword();
    const isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated();

    return combineLatest([dueChangePassword$, isAuthenticated$]).pipe(
      map(([dueChangePassword, isAuthenticated]) => {
        if (dueChangePassword) {
          this.router.navigate(['auth/change-password']);
        }
        if (!isAuthenticated) {
          this.router.navigate(['auth/login']);
        }
        return !dueChangePassword && isAuthenticated;
      }));
  }
}
