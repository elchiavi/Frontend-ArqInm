import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientResolver } from '../../@core/resolvers/client.resolver';
import { ClientComponent } from './client.component';
import { ClientDetailComponent } from './detail/client-detail.component';
import { ClientListComponent } from './list/client-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: 'list',
        component: ClientListComponent,
      },
      {
        path: ':id',
        component: ClientDetailComponent,
        resolve: {
          client: ClientResolver,
        },
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ClientRoutingModule {

}
