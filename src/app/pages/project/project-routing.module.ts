import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectResolver, BudgetResolver, PaymentListResolver, PaymentResolver } from '../../@core/resolvers';
import { BudgetComponent } from './budget/budget.component';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { ProjectDetailComponent } from './detail/project-detail.component';
import { ListPaymentComponent } from './list-payment/list-payment.component';
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
        path: ':id/paymentList',
        component: ListPaymentComponent,
        resolve: {
          paymentList: PaymentListResolver,
        },
      },
      {
        path: ':budget/payment/:id',
        component: DetailPaymentComponent,
        resolve: {
          payment: PaymentResolver,
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
