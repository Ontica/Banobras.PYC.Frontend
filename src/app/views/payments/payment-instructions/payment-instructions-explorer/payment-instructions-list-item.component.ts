/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PaymentInstructionDescriptor } from '@app/models';

export enum PaymentInstructionsListItemEventType {
  ITEM_CLICKED  = 'PaymentInstructionsListItemComponent.Event.ItemClicked',
  CHECK_CLICKED = 'PaymentInstructionsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pmt-payment-instructions-list-item',
  templateUrl: './payment-instructions-list-item.component.html',
  styleUrls: ['./payment-instructions-list-item.component.scss'],
})
export class PaymentInstructionsListItemComponent {

  @Input() item: PaymentInstructionDescriptor;

  @Input() selected = false;

  @Output() paymentInstructionsListItemEvent = new EventEmitter<EventInfo>();


  onItemClicked() {
    sendEvent(this.paymentInstructionsListItemEvent, PaymentInstructionsListItemEventType.ITEM_CLICKED,
      { item: this.item });
  }


  onCheckItemClicked() {
    sendEvent(this.paymentInstructionsListItemEvent, PaymentInstructionsListItemEventType.CHECK_CLICKED,
      { item: this.item });
  }

}
