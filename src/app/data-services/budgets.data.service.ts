/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { BudgetAvailableMonth, BudgetData, BudgetEntryBreakdown, BudgetEntryDescriptor, BudgetEntryQuery,
         BudgetQuery, BudgetRequestFields, BudgetSegmentItem, BudgetTransactionDescriptor, BudgetType,
         BudgetValidationResult, FileReport, calculateDataColumnsSize } from '@app/models';


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

    const path = `v2/budgeting/budget-explorer/search`;

    return new EmpObservable<BudgetData>(
      this.http.post<BudgetData>(path, query)
        .pipe(map(x => calculateDataColumnsSize(x) as BudgetData))
    );
  }


  getBudgetEntryBreakdown(query: BudgetQuery,
                          subQuery: BudgetEntryQuery,
                          entry: BudgetEntryDescriptor): EmpObservable<BudgetEntryBreakdown> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(subQuery, 'subQuery');
    Assertion.assertValue(entry, 'entry');
    Assertion.assertValue(entry.uid, 'entry.uid');

    const path = `v2/budgeting/budget-explorer/breakdown`;

    return this.http.post<BudgetEntryBreakdown>(path, { query, subQuery, entryUID: entry.uid, entry });
  }


  getAvailableBudget(accountUID: string,
                     year: number): EmpObservable<BudgetAvailableMonth[]> {
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(year, 'year');

    const path = `v2/budgeting/budget-explorer/accounts/${accountUID}/years/${year}/available-budget`;

    return this.http.get<BudgetAvailableMonth[]>(path);
  }


  exportBudgetData(query: BudgetQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/budgeting/budget-explorer/export`;

    return this.http.post<FileReport>(path, query);
  }


  exportBudgetEntryBreakdown(query: BudgetQuery,
                             subQuery: BudgetEntryQuery,
                             entry: BudgetEntryDescriptor): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(subQuery, 'subQuery');
    Assertion.assertValue(entry, 'entry');
    Assertion.assertValue(entry.uid, 'entry.uid');

    const path = `v2/budgeting/budget-explorer/breakdown/export`;

    return this.http.post<FileReport>(path, { query, subQuery, entryUID: entry.uid, entry });
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
