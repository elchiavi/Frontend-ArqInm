import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanLoad {

  constructor(private authService: NbAuthService,
    private router: Router) {
  }

  canLoad() {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['auth/login']);
          }
          return authenticated;
        }),
      );
  }
}
