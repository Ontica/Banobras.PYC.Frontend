/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { BudgetData, BudgetQuery, BudgetRequestFields, BudgetSegmentItem, BudgetTransactionDescriptor,
         BudgetType, BudgetValidationResult } from '@app/models';

@Injectable()
export class BudgetsDataService {


  constructor(private http: HttpService) { }


  getBudgetTypes(): EmpObservable<BudgetType[]> {
    const path = `v2/budgeting/budget-types`;

    return this.http.get<BudgetType[]>(path);
  }


  getSegmentItemsByType(segmentType: string): EmpObservable<BudgetSegmentItem[]> {
    const path = `v2/budgeting/budget-segment-items/by-type/${segmentType}`;

    return this.http.get<BudgetSegmentItem[]>(path);
  }


  searchBudgetData(query: BudgetQuery): EmpObservable<BudgetData> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(query.queryType, 'query.queryType');

    const path = `v2/budgeting/budget-explorer/${query.queryType}`;

    return this.http.post<BudgetData>(path, query);
  }


  approvePayment(dataFields: BudgetRequestFields): EmpObservable<BudgetTransactionDescriptor> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/procurement/approve-payment`;

    return this.http.post<BudgetTransactionDescriptor>(path, dataFields);
  }


  commitBudget(dataFields: BudgetRequestFields): EmpObservable<BudgetTransactionDescriptor> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/procurement/commit`;

    return this.http.post<BudgetTransactionDescriptor>(path, dataFields);
  }


  exerciseBudget(dataFields: BudgetRequestFields): EmpObservable<BudgetTransactionDescriptor> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/procurement/exercise`;

    return this.http.post<BudgetTransactionDescriptor>(path, dataFields);
  }


  requestBudget(dataFields: BudgetRequestFields): EmpObservable<BudgetTransactionDescriptor> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/procurement/request`;

    return this.http.post<BudgetTransactionDescriptor>(path, dataFields);
  }


  validateAvaibleBudget(dataFields: BudgetRequestFields): EmpObservable<BudgetValidationResult> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/procurement/validate-budget`;

    return this.http.post<BudgetValidationResult>(path, dataFields);
  }

}
