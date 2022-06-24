import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiProjectComponent } from './multi-project.component';
import { MultiProjectListComponent } from './list/multi-project-list.component';
import { MultiProjectDetailComponent } from './detail/multi-project-detail.component';
import { MultiProjectResolver } from '../../@core/resolvers';
import { ListProjectComponent } from './list-project/list-project.component';
import { FunctionalUnitComponent } from './functional-unit/functional-unit.component';


const routes: Routes = [
  {
    path: '',
    component: MultiProjectComponent,
    children: [
      {
        path: 'list',
        component: MultiProjectListComponent,
      },
      {
        path: ':id',
        component: MultiProjectDetailComponent,
        resolve: {
          multiProject: MultiProjectResolver,
        },
      },
      {
        path: ':id/list',
        component: ListProjectComponent,
      },
      {
        path: ':id/uf',
        component: FunctionalUnitComponent,
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
export class MultiProjectRoutingModule {

}
