import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, TerminationMaterial, TerminationMaterialDetail, TerminationMaterialBudget } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { Action, ToastService } from '../../../@theme/utils/toast.service';
import {
  BudgetsService, TerminationMaterialBudgetsService, TerminationMaterialDetailsService,
  TerminationMaterialsService,
} from '../../../@core/services';
import { Observable } from 'rxjs';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { ModalConfirmComponent } from '../../../@theme/components';

@Component({
  selector: 'ngx-budget-termination-material',
  templateUrl: './budget-termination-material.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetTerminationMaterialComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() budget: Budget;
  terminationMaterial$: Observable<TerminationMaterial[]>;
  terminationMaterialDetail$: Observable<TerminationMaterialDetail[]>;
  terminationMaterialBudget: TerminationMaterialBudget;
  preCost: number;
  update = false;
  options = [
    { value: 'terminationMaterial', label: 'Material de terminación' },
    { value: 'provider', label: 'Proveedor' },
  ];
  option = 'terminationMaterial';


  constructor(public toastService: ToastService,
    public budgetsService: BudgetsService,
    public terminationMaterialsService: TerminationMaterialsService,
    public terminationMaterialDetailsService: TerminationMaterialDetailsService,
    public terminationMaterialBudgetsService: TerminationMaterialBudgetsService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    public router: Router,
    public dialogService: NbDialogService) { }

  ngOnInit() {
    this.loadPage();
    this.getTerminationMaterialBudgets();
  }

  resetForm() {
    this.formHelperService.cleanAllFields(this.form);
    this.update = false;
    this.form.get('terminationMaterial').enable();
    this.form.get('terminationMaterialDetail').enable();
    this.form.patchValue({ ['terminationMaterial']: '' });
    this.form.patchValue({ ['terminationMaterialDetail']: '' });
    this.form.patchValue({ ['provider']: '' });
    this.form.patchValue({ ['unitOfMeasurement']: '' });
    this.form.patchValue({ ['description']: '' });
    this.form.patchValue({ ['cant']: '' });
    this.form.patchValue({ ['unitCost']: '' });
  }

  loadPage() {
    this.createForm();
    this.terminationMaterial$ = this.terminationMaterialsService.listTerminationMaterial();
  }

  change() {
    const termMatId = this.form.get('terminationMaterial').value;
    this.terminationMaterialDetail$ = this.terminationMaterialDetailsService.listTerminationMaterialDetail(termMatId);
  }

  getTerminationMaterialBudgets(filter?: string) {
    const id = this.budget[0]._id;
    this.terminationMaterialBudgetsService.getTerminationMaterialBudgets(id, filter, this.option).pipe(
      untilComponentDestroy.apply(this)).subscribe((terminationMaterialBudget: TerminationMaterialBudget) => {
        this.terminationMaterialBudget = terminationMaterialBudget;
      });
  }

  getBudget() {
    this.budgetsService.getBudgetForId(this.budget[0]._id).pipe(
      untilComponentDestroy.apply(this)).subscribe((budget: Budget) => {
        this.budget[0] = budget;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      terminationMaterial: ['', Validators.required],
      terminationMaterialDetail: ['', Validators.required],
      provider: ['', Validators.required],
      cant: ['', Validators.required],
      unitOfMeasurement: ['', Validators.required],
      unitCost: ['', Validators.required],
      description: [''],
    });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      const terminationMaterialBudget: TerminationMaterialBudget = this.form.getRawValue();
      terminationMaterialBudget.budget = this.budget[0]._id;
      this.terminationMaterialBudgetsService.save(this.update, terminationMaterialBudget).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.update ? 'update' : 'create';
          this.toastService.showToast('El material de terminación ', action, 'success');
          this.getBudget();
          this.getTerminationMaterialBudgets();
          this.resetForm();
        }, () => {
          this.toastService.error('Error Inesperado, contacte a su administrador.');
        });
    }
  }

  deleteTerminationBudget(terminationMaterialBudget: TerminationMaterialBudget) {
    const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
    const description = `Se eliminará el registro ${terminationMaterialBudget.terminationMaterial.name} .`;
    modalRef.componentRef.instance.title = 'Confirmación';
    modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
    modalRef.onClose.subscribe((userResponse) => {
      if (userResponse) {
        this.terminationMaterialBudgetsService.delete(terminationMaterialBudget._id).pipe(
          untilComponentDestroy.apply(this)).subscribe(() => {
            this.toastService.success('Material de terminación eliminado');
            this.getBudget();
            this.getTerminationMaterialBudgets();
          }, () => {
            this.toastService.error('Error Inesperado, contacte a su administrador.');
          });
      }
    });
  }

  search(filter: string) {
    if (filter.length === 0) {
      this.getTerminationMaterialBudgets();
      return;
    } else if (filter.trim().length === 0) {
      return;
    } else if (filter.trim().length > 2) {
      this.getTerminationMaterialBudgets(filter);
    }
  }

  clear(inputSearch: any) {
    if (inputSearch.value !== '') {
      inputSearch.value = '';
      this.getTerminationMaterialBudgets();
    }
  }

  edit(terminationMaterialBudget: TerminationMaterialBudget) {
    this.preCost = terminationMaterialBudget.cost;
    this.resetForm();
    this.update = true;
    this.form.get('_id').patchValue(terminationMaterialBudget._id);
    this.form.get('description').patchValue(terminationMaterialBudget.description);
    this.form.get('provider').patchValue(terminationMaterialBudget.provider);
    this.form.get('cant').patchValue(terminationMaterialBudget.cant);
    this.form.get('unitCost').patchValue(terminationMaterialBudget.unitCost);
    this.form.get('unitOfMeasurement').patchValue(terminationMaterialBudget.unitOfMeasurement);
    this.form.get('terminationMaterial').patchValue(terminationMaterialBudget.terminationMaterial._id);
    this.change();
    this.form.get('terminationMaterialDetail').patchValue(terminationMaterialBudget.terminationMaterialDetail._id);
    this.form.get('terminationMaterial').disable();
    this.form.get('terminationMaterialDetail').disable();
  }

  onlyInteger(event: any) {
    return event.keyCode >= 48 && event.keyCode <= 57;
  }

  ngOnDestroy() { }

}
