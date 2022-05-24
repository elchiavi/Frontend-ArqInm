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
  selector: 'ngx-budget-arqinm',
  templateUrl: './budget-arqinm.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetArqinmComponent implements OnInit, OnDestroy {

  @Input() budget: Budget;
  form: FormGroup;

  constructor(public toastService: ToastService,
    public budgetsService: BudgetsService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    public router: Router,
    public dialogService: NbDialogService) { }

  ngOnInit() {
    this.createForm();
    this.form.patchValue({ ['cost']: this.budget[0].totalCostArqInm });
  }

  resetForm() {
    this.formHelperService.cleanAllFields(this.form);
    this.form.patchValue({ ['cost']: this.budget[0].totalCostArqInm });
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
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
        this.budget[0].totalCostArqInm = this.form.get('cost').value;
        this.budgetsService.update(this.budget[0]).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = 'create';
          this.toastService.showToast('El costo ', action, 'success');
          this.getBudget();
          this.resetForm();
        }, () => {
          this.toastService.error('Error Inesperado, contacte a su administrador.');
        });
    }
  }

  ngOnDestroy() { }

}
