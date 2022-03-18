import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { User } from '../../../@core/models';
import { UsersService } from '../../../@core/services';
import { Action, ToastService } from '../../../@theme/utils';
import { SharedFormService } from '../../../@theme/utils/form.service';
import { SharedFormValidation } from '../../../@theme/utils/form.validation';

@Component({
  selector: 'ngx-user-detail',
  templateUrl: './user-detail.component.html',
})
@UnsubscribeOnDestroy()
export class UserDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  new = false;
  user: User;
  readOnly = false;
  roles = ['ADMIN_ROLE', 'USER_ROLE'];

  constructor(public formBuilder: FormBuilder,
    public toastService: ToastService,
    public activatedRoute: ActivatedRoute,
    public formHelperService: SharedFormService,
    public usersService: UsersService,
    public router: Router) { }

  ngOnInit() {
    this.user = this.activatedRoute.snapshot.data['user'];
    this.new = !this.user;
    this.readOnly = !this.new;
    this.createForm();
    this.mapData();
  }

  save() {
    this.formHelperService.touchAllFields(this.form);
    if (this.form.valid) {
      this.usersService.save(this.new, this.form).pipe(
        untilComponentDestroy.apply(this)).subscribe(() => {
          const action: Action = this.new ? 'create' : 'update';
          this.toastService.showToast('El usuario', action, 'success');
          this.router.navigate(['/pages/users']);
        }, () => {
          this.toastService.error('El mail ingresado ya fue registrado.');
        });
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: [],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [
        Validators.required, SharedFormValidation.emailValidator,
      ]],
      role: [null, Validators.required],
      enabled: [true],
    });
  }

  mapData() {
    if (!this.new) {
      this.form.reset(this.user);
      this.form.get('email').disable();
    }
  }

  ngOnDestroy() { }
}
