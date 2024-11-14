/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { delay, of } from 'rxjs';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FixedAssetTransactionDescriptor, FixedAssetTransactionsQuery } from '@app/models';


@Injectable()
export class FixedAssetTransactionsDataService {


  constructor(private http: HttpService) { }


  getFixedAssetTransactionsTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/fixed-assets/transactions/types';

    return this.http.get<Identifiable[]>(path);
  }


  searchTransactions(query: FixedAssetTransactionsQuery): EmpObservable<FixedAssetTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    return new EmpObservable<FixedAssetTransactionDescriptor[]>(of([]).pipe(delay(1000)));
    // const path = 'v2/fixed-assets/transactions/search';

    // return this.http.post<FixedAssetTransactionDescriptor[]>(path, query);
  }

}
