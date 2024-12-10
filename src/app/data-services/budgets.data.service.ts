/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { BudgetAccountsForProductQuery, BudgetData, BudgetQuery, BudgetSegmentItem,
         BudgetType } from '@app/models';

@Injectable()
export class BudgetsDataService {


  constructor(private http: HttpService) { }


  getBudgetTypes(): EmpObservable<BudgetType[]> {
    const path = `v2/budgeting/budget-types`;

    return this.http.get<BudgetType[]>(path);
  }


  searchBudgetAccountsForProduct(productUID: string,
                                 query: BudgetAccountsForProductQuery): EmpObservable<Identifiable[]> {
    Assertion.assertValue(productUID, 'productUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/budgeting/products/${productUID}/budget-accounts`;

    return this.http.post<Identifiable[]>(path, query);
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

}
