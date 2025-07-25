/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PaymentMethod, RequestsList } from '@app/models';


@Injectable()
export class CataloguesDataService {


  constructor(private http: HttpService) { }


  getOrganizationalUnits(requestsList: RequestsList): EmpObservable<Identifiable[]> {
    Assertion.assertValue(requestsList, 'requestsList');

    const path = `v4/requests/catalogues/organizational-units/?requestsList=${requestsList}`;

    return this.http.get<Identifiable[]>(path);
  }


  getPaymentMethods(): EmpObservable<PaymentMethod[]> {
    const path = 'v8/financial/payment-methods';

    return this.http.get<PaymentMethod[]>(path);
  }


  getCurrencies(): EmpObservable<Identifiable[]> {
    const path = `v8/financial/currencies`;

    return this.http.get<Identifiable[]>(path);
  }


  getInterestRateTypes(): EmpObservable<Identifiable[]> {
    const path = 'v8/financial/interest-rate-types';

    return this.http.get<Identifiable[]>(path);
  }


  getPeriodicityTypes(): EmpObservable<Identifiable[]> {
    const path = 'v8/time/periodicity-types';

    return this.http.get<Identifiable[]>(path);
  }

}
