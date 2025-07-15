/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, AssetsTransactionDescriptor, AssetsTransactionEntry, AssetsTransactionEntryFields,
         AssetsTransactionFields, AssetsTransactionHolder, AssetsTransactionsQuery } from '@app/models';


@Injectable()
export class AssetsTransactionsDataService {


  constructor(private http: HttpService) { }


  getAssetsTransactionsTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/assets/transactions/types';

    return this.http.get<Identifiable[]>(path);
  }


  searchAssetsTransactions(query: AssetsTransactionsQuery): EmpObservable<AssetsTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/transactions/search';

    return this.http.post<AssetsTransactionDescriptor[]>(path, query);
  }


  exportAssetsTransactions(query: AssetsTransactionsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/transactions/export';

    return this.http.post<FileReport>(path, query);
  }


  getAssetsTransaction(transactionUID: string): EmpObservable<AssetsTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}`;

    return this.http.get<AssetsTransactionHolder>(path);
  }


  getAssetsTransactionForPrint(transactionUID: string): EmpObservable<FileReport> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}/print`;

    return this.http.get<FileReport>(path);
  }


  createAssetsTransaction(dataFields: AssetsTransactionFields): EmpObservable<AssetsTransactionHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions`;

    return this.http.post<AssetsTransactionHolder>(path, dataFields);
  }


  updateAssetsTransaction(transactionUID: string,
                          dataFields: AssetsTransactionFields): EmpObservable<AssetsTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions/${transactionUID}`;

    return this.http.put<AssetsTransactionHolder>(path, dataFields);
  }


  deleteAssetsTransaction(transactionUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}`;

    return this.http.delete<void>(path);
  }


  closeAssetsTransaction(transactionUID: string): EmpObservable<AssetsTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}/close`;

    return this.http.post<AssetsTransactionHolder>(path);
  }


  cloneAssetsTransaction(transactionUID: string,
                         transactionTypeUID: string): EmpObservable<AssetsTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(transactionTypeUID, 'transactionTypeUID');

    const path = `v2/assets/transactions/${transactionUID}/clone-for/${transactionTypeUID}`;

    return this.http.post<AssetsTransactionHolder>(path);
  }


  createAssetsTransactionEntry(transactionUID: string,
                               dataFields: AssetsTransactionEntryFields): EmpObservable<AssetsTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions/${transactionUID}/entries`;

    return this.http.post<AssetsTransactionEntry>(path, dataFields);
  }


  updateAssetsTransactionEntry(transactionUID: string,
                               entryUID: string,
                               dataFields: AssetsTransactionEntryFields): EmpObservable<AssetsTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.put<AssetsTransactionEntry>(path, dataFields);
  }


  deleteAssetsTransactionEntry(transactionUID: string,
                               entryUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');

    const path = `v2/assets/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.delete<void>(path);
  }

}
