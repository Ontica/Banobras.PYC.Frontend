/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, FlexibleIdentifiable, HttpService, Identifiable } from '@app/core';

import { MatchSubledgerAccountFields, SupplierFields, SupplierHolder } from '@app/models';


@Injectable()
export class SuppliersDataService {


  constructor(private http: HttpService) { }


  getMatchSubledgerAccount(dataFields: MatchSubledgerAccountFields): EmpObservable<FlexibleIdentifiable> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/suppliers/match-subledger-account`;

    return this.http.post<FlexibleIdentifiable>(path, dataFields);
  }


  createSupplier(dataFields: SupplierFields): EmpObservable<SupplierHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/suppliers`;

    return this.http.post<SupplierHolder>(path, dataFields);
  }


  updateSupplier(supplierUID: string,
                 dataFields: SupplierFields): EmpObservable<SupplierHolder> {
    Assertion.assertValue(supplierUID, 'supplierUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v8/procurement/suppliers/${supplierUID}`;

    return this.http.put<SupplierHolder>(path, dataFields);
  }


  deleteSupplier(supplierUID: string): EmpObservable<void> {
    Assertion.assertValue(supplierUID, 'supplierUID');

    const path = `v8/procurement/suppliers/${supplierUID}`;

    return this.http.delete<void>(path);
  }

}
