import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, Professional } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import { BudgetsService, ProfessionalBudgetsService, ProfessionalsService } from '../../../@core/services';
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

  @Input() budget: Budget;
  form: FormGroup;
  professional$: Observable<Professional[]>;
  professionalBudgets: ProfessionalBudget;
  preCost: number;
  update = false;

  constructor(public toastService: ToastService,
    public budgetsService: BudgetsService,
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
    this.update = false;
    this.form.get('professional').enable();
    this.form.patchValue({ ['professional']: '' });
    this.form.patchValue({ ['cost']: '' });
  }

  loadPage() {
    this.createForm();
    this.professional$ = this.professionalsService.listProfessionals();
  }

  getProfessionalBudgets(filter?: string) {
    const id = this.budget[0]._id;
    this.professionalBudgetsService.getProfessionalBudgets(id, filter).pipe(
      untilComponentDestroy.apply(this)).subscribe((professionalBudgets: ProfessionalBudget) => {
        this.professionalBudgets = professionalBudgets;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      professional: ['', Validators.required],
      cost: ['', Validators.required],
    });
  }

  getBudget() {
    this.budgetsService.getBudgetForId(this.budget[0]._id).pipe(
      untilComponentDestroy.apply(this)).subscribe((budget: Budget) => {
        this.budget[0] = budget;
      });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      const professionalBudget: ProfessionalBudget = this.form.getRawValue();
      professionalBudget.budget = this.budget[0]._id;
      this.professionalBudgetsService.save(this.update, professionalBudget).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.update ? 'update' : 'create';
          this.toastService.showToast('El costo de profesional ', action, 'success');
          this.getBudget();
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
            this.getBudget();
            this.getProfessionalBudgets();
          }, () => {
            this.toastService.error('Error Inesperado, contacte a su administrador');
          });
      }
    });
  }

  search(filter: string) {
    if (filter.length === 0) {
      this.getProfessionalBudgets();
      return;
    } else if (filter.trim().length === 0) {
      return;
    } else if (filter.trim().length > 2) {
      this.getProfessionalBudgets(filter);
    }
  }

  clear(inputSearch: any) {
    if (inputSearch.value !== '') {
      inputSearch.value = '';
      this.getProfessionalBudgets();
    }
  }

  edit(profesional: ProfessionalBudget) {
    this.preCost = profesional.cost;
    this.resetForm();
    this.update = true;
    this.form.get('professional').disable();
    this.form.get('_id').patchValue(profesional._id);
    this.form.get('cost').patchValue(profesional.cost);
    this.form.get('professional').patchValue(profesional.professional._id);
  }

  ngOnDestroy() { }

}
