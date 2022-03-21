import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, Page, Project } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { ProjectsService } from '../../../@core/services';
import { ToastService } from '../../../@theme/utils/toast.service';
import { SortEvent, NgxSortableHeaderDirective, Sortable } from '../../../@theme/directives/sortable-header.directive';

@Component({
    selector: 'ngx-project-list',
    templateUrl: './budget.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetComponent implements OnInit, OnDestroy {

    @ViewChildren(NgxSortableHeaderDirective) headers: QueryList<NgxSortableHeaderDirective>;
    budget: Budget;
    new = false;

    constructor(public toastService: ToastService,
        public projectsService: ProjectsService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.budget = this.activatedRoute.snapshot.data['budget'];
    }

    ngOnDestroy() { }

}
