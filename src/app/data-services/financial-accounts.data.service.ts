/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, FinancialAccountDescriptor, FinancialAccountHolder,
         FinancialAccountsQuery } from '@app/models';


@Injectable()
export class FinancialAccountsDataService {


  constructor(private http: HttpService) { }


  getAccountsTypes(): EmpObservable<Identifiable[]> {

    const path = `v1/financial-projects/financial-accounts-types`;

    return this.http.get<Identifiable[]>(path);
  }


  searchAccounts(query: FinancialAccountsQuery): EmpObservable<FinancialAccountDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounts/search`;

    return this.http.post<FinancialAccountDescriptor[]>(path, query);
  }


  exportAccounts(query: FinancialAccountsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounts/export`;

    return this.http.post<FileReport>(path, query);
  }


  getAccount(accountUID: string): EmpObservable<FinancialAccountHolder> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}`;

    return this.http.get<FinancialAccountHolder>(path);
  }

}
