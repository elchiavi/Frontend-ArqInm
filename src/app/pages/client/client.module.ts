import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientDetailComponent } from './detail/client-detail.component';
import { ClientListComponent } from './list/client-list.component';

@NgModule({
  imports: [
    ThemeModule,
    ClientRoutingModule,
  ],
  declarations: [
      ClientComponent,
      ClientListComponent,
      ClientDetailComponent,
  ],
})
export class ClientModule { }