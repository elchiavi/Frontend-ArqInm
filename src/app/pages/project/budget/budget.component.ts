import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, Project } from '../../../@core/models';
import { NbDialogService } from '@nebular/theme';
import { ToastService } from '../../../@theme/utils/toast.service';

@Component({
    selector: 'ngx-project-list',
    templateUrl: './budget.component.html',
})
@UnsubscribeOnDestroy()
export class BudgetComponent implements OnInit, OnDestroy {

    budget: Budget;
    new = false;

    constructor(public toastService: ToastService,
        public formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public dialogService: NbDialogService) { }

    ngOnInit() {
        this.budget = this.activatedRoute.snapshot.data['budget'];
    }

    ngOnDestroy() { }

}
