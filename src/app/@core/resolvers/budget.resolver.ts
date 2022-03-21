import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Budget } from '../models';
import { BudgetsService } from '../services/budgets.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetResolver implements Resolve<Budget> {

  constructor(private budgetsService: BudgetsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Budget> {
    if (route.params['id'] !== 'new') {
      return this.budgetsService.getBudget(route.params['id']);
    } else {
      return of(null);
    }
  }
}
