import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbTokenService } from '@nebular/auth';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
})
@UnsubscribeOnDestroy()
export class LogoutComponent implements OnInit, OnDestroy {

  constructor(protected tokenService: NbTokenService,
    protected router: Router) {
  }

  ngOnInit(): void {
    this.logout();
  }

  ngOnDestroy() { }

  logout(): void {
    localStorage.clear();
    this.tokenService.clear()
      .pipe(untilComponentDestroy.apply(this))
      .subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
  }
}
