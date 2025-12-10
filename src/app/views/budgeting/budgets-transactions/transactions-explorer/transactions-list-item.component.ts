/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionDescriptor } from '@app/models';


export enum TransactionsListItemEventType {
  SELECT_CLICKED     = 'BudgetTransactionsListItemComponent.Event.SelectClicked',
  SHOW_FILE_CLICKED  = 'BudgetTransactionsListItemComponent.Event.ShowFileClicked',
  CHECK_CLICKED      = 'BudgetTransactionsListItemComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-bdg-transactions-list-item',
  templateUrl: './transactions-list-item.component.html',
  styleUrls: ['./transactions-list-item.component.scss'],
})
export class BudgetTransactionsListItemComponent {

  @Input() transaction: BudgetTransactionDescriptor;

  @Input() selected = false;

  @Input() displayControls = true;

  @Input() displayFile = false;

  @Output() transactionsListItemEvent = new EventEmitter<EventInfo>();


  onSelectClicked() {
    sendEvent(this.transactionsListItemEvent, TransactionsListItemEventType.SELECT_CLICKED,
      { transaction: this.transaction });
  }


  onCheckClicked() {
    sendEvent(this.transactionsListItemEvent, TransactionsListItemEventType.CHECK_CLICKED,
      { transaction: this.transaction });
  }


  onShowFileClicked() {
    sendEvent(this.transactionsListItemEvent, TransactionsListItemEventType.SHOW_FILE_CLICKED,
      { transaction: this.transaction });
  }

}
