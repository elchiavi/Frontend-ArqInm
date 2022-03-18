import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectResolver } from '../../@core/resolvers';
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
