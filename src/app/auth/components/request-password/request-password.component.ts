import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, getDeepFromObject, NbAuthService, NbAuthResult } from '@nebular/auth';
import { untilComponentDestroy, UnsubscribeOnDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';

@Component({
  selector: 'ngx-request-password-page',
  styleUrls: ['./request-password.component.scss'],
  templateUrl: './request-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UnsubscribeOnDestroy()
export class RequestPasswordComponent implements OnDestroy {

  redirectDelay = 0;
  showMessages: any = {};
  strategy = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.requestPassword.showMessages');
    this.strategy = this.getConfigValue('forms.requestPassword.strategy');
  }

  ngOnDestroy() { }

  requestPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.requestPassword(this.strategy, this.user)
      .pipe(untilComponentDestroy.apply(this))
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
