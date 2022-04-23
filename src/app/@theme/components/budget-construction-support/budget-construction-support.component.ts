import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Output() changeCost: EventEmitter<{ update: boolean, preCost: number, cost: number }> = new EventEmitter();
  constructionSupport$: Observable<ConstructionSupport[]>;
  constructionSupportBudgets: ConstructionSupportBudget;
  preCost: number;
  update = false;


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
    this.getConstructionSupportBudgets();
  }

  resetForm() {
    this.formHelperService.cleanAllFields(this.form);
    this.update = false;
    this.form.get('constructionSupport').enable();
    this.form.patchValue({ ['constructionSupport']: '' });
    this.form.patchValue({ ['cost']: '' });
  }

  loadPage() {
    this.createForm();
    this.constructionSupport$ = this.constructionSupportsService.listConstructionSupports();
  }

  getConstructionSupportBudgets(filter?: string) {
    const id = this.budget[0]._id;
    this.constructionSupportBudgetsService.getConstructionSupportsBudgets(id, filter).pipe(
      untilComponentDestroy.apply(this)).subscribe((constructionSupportBudgets: ConstructionSupportBudget) => {
        this.constructionSupportBudgets = constructionSupportBudgets;
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      constructionSupport: ['', Validators.required],
      cost: ['', Validators.required],
    });
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      const constructionSupportBudget: ConstructionSupportBudget = this.form.getRawValue();
      constructionSupportBudget.budget = this.budget[0]._id;
      this.constructionSupportBudgetsService.save(this.update, constructionSupportBudget).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.update ? 'update' : 'create';
          this.toastService.showToast('El costo de soporte de obra ', action, 'success');
          this.changeCost.emit({ update: this.update, preCost: this.preCost, cost: constructionSupportBudget.cost });
          this.getConstructionSupportBudgets();
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
            this.getConstructionSupportBudgets();
          }, () => {
            this.toastService.error('Error Inesperado, contacte a su administrador');
          });
      }
    });
  }

  search(filter: string) {
    if (filter.length === 0) {
      this.getConstructionSupportBudgets();
      return;
    } else if (filter.trim().length === 0) {
      return;
    } else if (filter.trim().length > 2) {
      this.getConstructionSupportBudgets(filter);
    }
  }

  clear(inputSearch: any) {
    if (inputSearch.value !== '') {
      inputSearch.value = '';
      this.getConstructionSupportBudgets();
    }
  }

  edit(constructionSupportBudget: ConstructionSupportBudget) {
    this.preCost = constructionSupportBudget.cost;
    this.resetForm();
    this.update = true;
    this.form.get('constructionSupport').disable();
    this.form.get('_id').patchValue(constructionSupportBudget._id);
    this.form.get('cost').patchValue(constructionSupportBudget.cost);
    this.form.get('constructionSupport').patchValue(constructionSupportBudget.constructionSupport._id);
  }

  ngOnDestroy() { }

}
