import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { MultiProjectListComponent } from './list/multi-project-list.component';
import { MultiProjectComponent } from './multi-project.component';
import { MultiProjectRoutingModule } from './multi-project-routing.module';
import { MultiProjectDetailComponent } from './detail/multi-project-detail.component';
import { ListProjectComponent } from './list-project/list-project.component';
import { FunctionalUnitComponent } from './functional-unit/functional-unit.component';

@NgModule({
  imports: [
    ThemeModule,
    MultiProjectRoutingModule,
  ],
  declarations: [
    MultiProjectComponent,
    MultiProjectListComponent,
    MultiProjectDetailComponent,
    ListProjectComponent,
    FunctionalUnitComponent,
  ],
})
export class MultiProjectModule { }
