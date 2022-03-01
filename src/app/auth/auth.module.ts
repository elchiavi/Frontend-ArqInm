import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import {
  AuthBlockComponent, LoginComponent, LogoutComponent,
  RequestPasswordComponent, ResetPasswordComponent,
} from './components/index';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent,
    AuthBlockComponent,
    LoginComponent,
    LogoutComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
  ],
})
export class AuthModule { }
