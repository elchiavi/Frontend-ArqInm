import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthResult, getDeepFromObject, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RoleService } from '../../../@core/services/role.service';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';

@Component({
  selector: 'ngx-reset-password-page',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UnsubscribeOnDestroy()
export class ResetPasswordComponent implements OnDestroy {

  redirectDelay = 0;
  showMessages: any = {};
  strategy = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  resetPassword: any = {};
  email$: Observable<string>;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected roleService: RoleService,
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy = this.getConfigValue('forms.resetPassword.strategy');
  }

  ngOnDestroy() { }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.email$ = this.roleService.getEmail();

    this.email$.pipe(
      untilComponentDestroy.apply(this),
      switchMap((email) => {
        this.resetPassword.email = email;
        return this.service.resetPassword(this.strategy, this.resetPassword);
      })).subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => this.router.navigateByUrl(redirect), this.redirectDelay);
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
