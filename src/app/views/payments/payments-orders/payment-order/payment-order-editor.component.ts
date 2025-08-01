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

import { PaymentOrdersDataService } from '@app/data-services';

import { EmptyPaymentOrder, EmptyPaymentOrderActions, PaymentOrder, PaymentOrderActions, PaymentOrderFields,
         PaymentOrderHolder } from '@app/models';

import { PaymentOrderHeaderEventType } from './payment-order-header.component';


export enum PaymentOrderEditorEventType {
  UPDATED = 'PaymentOrderEditorComponent.Event.PaymentOrderUpdated',
  DELETED = 'PaymentOrderEditorComponent.Event.PaymentOrderDeleted',
}

@Component({
  selector: 'emp-pmt-payment-order-editor',
  templateUrl: './payment-order-editor.component.html',
})
export class PaymentOrderEditorComponent {

  @Input() paymentOrder: PaymentOrder = EmptyPaymentOrder;

  @Input() actions: PaymentOrderActions = EmptyPaymentOrderActions;

  @Output() paymentOrderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private paymentOrdersData: PaymentOrdersDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.paymentOrder);
  }


  @SkipIf('submitted')
  onPaymentOrderHeaderEvent(event: EventInfo) {
    switch (event.type as PaymentOrderHeaderEventType) {
      case PaymentOrderHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updatePaymentOrder(this.paymentOrder.uid, event.payload.dataFields as PaymentOrderFields);
        return;
      case PaymentOrderHeaderEventType.DELETE:
        this.deletePaymentOrder(this.paymentOrder.uid);
        return;
      case PaymentOrderHeaderEventType.SEND_TO_PAY:
        this.sentToPay(this.paymentOrder.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updatePaymentOrder(paymentOrderUID: string, datafields: PaymentOrderFields) {
    this.submitted = true;

    this.paymentOrdersData.updatePaymentOrder(paymentOrderUID, datafields)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }



  private deletePaymentOrder(paymentOrderUID: string) {
    this.submitted = true;

    this.paymentOrdersData.deletePaymentOrder(paymentOrderUID)
      .firstValue()
      .then(() => this.resolveDataDeleted(paymentOrderUID))
      .finally(() => this.submitted = false);
  }


  private sentToPay(paymentOrderUID: string) {
    this.submitted = true;

    this.paymentOrdersData.sentToPay(paymentOrderUID)
      .firstValue()
      .then(x => this.resolveDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveDataUpdated(data: PaymentOrderHolder) {
    sendEvent(this.paymentOrderEditorEvent, PaymentOrderEditorEventType.UPDATED, { data });
  }


  private resolveDataDeleted(paymentOrderUID: string) {
    sendEvent(this.paymentOrderEditorEvent, PaymentOrderEditorEventType.DELETED, { paymentOrderUID });
  }

}
