import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';
import { environment } from '../../environments/environment';
import { NbAuthJWTInterceptor, SpinnerInterceptor } from './interceptors';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { RoleService } from './services/role.service';

export const NB_CORE_PROVIDERS = [
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        token: {
          class: NbAuthJWTToken,
          key: 'token',
        },
        baseEndpoint: environment.baseEndpoint,
        login: {
          endpoint: '/users/login',
          method: 'post',
          redirect: {
            success: 'pages/dashboard',
            failure: null,
          },
        },
        requestPass: {
          endpoint: '/users/resetPassword',
          method: 'patch',
        },
        resetPass: {
          endpoint: '/users/changePassword',
          method: 'patch',
          redirect: {
            success: 'auth/logout',
          },
        },
      }),
    ],
    forms: {
      login: {
        strategy: 'email',
        redirectDelay: 0,
      },
      logout: {
        redirectDelay: 0,
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      admin: {
        view:   [],
        create: [],
        edit:   [],
        remove: [],
      },
    },
  }).providers,
  {
    provide: NbRoleProvider, useClass: RoleService,
  },
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
  providers: [
     // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
     { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
