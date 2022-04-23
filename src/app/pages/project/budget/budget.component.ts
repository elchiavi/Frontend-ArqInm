import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnsubscribeOnDestroy } from '../../../@core/decorators/unsubscribe/on-destroy';
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
    public router: Router) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.budget = this.activatedRoute.snapshot.data['budget'];
    this.project = this.budget[0].project;
  }

  changeCost(event) {
    if (event.update) {
      this.budget[0].totalCost = this.budget[0].totalCost - event.preCost;
      this.budget[0].totalCost = this.budget[0].totalCost + event.cost;
    } else {
      this.budget[0].totalCost = this.budget[0].totalCost + event.cost;
    }
  }

  ngOnDestroy() { }

}
