/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FinancialRulesQuery, FinancialRulesData } from '@app/models';


@Injectable()
export class FinancialRulesDataService {


  constructor(private http: HttpService) { }


  getCategories(): EmpObservable<Identifiable[]> {
    const path = 'v3/financial-rules/categories';

    return this.http.get<Identifiable[]>(path);
  }


  searchRules(categoryUID: string, query: FinancialRulesQuery): EmpObservable<FinancialRulesData> {
    Assertion.assertValue(categoryUID, 'categoryUID');
    Assertion.assertValue(query, 'query');

    const path = `v3/financial-rules/categories/${categoryUID}`;

    return this.http.post<FinancialRulesData>(path, query);
  }

}
