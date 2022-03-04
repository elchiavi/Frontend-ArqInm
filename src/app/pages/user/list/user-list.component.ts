import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { UsersService } from '../../../@core/services/users.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Page } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { ModalConfirmComponent } from '../../../@theme/components';
import { RoleService } from '../../../@core/services';
import { ToastService } from '../../../@theme/utils/toast.service';

@Component({
  selector: 'ngx-user-list',
  templateUrl: './user-list.component.html',
})
@UnsubscribeOnDestroy()
export class UserListComponent implements OnInit, OnDestroy {

  userPage: Page<User>;
  userLoggedin: string;
  new = false;

  constructor(public userService: UsersService,
    public roleService: RoleService,
    public toastService: ToastService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public dialogService: NbDialogService) { }

  ngOnInit() {
    this.pageChange();
    this.roleService.getEmail()
      .pipe(untilComponentDestroy.apply(this))
      .subscribe((email: string) => {
        this.userLoggedin = email;
      });
  }

  isNotLoggedinUser(user: User): boolean {
    return user.email !== this.userLoggedin;
  }

  pageChange(pageNumber?: number, filter?: string) {
    this.userService.getPage(pageNumber, filter).pipe(
      untilComponentDestroy.apply(this)).subscribe((userPage: Page<User>) => {
        this.userPage = userPage;
      });
  }

  search(filter: string) {
    if (filter.length === 0) {
      this.pageChange();
      return;
    } else if (filter.trim().length === 0) {
      return;
    } else if (filter.trim().length > 2) {
      this.pageChange(null, filter);
    }
  }

  clear(inputSearch: any) {
    if (inputSearch.value !== '') {
      inputSearch.value = '';
      this.pageChange();
    }
  }

  changeStatus(user: User) {
    const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
    const description = user.enabled ? `Se dehabilitará el usuario ${user.surname}, ${user.name}`
      : `Se habilitará el usuario ${user.surname}, ${user.name}`;
    modalRef.componentRef.instance.title = 'Confirmación';
    modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
    modalRef.onClose.subscribe((userResponse) => {
      if (userResponse) {
        this.userService.enabledUser(user).pipe(
          untilComponentDestroy.apply(this)).subscribe((userModified: User) => {
            user = userModified;
          });
      }
    });
  }

  emailResetPass(user: User) {
    const modalRef = this.dialogService.open(ModalConfirmComponent, { closeOnBackdropClick: false });
    const description = 'Se enviará un email al usuario para realizar el cambio de clave.';
    modalRef.componentRef.instance.title = 'Confirmación';
    modalRef.componentRef.instance.message = `${description} ¿Desea continuar?`;
    modalRef.onClose.subscribe((userResponse) => {
      if (userResponse) {
        this.userService.resetPass(user.email).pipe(
          untilComponentDestroy.apply(this)).subscribe(() => {
            this.toastService.success('Mail enviado correctamente');
          });
      }
    });
  }

  ngOnDestroy() { }

}
