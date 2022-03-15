import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { Client } from '../../../@core/models';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { SharedFormValidation } from '../../../@theme/utils/form.validation';
import { ClientsService } from '../../../@core/services/clients.service';

@Component({
  selector: 'ngx-client-detail',
  templateUrl: './client-detail.component.html',
})
@UnsubscribeOnDestroy()
export class ClientDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  client: Client;
  readOnly = false;

  constructor(public formBuilder: FormBuilder,
    public toastService: ToastService,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    public clientsService: ClientsService,
    public router: Router) { }

  ngOnInit() {
    this.client = this.activatedRoute.snapshot.data['client'];
    this.new = !this.client;
    this.readOnly = !this.new;
    this.createForm();
    this.mapData();
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.clientsService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('El cliente', action, 'success');
          this.router.navigate(['/pages/clients']);
        }, () => {
          this.toastService.error('Ya existe un cliente con ese DNI.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      businessName: [''],
      email: ['', [
        Validators.required, SharedFormValidation.emailValidator,
      ]],
      dni: ['', Validators.required],
      cuit: ['', Validators.required],
      category: ['', Validators.required],
      street: ['', Validators.required],
      streetNumber: ['', Validators.required],
      floor: [''],
      phone: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      enabled: [true],
    });
  }

  mapData() {
    if (!this.new) {
      this.form.reset(this.client);
    }
  }

  ngOnDestroy() { }
}