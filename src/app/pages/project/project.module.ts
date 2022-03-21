import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProjectListComponent } from './list/project-list.component';
import { ProjectDetailComponent } from './detail/project-detail.component';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { BudgetComponent } from './budget/budget.component';

@NgModule({
  imports: [
    ThemeModule,
    ProjectRoutingModule,
  ],
  declarations: [
      ProjectComponent,
      ProjectListComponent,
      ProjectDetailComponent,
      BudgetComponent,
  ],
})
export class ProjectModule { }
