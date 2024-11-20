/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FixedAssetTransactionData, FixedAssetTransactionDescriptor,
         FixedAssetTransactionsQuery } from '@app/models';


@Injectable()
export class FixedAssetTransactionsDataService {


  constructor(private http: HttpService) { }


  getFixedAssetTransactionsTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/fixed-assets/transactions/types';

    return this.http.get<Identifiable[]>(path);
  }


  searchTransactions(query: FixedAssetTransactionsQuery): EmpObservable<FixedAssetTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/fixed-assets/transactions/search';

    return this.http.post<FixedAssetTransactionDescriptor[]>(path, query);
  }


  getTransactionData(transactionUID: string): EmpObservable<FixedAssetTransactionData> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/fixed-assets/transactions/${transactionUID}`;

    return this.http.get<FixedAssetTransactionData>(path);
  }

}
