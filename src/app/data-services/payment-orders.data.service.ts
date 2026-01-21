/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { PaymentOrderHolder, PaymentOrderDescriptor, PaymentOrderFields, PaymentOrdersQuery,
         ExplorerOperationType, ExplorerOperationCommand, ExplorerOperationResult,
         FileReport } from '@app/models';

@Injectable()
export class PaymentOrdersDataService {


  constructor(private http: HttpService) { }


  getPaymentTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/payments-management/payment-types';

    return this.http.get<Identifiable[]>(path);
  }


  getPaymentOrderTypes(): EmpObservable<Identifiable[]> {
    const path = 'v2/payments-management/payment-order-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchPaymentOrders(query: PaymentOrdersQuery): EmpObservable<PaymentOrderDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/payments-management/payment-orders/search';

    return this.http.post<PaymentOrderDescriptor[]>(path, query);
  }


  bulkOperationPaymentOrders(operationType: ExplorerOperationType,
                             command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/payments-management/payment-orders/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }


  getPaymentOrder(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}`;

    return this.http.get<PaymentOrderHolder>(path);
  }


  getPaymentOrderForPrint(paymentOrderUID: string): EmpObservable<FileReport> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}/print`;

    return this.http.get<FileReport>(path);
  }


  createPaymentOrder(dataFields: PaymentOrderFields): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payment-orders`;

    return this.http.post<PaymentOrderHolder>(path, dataFields);
  }


  updatePaymentOrder(paymentOrderUID: string,
                     dataFields: PaymentOrderFields): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}`;

    return this.http.put<PaymentOrderHolder>(path, dataFields);
  }


  suspendPaymentOrder(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}/suspend`;

    return this.http.post<PaymentOrderHolder>(path);
  }


  resetPaymentOrder(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}/reset`;

    return this.http.post<PaymentOrderHolder>(path);
  }


  cancelPaymentOrder(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}/cancel`;

    return this.http.delete<PaymentOrderHolder>(path);
  }


  generatePaymentInstruction(paymentOrderUID: string): EmpObservable<PaymentOrderHolder> {
    Assertion.assertValue(paymentOrderUID, 'paymentOrderUID');

    const path = `v2/payments-management/payment-orders/${paymentOrderUID}/payment-instruction`;

    return this.http.post<PaymentOrderHolder>(path);
  }

}
