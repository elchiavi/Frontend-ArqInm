import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Client, Payment } from '../../../@core/models';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { PaymentsService } from '../../../@core/services/paymets.service';

@Component({
  selector: 'ngx-detail-payment',
  templateUrl: './detail-payment.component.html',
  styleUrls: ['./detail-payment.component.scss'],
})
@UnsubscribeOnDestroy()
export class DetailPaymentComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  payment: Payment;
  budgetId: string;
  clients: Client[];
  input$ = new Subject<string>();
  loading = false;
  readOnly = false;

  constructor(public formBuilder: FormBuilder,
    public paymentsService: PaymentsService,
    public toastService: ToastService,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    private location: Location,
    protected dateService: NbDateService<Date>,
    public router: Router) { }

  ngOnInit() {
    this.budgetId = this.activatedRoute.snapshot.params.budget;
    this.payment = this.activatedRoute.snapshot.data['payment'];
    this.new = !this.payment;
    this.createForm();
    this.mapData();
  }

  save() {
    this.form.patchValue({ ['budget']: this.budgetId });
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.paymentsService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('El ingreso', action, 'success');
          this.return();
        }, () => {
          this.toastService.error('Error inesperado, contactar a su administrador.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      amount: ['', Validators.required],
      period: ['', Validators.required],
      budget: ['', Validators.required],
      payDate: ['', Validators.required],
      description: [],
      typePayment: ['', Validators.required],
    });
  }

  mapData() {
    if (!this.new) {
      this.form.reset(this.payment);
    }
  }

  public compareFn(a, b): boolean {
    return a === b;
  }

  return() {
    this.location.back();
  }

  ngOnDestroy() { }
}
