import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'projects',
      data: {
        permission: 'view',
        resource: 'projects',
      },
      loadChildren: () => import('./project/project.module')
        .then(m => m.ProjectModule),
    },
    {
      path: 'users',
      data: {
        permission: 'view',
        resource: 'users',
      },
      loadChildren: () => import('./user/user.module')
        .then(m => m.UserModule),
    },
    {
      path: 'clients',
      data: {
        permission: 'view',
        resource: 'clients',
      },
      loadChildren: () => import('./client/client.module')
        .then(m => m.ClientModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
