/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { BudgetPeriod, BudgetPeriodResult } from '@app/models';


@Injectable()
export class BudgetPeriodControlDataService {


  constructor(private http: HttpService) { }


  getBudgetPeriods(budgetUID: string): EmpObservable<BudgetPeriod[]> {
    Assertion.assertValue(budgetUID, 'budgetUID');

    const path = `v2/budgeting/budget-control/${budgetUID}/months`;

    return this.http.get<BudgetPeriod[]>(path);
  }


  closeBudgetMonth(budgetUID: string, month: number): EmpObservable<BudgetPeriodResult> {
    Assertion.assertValue(budgetUID, 'budgetUID');
    Assertion.assertValue(month, 'month');

    const path = `v2/budgeting/budget-control/${budgetUID}/months/${month}/close`;

    return this.http.post<BudgetPeriodResult>(path);
  }


  openBudgetMonth(budgetUID: string, month: number): EmpObservable<BudgetPeriodResult> {
    Assertion.assertValue(budgetUID, 'budgetUID');
    Assertion.assertValue(month, 'month');

    const path = `v2/budgeting/budget-control/${budgetUID}/months/${month}/open`;

    return this.http.post<BudgetPeriodResult>(path);
  }


  generateBalanceTransferTransactions(budgetUID: string, month: number): EmpObservable<BudgetPeriodResult> {
    Assertion.assertValue(budgetUID, 'budgetUID');
    Assertion.assertValue(month, 'month');

    const path = `v2/budgeting/budget-control/${budgetUID}/months/${month}/generate-balance-transfer`;

    return this.http.post<BudgetPeriodResult>(path);
  }

}
