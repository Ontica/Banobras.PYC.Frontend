/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, AssetTransactionDescriptor, AssetTransactionEntry, AssetTransactionEntryFields,
         AssetTransactionFields, AssetTransactionHolder, AssetTransactionsQuery } from '@app/models';


@Injectable()
export class AssetsTransactionsDataService {


  constructor(private http: HttpService) { }


  getAssetTransactionsTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/assets/transactions/types';

    return this.http.get<Identifiable[]>(path);
  }


  searchAssetTransactions(query: AssetTransactionsQuery): EmpObservable<AssetTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/transactions/search';

    return this.http.post<AssetTransactionDescriptor[]>(path, query);
  }


  exportAssetTransactions(query: AssetTransactionsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/assets/transactions/export';

    return this.http.post<FileReport>(path, query);
  }


  getAssetTransaction(transactionUID: string): EmpObservable<AssetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}`;

    return this.http.get<AssetTransactionHolder>(path);
  }


  getAssetTransactionForPrint(transactionUID: string): EmpObservable<FileReport> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}/print`;

    return this.http.get<FileReport>(path);
  }


  createAssetTransaction(dataFields: AssetTransactionFields): EmpObservable<AssetTransactionHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions`;

    return this.http.post<AssetTransactionHolder>(path, dataFields);
  }


  updateAssetTransaction(transactionUID: string,
                         dataFields: AssetTransactionFields): EmpObservable<AssetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions/${transactionUID}`;

    return this.http.put<AssetTransactionHolder>(path, dataFields);
  }


  deleteAssetTransaction(transactionUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}`;

    return this.http.delete<void>(path);
  }


  closeAssetTransaction(transactionUID: string): EmpObservable<AssetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/assets/transactions/${transactionUID}/close`;

    return this.http.post<AssetTransactionHolder>(path);
  }


  cloneAssetTransaction(transactionUID: string,
                        transactionTypeUID: string): EmpObservable<AssetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(transactionTypeUID, 'transactionTypeUID');

    const path = `v2/assets/transactions/${transactionUID}/clone-for/${transactionTypeUID}`;

    return this.http.post<AssetTransactionHolder>(path);
  }


  createAssetTransactionEntry(transactionUID: string,
                              dataFields: AssetTransactionEntryFields): EmpObservable<AssetTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions/${transactionUID}/entries`;

    return this.http.post<AssetTransactionEntry>(path, dataFields);
  }


  updateAssetTransactionEntry(transactionUID: string,
                              entryUID: string,
                              dataFields: AssetTransactionEntryFields): EmpObservable<AssetTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/assets/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.put<AssetTransactionEntry>(path, dataFields);
  }


  deleteAssetTransactionEntry(transactionUID: string,
                              entryUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');

    const path = `v2/assets/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.delete<void>(path);
  }

}
