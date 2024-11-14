/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ContractDescriptor, isEntityStatusInWarning } from '@app/models';

export enum ContractsListItemEventType {
  ITEM_CLICKED  = 'ContractsListItemComponent.Event.ItemClicked',
  CHECK_CLICKED = 'ContractsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-pmt-contracts-list-item',
  templateUrl: './contracts-list-item.component.html',
  styleUrls: ['./contracts-list-item.component.scss'],
})
export class ContractsListItemComponent {

  @Input() item: ContractDescriptor;

  @Input() selected = false;

  @Output() contractsListItemEvent = new EventEmitter<EventInfo>();

  isEntityStatusInWarning = isEntityStatusInWarning;


  onItemClicked() {
    sendEvent(this.contractsListItemEvent, ContractsListItemEventType.ITEM_CLICKED,
      { item: this.item });
  }


  onCheckItemClicked() {
    sendEvent(this.contractsListItemEvent, ContractsListItemEventType.CHECK_CLICKED,
      { item: this.item });
  }

}
