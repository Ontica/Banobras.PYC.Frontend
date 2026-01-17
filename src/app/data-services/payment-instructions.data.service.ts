/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { PaymentAccount, PaymentInstructionHolder, PaymentInstructionDescriptor, PaymentInstructionFields,
         PaymentInstructionsQuery, PaymentInstructionRejectFields, ExplorerOperationType,
         ExplorerOperationCommand, ExplorerOperationResult } from '@app/models';


@Injectable()
export class PaymentInstructionsDataService {


  constructor(private http: HttpService) { }


  getPartyPaymentAccouts(partyUID: string): EmpObservable<PaymentAccount[]> {
    Assertion.assertValue(partyUID, 'partyUID');

    const path = `v8/financial/parties/${partyUID}/payment-accounts`;

    return this.http.get<PaymentAccount[]>(path);
  }


  searchPaymentInstructions(query: PaymentInstructionsQuery): EmpObservable<PaymentInstructionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/payments-management/payment-instructions/search';

    return this.http.post<PaymentInstructionDescriptor[]>(path, query);
  }


  bulkOperationPaymentInstructions(operationType: ExplorerOperationType,
                                   command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/payments-management/payment-instructions/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }


  getPaymentInstruction(paymentInstructionUID: string): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}`;

    return this.http.get<PaymentInstructionHolder>(path);
  }


  updatePaymentInstruction(paymentInstructionUID: string,
                           dataFields: PaymentInstructionFields): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}`;

    return this.http.put<PaymentInstructionHolder>(path, dataFields);
  }


  cancelPaymentInstruction(paymentInstructionUID: string): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}/cancel`;

    return this.http.delete<PaymentInstructionHolder>(path);
  }


  suspendPaymentInstruction(paymentInstructionUID: string): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}/suspend`;

    return this.http.post<PaymentInstructionHolder>(path);
  }


  resetPaymentInstruction(paymentInstructionUID: string): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}/reset`;

    return this.http.post<PaymentInstructionHolder>(path);
  }


  closePaymentInstruction(paymentInstructionUID: string,
                          dataFields: PaymentInstructionRejectFields): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}/close-payment`;

    return this.http.post<PaymentInstructionHolder>(path, dataFields);
  }


  requestPayment(paymentInstructionUID: string): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}/request-payment`;

    return this.http.post<PaymentInstructionHolder>(path);
  }


  cancelPaymentRequest(paymentInstructionUID: string): EmpObservable<PaymentInstructionHolder> {
    Assertion.assertValue(paymentInstructionUID, 'paymentInstructionUID');

    const path = `v2/payments-management/payment-instructions/${paymentInstructionUID}/cancel-payment-request`;

    return this.http.post<PaymentInstructionHolder>(path);
  }

}
