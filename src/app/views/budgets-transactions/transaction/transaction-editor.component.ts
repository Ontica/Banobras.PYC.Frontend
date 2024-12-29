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

import { BudgetTransaction, TransactionActions, BudgetTransactionData, EmptyBudgetTransaction,
         EmptyTransactionActions } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionEditorEventType {
  UPDATED = 'BudgetTransactionEditorComponent.Event.TransactionUpdated',
  DELETED = 'BudgetTransactionEditorComponent.Event.TransactionDeleted',
}

@Component({
  selector: 'emp-bdg-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class BudgetTransactionEditorComponent {

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() actions: TransactionActions = EmptyTransactionActions;

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
      case TransactionHeaderEventType.REJECT:
        this.rejectTransaction(this.transaction.uid);
        return;
      case TransactionHeaderEventType.DELETE:
        this.deleteTransaction(this.transaction.uid);
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


  private rejectTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.rejectTransaction(transactionUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.deleteTransaction(transactionUID)
      .firstValue()
      .then(() => this.resolveTransactionDeleted(transactionUID))
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated(data: BudgetTransactionData) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.UPDATED, { data });
  }


  private resolveTransactionDeleted(transactionUID: string) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.DELETED, { transactionUID });
  }

}
