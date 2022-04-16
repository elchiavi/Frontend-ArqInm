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
  professionalBudgets: ProfessionalBudget;


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
    this.getProfessionalBudgets();
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

  getProfessionalBudgets() {
    const id = this.budget[0]._id;
    this.professionalBudgetsService.getProfessionalBudgets(id).pipe(
      untilComponentDestroy.apply(this)).subscribe((professionalBudgets: ProfessionalBudget) => {
        this.professionalBudgets = professionalBudgets;
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
          this.toastService.showToast('El costo de profesional ', action, 'success');
          this.budget[0].totalCost = this.budget[0].totalCost + professionalBudget.cost;
          this.getProfessionalBudgets();
          this.resetForm();
        }, () => {
          this.toastService.error('El costo de profesional ingresado ya se encuentra registrado para el presupuesto.');
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
            this.toastService.success('Gasto eliminado');
            this.budget[0].totalCost = this.budget[0].totalCost - professionalBudget.cost;
            this.getProfessionalBudgets();
          }, () => {
            this.toastService.error('Error Inesperado, contacte a su administrador');
          });
      }
    });
  }

  ngOnDestroy() { }

}
