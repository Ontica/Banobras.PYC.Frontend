/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AssetsTransactionDescriptor } from '@app/models';


export enum TransactionsListItemEventType {
  SELECT_CLICKED = 'AssetsTransactionsListItemComponent.Event.SelectClicked',
  CHECK_CLICKED  = 'AssetsTransactionsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-inv-transactions-list-item',
  templateUrl: './transactions-list-item.component.html',
  styleUrls: ['./transactions-list-item.component.scss'],
})
export class AssetsTransactionsListItemComponent {

  @Input() transaction: AssetsTransactionDescriptor;

  @Input() selected = false;

  @Output() transactionsListItemEvent = new EventEmitter<EventInfo>();


  onSelectClicked() {
    sendEvent(this.transactionsListItemEvent, TransactionsListItemEventType.SELECT_CLICKED,
      { transaction: this.transaction });
  }


  onCheckClicked() {
    sendEvent(this.transactionsListItemEvent, TransactionsListItemEventType.CHECK_CLICKED,
      { transaction: this.transaction });
  }

}
