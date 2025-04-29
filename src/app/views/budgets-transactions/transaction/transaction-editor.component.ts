/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransaction, TransactionActions, BudgetTransactionHolder, EmptyBudgetTransaction,
         EmptyTransactionActions, BudgetTransactionFields } from '@app/models';

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
      case TransactionHeaderEventType.UPDATE:
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateTransaction(event.payload.dataFields as BudgetTransactionFields);
        return;
      case TransactionHeaderEventType.SEND_TO_AUTHORIZE:
        this.sendToAuthorizationTransaction(this.transaction.uid);
        return;
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


  private updateTransaction(dataFields: BudgetTransactionFields) {
    this.submitted = true;

    this.transactionsData.updateTransaction(this.transaction.uid, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private sendToAuthorizationTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.sendToAuthorizationTransaction(transactionUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
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


  private resolveTransactionUpdated(data: BudgetTransactionHolder) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.UPDATED, { data });
  }


  private resolveTransactionDeleted(transactionUID: string) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.DELETED, { transactionUID });
  }

}
