/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashTransactionDescriptor } from '@app/models';


export enum CashTransactionsListItemEventType {
  SELECT_CLICKED = 'CashTransactionsListItemComponent.Event.SelectClicked',
  CHECK_CLICKED  = 'CashTransactionsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-cf-cash-transactions-list-item',
  templateUrl: './transactions-list-item.component.html',
  styleUrls: ['./transactions-list-item.component.scss'],
})
export class CashTransactionsListItemComponent {

  @Input() item: CashTransactionDescriptor;

  @Input() selected = false;

  @Input() displayControls = true;

  @Output() transactionsListItemEvent = new EventEmitter<EventInfo>();


  onSelectClicked() {
    sendEvent(this.transactionsListItemEvent, CashTransactionsListItemEventType.SELECT_CLICKED,
      { item: this.item });
  }


  onCheckClicked() {
    sendEvent(this.transactionsListItemEvent, CashTransactionsListItemEventType.CHECK_CLICKED,
      { item: this.item });
  }

}
