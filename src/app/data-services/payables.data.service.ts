/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PayableData, PayableDescriptor, PayableFields, PayablesQuery } from '@app/models';

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


  getPayableData(payableUID: string): EmpObservable<PayableData> {
    Assertion.assertValue(payableUID, 'payableUID');

    const path = `v2/payments-management/payables/${payableUID}`;

    return this.http.get<PayableData>(path);
  }


  createPayable(dataFields: PayableFields): EmpObservable<PayableData> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payables`;

    return this.http.post<PayableData>(path, dataFields);
  }


  updatePayable(payableUID: string,
                dataFields: PayableFields): EmpObservable<PayableData> {
    Assertion.assertValue(payableUID, 'payableUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payables/${payableUID}`;

    return this.http.put<PayableData>(path, dataFields);
  }


  deletePayable(payableUID: string): EmpObservable<void> {
    Assertion.assertValue(payableUID, 'payableUID');

    const path = `v2/payments-management/payables/${payableUID}`;

    return this.http.delete<void>(path);
  }

}
