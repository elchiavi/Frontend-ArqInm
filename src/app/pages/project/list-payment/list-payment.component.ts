import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { BudgetsService, PaymentsService } from '../../../@core/services';
import { ToastService } from '../../../@theme/utils/toast.service';
import { SortEvent, NgxSortableHeaderDirective, Sortable } from '../../../@theme/directives/sortable-header.directive';
import { Payment } from '../../../@core/models/payment.model';
import { Budget } from '../../../@core/models/budget.model';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
    selector: 'ngx-project-list',
    templateUrl: './list-payment.component.html',
    styleUrls: ['./list-payment.component.scss'],
})
@UnsubscribeOnDestroy()
export class ListPaymentComponent implements OnInit, OnDestroy, Sortable {

    @ViewChildren(NgxSortableHeaderDirective) headers: QueryList<NgxSortableHeaderDirective>;
    paymentPage: Page<Payment>;
    new = false;
    budgetId: string;
    budget: Budget;
    sumPayment = 0;

    constructor(public toastService: ToastService,
        public budgetsService: BudgetsService,
        public paymentsService: PaymentsService,
        public formBuilder: FormBuilder,
        private location: Location,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.budgetId = this.activatedRoute.snapshot.params.id;
        this.getBudget();
        this.getSumPayment();
        this.pageChange();
    }

    getBudget() {
        this.budgetsService.getBudgetForId(this.budgetId).pipe(
            untilComponentDestroy.apply(this)).subscribe((budget: Budget) => {
                this.budget = budget;
            });
    }

    getSumPayment() {
        this.paymentsService.getSumPayment(this.budgetId).pipe(
            untilComponentDestroy.apply(this)).subscribe((totalPayment: number) => {
                this.sumPayment = totalPayment;
            });
    }

    pageChange(pageNumber?: number, filter?: string) {
        this.paymentsService.getPage(pageNumber, filter, null, null, this.budgetId).pipe(
            untilComponentDestroy.apply(this)).subscribe((paymentPage: Page<Payment>) => {
                this.paymentPage = paymentPage;
            });
    }

    search(filter: string) {
        if (filter.length === 0) {
            this.pageChange();
            return;
        } else if (filter.trim().length === 0) {
            return;
        } else if (filter.trim().length > 2) {
            this.pageChange(null, filter);
        }
    }

    onSort({ column, direction }: SortEvent): void {
        this.headers.forEach(header => {
            if (header.ngxSortable !== column) {
                header.direction = '';
            }
        });
        this.paymentsService.sortColumn = column;
        this.paymentsService.sortDirection = direction;
        this.pageChange();
    }

    clear(inputSearch: any) {
        if (inputSearch.value !== '') {
            inputSearch.value = '';
            this.pageChange();
        }
    }

    return() {
        this.location.back();
    }

    deletePayment(id: string) {
        const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
        const description = 'Se eliminará el ingreso';
        modalRef.componentRef.instance.title = 'Confirmación';
        modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
        modalRef.onClose.subscribe((userResponse) => {
          if (userResponse) {
            this.paymentsService.delete(id).pipe(
                untilComponentDestroy.apply(this)).subscribe(() => {
                    this.getSumPayment();
                    this.pageChange();
              }, () => {
                this.toastService.error('Error Inesperado, contacte a su administrador');
              });
          }
        });
    }

    ngOnDestroy() { }

}
