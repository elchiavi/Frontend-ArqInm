import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { MultiProjectModule } from './multi-project/multi-project.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    UserModule,
    ClientModule,
    MultiProjectModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
