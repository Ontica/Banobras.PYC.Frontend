/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { BudgetTransactionData, BudgetTransactionDescriptor, BudgetTransactionsQuery } from '@app/models';


@Injectable()
export class BudgetTransactionsDataService {


  constructor(private http: HttpService) { }


  getOperationSources(): EmpObservable<Identifiable[]> {
    const path = 'v2/budgeting/transactions/operation-sources';

    return this.http.get<Identifiable[]>(path);
  }


  searchTransactions(query: BudgetTransactionsQuery): EmpObservable<BudgetTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/budgeting/transactions/search';

    return this.http.post<BudgetTransactionDescriptor[]>(path, query);
  }


  getTransactionData(transactionUID: string): EmpObservable<BudgetTransactionData> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.get<BudgetTransactionData>(path);
  }

}
