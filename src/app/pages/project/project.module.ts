import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProjectListComponent } from './list/project-list.component';
import { ProjectDetailComponent } from './detail/project-detail.component';
import { ProjectComponent } from './project.component';
import { ProjectRoutingModule } from './project-routing.module';
import { BudgetComponent } from './budget/budget.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
import { NbTabsetModule } from '@nebular/theme';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
@NgModule({
  imports: [
    ThemeModule,
    ProjectRoutingModule,
    NbTabsetModule,
  ],
  declarations: [
      ProjectComponent,
      ProjectListComponent,
      ProjectDetailComponent,
      BudgetComponent,
      ListPaymentComponent,
      DetailPaymentComponent,
  ],
})
export class ProjectModule { }
