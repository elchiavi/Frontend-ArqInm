import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, ConstructionSupport, Page, ConstructionSupportBudget } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import { ConstructionSupportBudgetsService, ConstructionSupportsService } from '../../../@core/services';
import { Observable } from 'rxjs';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'ngx-budget-construction-support',
  templateUrl: './budget-construction-support.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetConstructionSupportComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() budget: Budget;
  constructionSupport$: Observable<ConstructionSupport[]>;
  constructionSupportBudgetPage: Page<ConstructionSupportBudget>;


  constructor(public toastService: ToastService,
    public constructionSupportsService: ConstructionSupportsService,
    public constructionSupportBudgetsService: ConstructionSupportBudgetsService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    public router: Router,
    public dialogService: NbDialogService) { }

  ngOnInit() {
    this.loadPage();
    this.pageChangeProfessionalBudget();
  }

  resetForm() {
    this.formHelperService.cleanAllFields(this.form);
    this.form.patchValue({ ['constructionSupport']: '' });
    this.form.patchValue({ ['cost']: '' });
  }

  loadPage() {
    this.createForm();
    this.constructionSupport$ = this.constructionSupportsService.listConstructionSupports();
  }

  pageChangeProfessionalBudget(pageNumber?: number, filter?: string) {
    const id = this.budget[0]._id;
    this.constructionSupportBudgetsService.getPage(pageNumber, filter, null, null, id).pipe(
      untilComponentDestroy.apply(this)).subscribe((constructionSupportBudgetPage: Page<ConstructionSupportBudget>) => {
        this.constructionSupportBudgetPage = constructionSupportBudgetPage;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      constructionSupport: ['', Validators.required],
      cost: ['', Validators.required],
    });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      const constructionSupportBudget: ConstructionSupportBudget = this.form.getRawValue();
      constructionSupportBudget.budget = this.budget[0]._id;
      this.constructionSupportBudgetsService.add(constructionSupportBudget).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = 'create';
          this.toastService.showToast('El costo de soporte de obra ', action, 'success');
          this.budget[0].totalCost = this.budget[0].totalCost + constructionSupportBudget.cost;
          this.pageChangeProfessionalBudget();
          this.resetForm();
        }, () => {
          this.toastService.error('El costo de soporte de obra ingresado ya se encuentra registrado para el presupuesto.');
        });
    }
  }

  deleteConstructionSupportBudget(constructionSupportBudget: ConstructionSupportBudget) {
    const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
    const description = `Se eliminará el registro ${constructionSupportBudget.constructionSupport.name} .`;
    modalRef.componentRef.instance.title = 'Confirmación';
    modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
    modalRef.onClose.subscribe((userResponse) => {
      if (userResponse) {
        this.constructionSupportBudgetsService.delete(constructionSupportBudget._id).pipe(
          untilComponentDestroy.apply(this)).subscribe(() => {
            this.toastService.success('Gasto eliminado');
            this.budget[0].totalCost = this.budget[0].totalCost - constructionSupportBudget.cost;
            this.pageChangeProfessionalBudget();
          }, () => {
            this.toastService.error('Error Inesperado');
          });
      }
    });
  }

  ngOnDestroy() { }

}
