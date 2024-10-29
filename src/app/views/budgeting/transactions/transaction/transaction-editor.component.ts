/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { BudgetTransaction, BudgetTransactionActions, EmptyBudgetTransaction,
         EmptyBudgetTransactionActions } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionEditorEventType {
  UPDATED = 'TransactionEditorComponent.Event.TransactionUpdated',
  DELETED = 'TransactionEditorComponent.Event.TransactionDeleted',
}

@Component({
  selector: 'emp-bdg-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class TransactionEditorComponent {

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() actions: BudgetTransactionActions = EmptyBudgetTransactionActions;

  @Output() transactionEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  get isSaved(): boolean {
    return !isEmpty(this.transaction);
  }


  onTransactionHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionHeaderEventType) {

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
