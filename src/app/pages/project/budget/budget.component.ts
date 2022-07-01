import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UnsubscribeOnDestroy, untilComponentDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { Budget, Project } from '../../../@core/models';


@Component({
  selector: 'ngx-project-list',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
@UnsubscribeOnDestroy()
export class BudgetComponent implements OnInit, OnDestroy {

  budget: Budget;
  project: Project;

  constructor(public activatedRoute: ActivatedRoute,
    private location: Location,
    public router: Router) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.budget = this.activatedRoute.snapshot.data['budget'];
    this.project = this.budget[0].project;
  }

  return() {
    this.location.back();
  }

  ngOnDestroy() { }

}
