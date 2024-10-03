/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PaymentOrderDescriptor } from '@app/models';

export enum PaymentsOrdersListItemEventType {
  ITEM_CLICKED  = 'PaymentsOrdersListItemComponent.Event.ItemClicked',
  CHECK_CLICKED = 'PaymentsOrdersListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pmt-payments-orders-list-item',
  templateUrl: './payments-orders-list-item.component.html',
  styleUrls: ['./payments-orders-list-item.component.scss'],
})
export class PaymentsOrdersListItemComponent {

  @Input() item: PaymentOrderDescriptor;

  @Input() selected = false;

  @Output() paymentsOrdersListItemEvent = new EventEmitter<EventInfo>();


  onItemClicked() {
    sendEvent(this.paymentsOrdersListItemEvent, PaymentsOrdersListItemEventType.ITEM_CLICKED,
      { item: this.item });
  }


  onCheckItemClicked() {
    sendEvent(this.paymentsOrdersListItemEvent, PaymentsOrdersListItemEventType.CHECK_CLICKED,
      { item: this.item });
  }

}
