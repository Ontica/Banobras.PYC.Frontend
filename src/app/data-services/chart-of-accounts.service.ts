/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { ChartOfAccounts, ChartOfAccountsQuery, StandardAccountHolder } from '@app/models';


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


  getAccountsTypes(): EmpObservable<Identifiable[]> {
    const path = `v1/financial-projects/financial-accounts-types`;

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


  suspendStandardAccount(chartOfAccountsUID: string,
                         stdAccountUID: string): EmpObservable<StandardAccountHolder> {
    Assertion.assertValue(chartOfAccountsUID, 'chartOfAccountsUID');
    Assertion.assertValue(stdAccountUID, 'stdAccountUID');

    const path = `v3/charts-of-accounts/${chartOfAccountsUID}/standard-accounts/${stdAccountUID}/suspend`;

    return this.http.post<StandardAccountHolder>(path);
  }


  activateStandardAccount(chartOfAccountsUID: string,
                          stdAccountUID: string): EmpObservable<StandardAccountHolder> {
    Assertion.assertValue(chartOfAccountsUID, 'chartOfAccountsUID');
    Assertion.assertValue(stdAccountUID, 'stdAccountUID');

    const path = `v3/charts-of-accounts/${chartOfAccountsUID}/standard-accounts/${stdAccountUID}/activate`;

    return this.http.post<StandardAccountHolder>(path);
  }

}
