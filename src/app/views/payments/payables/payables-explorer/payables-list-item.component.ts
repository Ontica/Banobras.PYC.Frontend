/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PayableDescriptor } from '@app/models';


export enum PayablesListItemEventType {
  ITEM_CLICKED  = 'PayablesListItemComponent.Event.ItemClicked',
  CHECK_CLICKED = 'PayablesListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pmt-payables-list-item',
  templateUrl: './payables-list-item.component.html',
  styleUrls: ['./payables-list-item.component.scss'],
})
export class PayablesListItemComponent {

  @Input() item: PayableDescriptor;

  @Input() selected = false;

  @Output() payablesListItemEvent = new EventEmitter<EventInfo>();


  onItemClicked() {
    sendEvent(this.payablesListItemEvent, PayablesListItemEventType.ITEM_CLICKED,
      { item: this.item });
  }


  onCheckItemClicked() {
    sendEvent(this.payablesListItemEvent, PayablesListItemEventType.CHECK_CLICKED,
      { item: this.item });
  }

}
