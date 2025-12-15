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

import { EmptyPaymentOrderActions, PaymentOrderActions, PaymentOrderItem } from '@app/models';

import { PaymentOrderItemsTableEventType } from './payment-order-items-table.component';


export enum PaymentOrderItemsEditionEventType {
  ITEMS_UPDATED = 'PaymentOrderItemsEditionComponent.Event.ItemsUpdated',
}

@Component({
  selector: 'emp-pmt-payment-order-items-edition',
  templateUrl: './payment-order-items-edition.component.html',
})
export class PaymentOrderItemsEditionComponent {

  @Input() items: PaymentOrderItem[] = [];

  @Input() actions: PaymentOrderActions = EmptyPaymentOrderActions;

  @Output() paymentOrderItemsEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) { }


  @SkipIf('submitted')
  onPaymentOrderItemsTableEvent(event: EventInfo) {
    switch (event.type as PaymentOrderItemsTableEventType) {
      case PaymentOrderItemsTableEventType.SELECT_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        return;
      case PaymentOrderItemsTableEventType.REMOVE_ITEM_CLICKED:
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.messageBox.showInDevelopment('Eliminar movimiento', event.payload.item);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
