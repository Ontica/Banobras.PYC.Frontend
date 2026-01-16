/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { PaymentInstructionsDataService } from '@app/data-services';

import { EmptyPaymentInstruction, EmptyPaymentInstructionActions, PaymentInstruction,
         PaymentInstructionActions, PaymentInstructionFields, PaymentInstructionHolder,
         PaymentInstructionRejectFields } from '@app/models';

import { PaymentInstructionHeaderEventType } from './payment-instruction-header.component';


export enum PaymentInstructionEditorEventType {
  UPDATED = 'PaymentInstructionEditorComponent.Event.Updated',
}

@Component({
  selector: 'emp-pmt-payment-instruction-editor',
  templateUrl: './payment-instruction-editor.component.html',
})
export class PaymentInstructionEditorComponent {

  @Input() instruction: PaymentInstruction = EmptyPaymentInstruction;

  @Input() actions: PaymentInstructionActions = EmptyPaymentInstructionActions;

  @Output() paymentInstructionEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private paymentInstructionsData: PaymentInstructionsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.instruction);
  }


  @SkipIf('submitted')
  onPaymentInstructionHeaderEvent(event: EventInfo) {
    switch (event.type as PaymentInstructionHeaderEventType) {
      case PaymentInstructionHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updatePaymentInstruction(this.instruction.uid, event.payload.dataFields as PaymentInstructionFields);
        return;
      case PaymentInstructionHeaderEventType.CANCEL:
        this.cancelPaymentInstruction(this.instruction.uid);
        return;
      case PaymentInstructionHeaderEventType.SUSPEND:
        this.suspendPaymentInstruction(this.instruction.uid);
        return;
      case PaymentInstructionHeaderEventType.RESET:
        this.resetPaymentInstruction(this.instruction.uid);
        return;
      case PaymentInstructionHeaderEventType.CLOSE_PAYMENT:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.closePaymentInstruction(this.instruction.uid,
          event.payload.dataFields as PaymentInstructionRejectFields);
        return;
      case PaymentInstructionHeaderEventType.REQUEST_PAYMENT:
        this.requestPayment(this.instruction.uid);
        return;
      case PaymentInstructionHeaderEventType.CANCEL_PAYMENT_REQUEST:
        this.cancelPaymentRequest(this.instruction.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updatePaymentInstruction(dataUID: string, datafields: PaymentInstructionFields) {
    this.submitted = true;

    this.paymentInstructionsData.updatePaymentInstruction(dataUID, datafields)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }



  private cancelPaymentInstruction(dataUID: string) {
    this.submitted = true;

    this.paymentInstructionsData.cancelPaymentInstruction(dataUID)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private suspendPaymentInstruction(dataUID: string) {
    this.submitted = true;

    this.paymentInstructionsData.suspendPaymentInstruction(dataUID)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resetPaymentInstruction(dataUID: string) {
    this.submitted = true;

    this.paymentInstructionsData.resetPaymentInstruction(dataUID)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private closePaymentInstruction(dataUID: string, dataFields: PaymentInstructionRejectFields) {
    this.submitted = true;

    this.paymentInstructionsData.closePaymentInstruction(dataUID, dataFields)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private requestPayment(dataUID: string) {
    this.submitted = true;

    this.paymentInstructionsData.requestPayment(dataUID)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private cancelPaymentRequest(dataUID: string) {
    this.submitted = true;

    this.paymentInstructionsData.cancelPaymentRequest(dataUID)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveDataUpdated(data: PaymentInstructionHolder) {
    sendEvent(this.paymentInstructionEditorEvent, PaymentInstructionEditorEventType.UPDATED, { data });
  }

}
