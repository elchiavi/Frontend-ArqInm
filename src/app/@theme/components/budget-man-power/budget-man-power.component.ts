import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, ManPower, ManPowerSkill, ManPowerBudget } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import { ManPowerBudgetsService, ManPowerSkillsService, ManPowersService } from '../../../@core/services';
import { Observable } from 'rxjs';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
  selector: 'ngx-budget-man-power',
  templateUrl: './budget-man-power.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetManPowerComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() budget: Budget;
  manPower$: Observable<ManPower[]>;
  manPowerSkills$: Observable<ManPowerSkill[]>;
  manPowerBudgets: ManPowerBudget;


  constructor(public toastService: ToastService,
    public manPowersService: ManPowersService,
    public manPowerSkillsService: ManPowerSkillsService,
    public manPowerBudgetsService: ManPowerBudgetsService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    public router: Router,
    public dialogService: NbDialogService) { }

  ngOnInit() {
    this.loadPage();
    this.getManPowersBudgets();
  }

  resetForm() {
    this.formHelperService.cleanAllFields(this.form);
    this.form.patchValue({ ['manPower']: '' });
    this.form.patchValue({ ['manPowerSkills']: '' });
    this.form.patchValue({ ['cost']: '' });
    this.form.patchValue({ ['description']: '' });
  }

  loadPage() {
    this.createForm();
    this.manPower$ = this.manPowersService.listManPowers();
  }

  change() {
    const manPowerId = this.form.get('manPower').value;
    this.manPowerSkills$ = this.manPowerSkillsService.listManPowerSkills(manPowerId);
  }

  getManPowersBudgets() {
    const id = this.budget[0]._id;
    this.manPowerBudgetsService.getManPowersBudgets(id).pipe(
      untilComponentDestroy.apply(this)).subscribe((manPowerBudgets: ManPowerBudget) => {
        this.manPowerBudgets = manPowerBudgets;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      manPower: ['', Validators.required],
      manPowerSkill: ['', Validators.required],
      cost: ['', Validators.required],
      description: [''],
    });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      const manPowerBudget: ManPowerBudget = this.form.getRawValue();
      manPowerBudget.budget = this.budget[0]._id;
      this.manPowerBudgetsService.add(manPowerBudget).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = 'create';
          this.toastService.showToast('El costo de mano de obra ', action, 'success');
          this.budget[0].totalCost = this.budget[0].totalCost + manPowerBudget.cost;
          this.getManPowersBudgets();
          this.resetForm();
        }, () => {
          this.toastService.error('El costo de mano de obra y tarea ingresado ya se encuentra registrado para el presupuesto.');
        });
    }
  }

  deleteManPowerBudget(manPowerBudget: ManPowerBudget) {
    const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
    const description = `Se eliminará el registro ${manPowerBudget.manPower.name} .`;
    modalRef.componentRef.instance.title = 'Confirmación';
    modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
    modalRef.onClose.subscribe((userResponse) => {
      if (userResponse) {
        this.manPowerBudgetsService.delete(manPowerBudget._id).pipe(
          untilComponentDestroy.apply(this)).subscribe(() => {
            this.toastService.success('Gasto eliminado');
            this.budget[0].totalCost = this.budget[0].totalCost - manPowerBudget.cost;
            this.getManPowersBudgets();
          }, () => {
            this.toastService.error('Error Inesperado, contacte a su administrador');
          });
      }
    });
  }

  ngOnDestroy() { }

}
