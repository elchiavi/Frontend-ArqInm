import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectResolver, BudgetResolver } from '../../@core/resolvers';
import { BudgetComponent } from './budget/budget.component';
import { ProjectDetailComponent } from './detail/project-detail.component';
import { ProjectListComponent } from './list/project-list.component';
import { ProjectComponent } from './project.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      {
        path: 'list',
        component: ProjectListComponent,
      },
      {
        path: ':id',
        component: ProjectDetailComponent,
        resolve: {
          project: ProjectResolver,
        },
      },
      {
        path: ':id/budget',
        component: BudgetComponent,
        resolve: {
          budget: BudgetResolver,
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
export class ProjectRoutingModule {

}
