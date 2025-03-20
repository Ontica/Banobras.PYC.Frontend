/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, AssetTransactionHolder, AssetTransactionDescriptor,
         AssetTransactionsQuery } from '@app/models';


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

}
