import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, Page } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { ModalConfirmComponent } from '../../../@theme/components';
import { ToastService } from '../../../@theme/utils/toast.service';
import { SortEvent, NgxSortableHeaderDirective, Sortable } from '../../../@theme/directives/sortable-header.directive';
import { ClientsService } from '../../../@core/services';

@Component({
  selector: 'ngx-client-list',
  templateUrl: './client-list.component.html',
})
@UnsubscribeOnDestroy()
export class ClientListComponent implements OnInit, OnDestroy{

  @ViewChildren(NgxSortableHeaderDirective) headers: QueryList<NgxSortableHeaderDirective>;
  userPage: Page<Client>;
  userLoggedin: string;
  new = false;

  constructor(public clientsService: ClientsService,
    public toastService: ToastService,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public dialogService: NbDialogService) { }

  ngOnInit() {
    this.pageChange();
  }

  pageChange(pageNumber?: number, filter?: string) {
    this.clientsService.getPage(pageNumber, filter).pipe(
      untilComponentDestroy.apply(this)).subscribe((userPage: Page<Client>) => {
        this.userPage = userPage;
        console.log(this.userPage);
      });
  }

//   search(filter: string) {
//     if (filter.length === 0) {
//       this.pageChange();
//       return;
//     } else if (filter.trim().length === 0) {
//       return;
//     } else if (filter.trim().length > 2) {
//       this.pageChange(null, filter);
//     }
//   }

//   onSort({ column, direction }: SortEvent): void {
//     this.headers.forEach(header => {
//       if (header.ngxSortable !== column) {
//         header.direction = '';
//       }
//     });
//     this.userService.sortColumn = column;
//     this.userService.sortDirection = direction;
//     this.pageChange();
//   }

//   clear(inputSearch: any) {
//     if (inputSearch.value !== '') {
//       inputSearch.value = '';
//       this.pageChange();
//     }
//   }

  ngOnDestroy() { }

}