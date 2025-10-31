/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FinancialRulesQuery, FinancialRulesData, FinancialRule, FinancialRuleFields } from '@app/models';


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


  getRule(ruleUID: string): EmpObservable<FinancialRule> {
    Assertion.assertValue(ruleUID, 'ruleUID');

    const path = `v3/financial-rules/${ruleUID}`;

    return this.http.get<FinancialRule>(path);
  }


  createRule(dataFields: FinancialRuleFields): EmpObservable<FinancialRule> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v3/financial-rules`;

    return this.http.post<FinancialRule>(path, dataFields);
  }


  updateRule(ruleUID: string,
            dataFields: FinancialRuleFields): EmpObservable<FinancialRule> {
    Assertion.assertValue(ruleUID, 'ruleUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v3/financial-rules/${ruleUID}`;

    return this.http.put<FinancialRule>(path, dataFields);
  }


  deleteRule(ruleUID: string): EmpObservable<void> {
    Assertion.assertValue(ruleUID, 'ruleUID');

    const path = `v3/financial-rules/${ruleUID}`;

    return this.http.delete<void>(path);
  }

}
