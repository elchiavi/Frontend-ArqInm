import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, Page, Professional } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import { ProfessionalBudgetsService, ProfessionalsService } from '../../../@core/services';
import { Observable } from 'rxjs';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { ProfessionalBudget } from '../../../@core/models/professional-budget.model';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
  selector: 'ngx-budget-professionals',
  templateUrl: './budget-professionals.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetProfessionalComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() budget: Budget;
  professional$: Observable<Professional[]>;
  professionalBudgetPage: Page<ProfessionalBudget>;


  constructor(public toastService: ToastService,
    public professionalsService: ProfessionalsService,
    public professionalBudgetsService: ProfessionalBudgetsService,
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
    this.form.patchValue({ ['professional']: '' });
    this.form.patchValue({ ['cost']: '' });
  }

  loadPage() {
    this.createForm();
    this.professional$ = this.professionalsService.listProfessionals();
  }

  pageChangeProfessionalBudget(pageNumber?: number, filter?: string) {
    const id = this.budget[0]._id;
    this.professionalBudgetsService.getPage(pageNumber, filter, null, null, id).pipe(
      untilComponentDestroy.apply(this)).subscribe((professionalBudgetPage: Page<ProfessionalBudget>) => {
        this.professionalBudgetPage = professionalBudgetPage;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      professional: ['', Validators.required],
      cost: ['', Validators.required],
    });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      const professionalBudget: ProfessionalBudget = this.form.getRawValue();
      professionalBudget.budget = this.budget[0]._id;
      this.professionalBudgetsService.add(professionalBudget).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = 'create';
          this.toastService.showToast('El costo del profesional ', action, 'success');
          this.budget[0].totalCost = this.budget[0].totalCost + professionalBudget.cost;
          this.pageChangeProfessionalBudget();
          this.resetForm();
        }, () => {
          this.toastService.error('El costo del profesional ingresado ya se encuentra registrado para el presupuesto.');
        });
    }
  }

  deleteProfessionalBudget(professionalBudget: ProfessionalBudget) {
    const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
    const description = `Se eliminará el registro ${professionalBudget.professional.name} .`;
    modalRef.componentRef.instance.title = 'Confirmación';
    modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
    modalRef.onClose.subscribe((userResponse) => {
      if (userResponse) {
        this.professionalBudgetsService.delete(professionalBudget._id).pipe(
          untilComponentDestroy.apply(this)).subscribe(() => {
            this.toastService.warn('Producto eliminado');
            this.budget[0].totalCost = this.budget[0].totalCost - professionalBudget.cost;
            this.pageChangeProfessionalBudget();
          }, () => {
            this.toastService.error('Error Inesperado');
          });
      }
    });
  }

  ngOnDestroy() { }

}
