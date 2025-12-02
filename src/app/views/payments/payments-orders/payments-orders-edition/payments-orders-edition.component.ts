/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { PaymentOrderDescriptor } from '@app/models';

import { PaymentsOrdersTableEventType } from './payments-orders-table.component';


export enum PaymentsOrdersEditionEventType {
  UPDATED = 'PaymentsOrdersEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-pmt-payments-orders-edition',
  templateUrl: './payments-orders-edition.component.html',
})
export class PaymentsOrdersEditionComponent {

  @Input() paymentsOrders: PaymentOrderDescriptor[] = [];

  @Input() displayType = false;

  @Input() canEdit = false;

  @Output() paymentsOrdersEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onRequestPaymentClicked() {
    this.messageBox.showInDevelopment('Solicitar pago');
  }


  @SkipIf('submitted')
  onPaymentsOrdersTableEvent(event: EventInfo) {
    switch (event.type as PaymentsOrdersTableEventType) {
      case PaymentsOrdersTableEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.payment.uid, 'event.payload.paymentOrder.uid');
        return;
      case PaymentsOrdersTableEventType.REMOVE_CLICKED:
        Assertion.assertValue(event.payload.paymentOrder.uid, 'event.payload.paymentOrder.uid');
        this.messageBox.showInDevelopment('Cancelar pago', event.payload.paymentOrder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
