/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { BillHolder, BillDescriptor, BillsQuery } from '@app/models';


@Injectable()
export class BillsDataService {


  constructor(private http: HttpService) { }


  getBillTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/billing-management/bills/bill-types';

    return this.http.get<Identifiable[]>(path);
  }


  getBillCategories(): EmpObservable<Identifiable[]> {
    const path = 'v2/billing-management/bills/bill-categories';

    return this.http.get<Identifiable[]>(path);
  }


  searchBills(query: BillsQuery): EmpObservable<BillDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/billing-management/bills/search';

    return this.http.post<BillDescriptor[]>(path, query);
  }


  getBill(billUID: string): EmpObservable<BillHolder> {
    Assertion.assertValue(billUID, 'billUID');

    const path = `v2/billing-management/bills/${billUID}`;

    return this.http.get<BillHolder>(path);
  }

}
