import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, Page, Professional, Project } from '../../../@core/models';
import { Observable } from 'rxjs';
import { ProfessionalBudget } from '../../../@core/models/professional-budget.model';

@Component({
  selector: 'ngx-project-list',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
@UnsubscribeOnDestroy()
export class BudgetComponent implements OnInit, OnDestroy {

  form: FormGroup;
  budget: Budget;
  project: Project;
  professional$: Observable<Professional[]>;
  professionalBudgetPage: Page<ProfessionalBudget>;


  constructor(public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.budget = this.activatedRoute.snapshot.data['budget'];
    this.project = this.budget[0].project;
  }

  ngOnDestroy() { }

}
