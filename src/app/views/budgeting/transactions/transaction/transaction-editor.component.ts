/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransaction, BudgetTransactionActions, BudgetTransactionData, EmptyBudgetTransaction,
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


  constructor(private transactionsData: BudgetTransactionsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.transaction);
  }


  onTransactionHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionHeaderEventType) {
      case TransactionHeaderEventType.AUTHORIZE:
        this.authorizeTransaction(this.transaction.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private authorizeTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.authorizeTransaction(transactionUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated(data: BudgetTransactionData) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.UPDATED, { data });
  }

}
