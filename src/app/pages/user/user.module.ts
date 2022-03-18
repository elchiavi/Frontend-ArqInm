import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { ThemeModule } from '../../@theme/theme.module';
import { UserListComponent } from './list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { UserDetailComponent } from './detail/user-detail.component';

@NgModule({
  imports: [
    ThemeModule,
    UserRoutingModule,
  ],
  declarations: [
    UserComponent,
    UserListComponent,
    UserDetailComponent,
  ],
})
export class UserModule { }
