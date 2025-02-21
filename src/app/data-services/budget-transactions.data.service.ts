/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { BudgetTransactionHolder, BudgetTransactionDescriptor, BudgetTransactionFields,
         BudgetTransactionsQuery, BudgetTypeForEdition } from '@app/models';


@Injectable()
export class BudgetTransactionsDataService {


  constructor(private http: HttpService) { }


  getBudgetTypesForTransactionEdition(): EmpObservable<BudgetTypeForEdition[]> {
    const path = `v2/budgeting/budget-types/for-transaction-edition`;

    return this.http.get<BudgetTypeForEdition[]>(path);
  }


  getOrganizationalUnitsForTransactionEdition(budgetUID: string,
                                              transactionTypeUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(budgetUID, 'budgetUID');
    Assertion.assertValue(transactionTypeUID, 'transactionTypeUID');

    const path = `v2/budgeting/organizational-units/for-transaction-edition` +
      `?budgetUID=${budgetUID}&transactionTypeUID=${transactionTypeUID}`;

    return this.http.get<Identifiable[]>(path);
  }


  getOperationSources(): EmpObservable<Identifiable[]> {
    const path = 'v2/budgeting/transactions/operation-sources';

    return this.http.get<Identifiable[]>(path);
  }


  searchTransactions(query: BudgetTransactionsQuery): EmpObservable<BudgetTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/budgeting/transactions/search';

    return this.http.post<BudgetTransactionDescriptor[]>(path, query);
  }


  getTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.get<BudgetTransactionHolder>(path);
  }


  createTransaction(dataFields: BudgetTransactionFields): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions`;

    return this.http.post<BudgetTransactionHolder>(path, dataFields);
  }


  updateTransaction(transactionUID: string, dataFields: BudgetTransactionFields): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.put<BudgetTransactionHolder>(path, dataFields);
  }


  authorizeTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}/authorize`;

    return this.http.post<BudgetTransactionHolder>(path);
  }


  rejectTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}/reject`;

    return this.http.post<BudgetTransactionHolder>(path);
  }


  deleteTransaction(transactionUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.delete<void>(path);
  }

}
