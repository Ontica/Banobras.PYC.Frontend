/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PayableDescriptor, PayablesQuery } from '@app/models';


@Injectable()
export class PayablesDataService {


  constructor(private http: HttpService) { }


  getPayableTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/payments-management/payables/payable-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchPayables(query: PayablesQuery): EmpObservable<PayableDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/payments-management/payables/search';

    return this.http.post<PayableDescriptor[]>(path, query);
  }

}
