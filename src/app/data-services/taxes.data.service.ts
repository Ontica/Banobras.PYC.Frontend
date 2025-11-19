/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { TaxEntry, TaxEntryFields } from '@app/models';


@Injectable()
export class TaxesDataService {


  constructor(private http: HttpService) { }


  addTaxEntry(orderUID: string,
              dataFields: TaxEntryFields): EmpObservable<TaxEntry> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders/${orderUID}/tax-entries`;

    return this.http.post<TaxEntry>(path, dataFields);
  }


  updateTaxEntry(orderUID: string,
                      taxEntryUID: string,
                      dataFields: TaxEntryFields): EmpObservable<TaxEntry> {
    Assertion.assertValue(orderUID, 'orderUID');
    Assertion.assertValue(taxEntryUID, 'taxEntryUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/order-management/orders/${orderUID}/tax-entries/${taxEntryUID}`;

    return this.http.put<TaxEntry>(path, dataFields);
  }


  removeTaxEntry(orderUID: string,
                 taxEntryUID: string,): EmpObservable<void> {
    Assertion.assertValue(orderUID, 'orderUID');

    const path = `v8/order-management/orders/${orderUID}/tax-entries/${taxEntryUID}`;

    return this.http.delete<void>(path);
  }

}
