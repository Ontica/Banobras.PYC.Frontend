/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PaymentOrderHolder, PaymentOrderDescriptor, PaymentOrderFields,
         PaymentsOrdersQuery } from '@app/models';


@Injectable()
export class PaymentOrdersDataService {


  constructor(private http: HttpService) { }


  getPaymentOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/payments-management/payment-order-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchPaymentsOrders(query: PaymentsOrdersQuery): EmpObservable<PaymentOrderDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/payments-management/payment-orders/search';

    return this.http.post<PaymentOrderDescriptor[]>(path, query);
  }


  getPaymentOrder(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}`;

    return this.http.get<PaymentOrderHolder>(path);
  }


  createPaymentOrder(dataFields: PaymentOrderFields): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payment-orders/`;

    return this.http.post<PaymentOrderHolder>(path, dataFields);
  }


  updatePaymentOrder(paymentOrderUID: string, dataFields: PaymentOrderFields): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}`;

    return this.http.put<PaymentOrderHolder>(path, dataFields);
  }


  deletePaymentOrder(paymentOrderUID: string): EmpObservable<void> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}`;

    return this.http.delete<void>(path);
  }


  sentToPay(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}/pay`;

    return this.http.post<PaymentOrderHolder>(path);
  }

}
