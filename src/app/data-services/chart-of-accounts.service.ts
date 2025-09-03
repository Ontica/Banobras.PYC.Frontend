/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { ChartOfAccounts, ChartOfAccountsQuery, FinancialAccountOperationFields,
         FinancialAccountOperationsHolder, StandardAccountHolder } from '@app/models';


@Injectable()
export class ChartOfAccountsDataService {


  constructor(private http: HttpService) { }


  getChartsOfAccounts(): EmpObservable<Identifiable[]> {
    const path = `v3/charts-of-accounts`;

    return this.http.get<Identifiable[]>(path);
  }


  getStandardAccounts(): EmpObservable<Identifiable[]> {
    const path = `v3/standard-accounts`;

    return this.http.get<Identifiable[]>(path);
  }


  searchChartOfAccounts(query: ChartOfAccountsQuery): EmpObservable<ChartOfAccounts> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(query.chartOfAccountsUID, 'query.chartOfAccountsUID');

    const path = `v3/charts-of-accounts/${query.chartOfAccountsUID}`;

    return this.http.post<ChartOfAccounts>(path, query);
  }


  getStandardAccount(chartOfAccountsUID: string,
                     stdAccountUID: string): EmpObservable<StandardAccountHolder> {
    Assertion.assertValue(chartOfAccountsUID, 'chartOfAccountsUID');
    Assertion.assertValue(stdAccountUID, 'stdAccountUID');

    const path = `v3/charts-of-accounts/${chartOfAccountsUID}/standard-accounts/${stdAccountUID}`;

    return this.http.get<StandardAccountHolder>(path);
  }


  getAccountOperations(accountUID: string): EmpObservable<FinancialAccountOperationsHolder> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}/operations`;

    return this.http.get<FinancialAccountOperationsHolder>(path);
  }


  addAccountOperation(accountUID: string,
                      dataFields: FinancialAccountOperationFields): EmpObservable<FinancialAccountOperationsHolder> {
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/financial-accounts/${accountUID}/operations`;

    return this.http.post<FinancialAccountOperationsHolder>(path, dataFields);
  }


  removeAccountOperation(accountUID: string,
                         operationUID: string): EmpObservable<FinancialAccountOperationsHolder> {
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(operationUID, 'operationUID');

    const path = `v2/financial-accounts/${accountUID}/operations/${operationUID}`;

    return this.http.delete<FinancialAccountOperationsHolder>(path);
  }

}
