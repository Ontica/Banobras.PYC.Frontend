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

import { EmptyPaymentOrder, EmptyPaymentOrderActions, EmptyPayableEntity, PaymentOrder, PaymentOrderActions,
         PaymentOrderHolder, PayableEntity, PaymentOrderFields } from '@app/models';

import { PaymentOrderHeaderEventType } from './payment-order-header.component';


export enum PaymentOrderEditorEventType {
  UPDATED = 'PaymentOrderEditorComponent.Event.Updated',
}

@Component({
  selector: 'emp-pmt-payment-order-editor',
  templateUrl: './payment-order-editor.component.html',
})
export class PaymentOrderEditorComponent {

  @Input() paymentOrder: PaymentOrder = EmptyPaymentOrder;

  @Input() payableEntity: PayableEntity = EmptyPayableEntity;

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
      case PaymentOrderHeaderEventType.CANCEL:
        this.cancelPaymentOrder(this.paymentOrder.uid);
        return;
      case PaymentOrderHeaderEventType.SUSPEND:
        this.suspendPaymentOrder(this.paymentOrder.uid);
        return;
      case PaymentOrderHeaderEventType.RESET:
        this.resetPaymentOrder(this.paymentOrder.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updatePaymentOrder(dataUID: string, dataFields: PaymentOrderFields) {
    this.submitted = true;

    this.paymentOrdersData.updatePaymentOrder(dataUID, dataFields)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private cancelPaymentOrder(dataUID: string) {
    this.submitted = true;

    this.paymentOrdersData.cancelPaymentOrder(dataUID)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private suspendPaymentOrder(dataUID: string) {
    this.submitted = true;

    this.paymentOrdersData.suspendPaymentOrder(dataUID)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resetPaymentOrder(dataUID: string) {
    this.submitted = true;

    this.paymentOrdersData.resetPaymentOrder(dataUID)
      .firstValue()
      .then(x => this.resolveUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveUpdated(data: PaymentOrderHolder) {
    sendEvent(this.paymentOrderEditorEvent, PaymentOrderEditorEventType.UPDATED, { data });
  }

}
