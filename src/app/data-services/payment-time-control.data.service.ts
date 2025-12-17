/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { PaymentTimeWindow } from '@app/models';


@Injectable()
export class PaymentTimeControlDataService {


  constructor(private http: HttpService) { }


  getTimeWindow(): EmpObservable<PaymentTimeWindow> {
    const path = `v2/payments-management/time-control/time-window`;

    return this.http.get<PaymentTimeWindow>(path);
  }


  updateTimeWindow(dataFields: PaymentTimeWindow): EmpObservable<PaymentTimeWindow> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/time-control/time-window`;

    return this.http.post<PaymentTimeWindow>(path, dataFields);
  }

}
