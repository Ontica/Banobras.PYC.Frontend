/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PaymentOrderDescriptor, PaymentsOrdersQuery } from '@app/models';


@Injectable()
export class PaymentOrdersDataService {


  constructor(private http: HttpService) { }


  getPaymentOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/payments-management/payment-order-types';

    return this.http.get<Identifiable[]>(path);
  }


  getPaymentMethods(): EmpObservable<Identifiable[]> {
    const path = 'v2/payments-management/payment-methods';

    return this.http.get<Identifiable[]>(path);
  }


  searchPaymentsOrders(query: PaymentsOrdersQuery): EmpObservable<PaymentOrderDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/payments-management/payment-orders/search';

    return this.http.post<PaymentOrderDescriptor[]>(path, query);
  }

}
