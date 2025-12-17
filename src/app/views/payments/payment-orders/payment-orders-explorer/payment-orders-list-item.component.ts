/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PaymentOrderDescriptor, Priority } from '@app/models';


export enum PaymentOrdersListItemEventType {
  SELECT_CLICKED = 'PaymentOrdersListItemComponent.Event.SelectClicked',
  CHECK_CLICKED  = 'PaymentOrdersListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pmt-payment-orders-list-item',
  templateUrl: './payment-orders-list-item.component.html',
  styleUrls: ['./payment-orders-list-item.component.scss'],
})
export class PaymentOrdersListItemComponent {

  @Input() item: PaymentOrderDescriptor;

  @Input() selected = false;

  @Output() paymentOrdersListItemEvent = new EventEmitter<EventInfo>();

  Priority = Priority;


  onSelectClicked() {
    sendEvent(this.paymentOrdersListItemEvent, PaymentOrdersListItemEventType.SELECT_CLICKED, {item: this.item});
  }


  onCheckClicked() {
    sendEvent(this.paymentOrdersListItemEvent, PaymentOrdersListItemEventType.CHECK_CLICKED, {item: this.item});
  }

}
