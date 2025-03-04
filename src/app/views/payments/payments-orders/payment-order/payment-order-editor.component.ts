/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PaymentOrdersDataService } from '@app/data-services';

import { EmptyPaymentOrder, EmptyPaymentOrderActions, PaymentOrder, PaymentOrderActions,
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


  onPaymentOrderHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as PaymentOrderHeaderEventType) {
      case PaymentOrderHeaderEventType.SEND_TO_PAY:
        this.sentToPay(this.paymentOrder.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private sentToPay(paymentOrderUID: string) {
    this.submitted = true;

    this.paymentOrdersData.sentToPay(paymentOrderUID)
      .firstValue()
      .then(x => this.resolvePaymentDataUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolvePaymentDataUpdated(data: PaymentOrderHolder) {
    sendEvent(this.paymentOrderEditorEvent, PaymentOrderEditorEventType.UPDATED, { data });
  }

}
