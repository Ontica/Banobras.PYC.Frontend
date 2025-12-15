/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { PaymentOrdersDataService } from '@app/data-services';

import { PaymentOrderHolder, PaymentOrderFields } from '@app/models';

import { PaymentOrderHeaderEventType } from './payment-order-header.component';


export enum PaymentOrderCreatorEventType {
  CLOSE_MODAL_CLICKED = 'PaymentOrderCreatorComponent.Event.CloseModalClicked',
  CREATED             = 'PaymentOrderCreatorComponent.Event.Created',
}

@Component({
  selector: 'emp-pmt-payment-order-creator',
  templateUrl: './payment-order-creator.component.html',
})
export class PaymentOrderCreatorComponent {

  @Output() paymentOrderCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private paymentOrdersData: PaymentOrdersDataService) { }


  onCloseModalClicked() {
    sendEvent(this.paymentOrderCreatorEvent, PaymentOrderCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  @SkipIf('submitted')
  onPaymentOrderHeaderEvent(event: EventInfo) {
    switch (event.type as PaymentOrderHeaderEventType) {
      case PaymentOrderHeaderEventType.CREATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.createPaymentOrder(event.payload.dataFields as PaymentOrderFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createPaymentOrder(dataFields: PaymentOrderFields) {
    this.submitted = true;

    this.paymentOrdersData.createPaymentOrder(dataFields)
      .firstValue()
      .then(x => this.resolveCreated(x))
      .finally(() => this.submitted = false);
  }


  private resolveCreated(data: PaymentOrderHolder) {
    sendEvent(this.paymentOrderCreatorEvent, PaymentOrderCreatorEventType.CREATED, { data });
  }

}
