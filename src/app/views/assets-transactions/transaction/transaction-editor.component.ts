/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AssetsTransactionsDataService } from '@app/data-services';

import { AssetsTransaction, AssetsTransactionFields, AssetsTransactionHolder, EmptyAssetsTransaction,
         EmptyAssetsTransactionActions, AssetsTransactionActions, ObjectTypes } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionEditorEventType {
  UPDATED = 'AssetsTransactionEditorComponent.Event.TransactionUpdated',
  DELETED = 'AssetsTransactionEditorComponent.Event.TransactionDeleted',
}

@Component({
  selector: 'emp-inv-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class AssetsTransactionEditorComponent {

  @Input() transaction: AssetsTransaction = EmptyAssetsTransaction;

  @Input() actions: AssetsTransactionActions = EmptyAssetsTransactionActions;

  @Output() transactionEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private transactionsData: AssetsTransactionsDataService) { }


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
        this.updateTransaction(this.transaction.uid, event.payload.dataFields as AssetsTransactionFields);
        return;
      case TransactionHeaderEventType.DELETE:
        this.deleteTransaction(this.transaction.uid);
        return;
      case TransactionHeaderEventType.CLOSE:
        this.closeTransaction(this.transaction.uid);
        return;
      case TransactionHeaderEventType.CHANGE_CUSTODY:
        this.cloneTransaction(this.transaction.uid, ObjectTypes.ASSETS_CUSTODY);
        return;
      case TransactionHeaderEventType.INVENTORY:
        this.cloneTransaction(this.transaction.uid, ObjectTypes.ASSETS_INVENTORY);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateTransaction(transactionUID: string, dataFields: AssetsTransactionFields) {
    this.submitted = true;

    this.transactionsData.updateAssetsTransaction(transactionUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.deleteAssetsTransaction(transactionUID)
      .firstValue()
      .then(() => this.resolveTransactionDeleted(transactionUID))
      .finally(() => this.submitted = false);
  }


  private closeTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.closeAssetsTransaction(transactionUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private cloneTransaction(transactionUID: string, transactionTypeUID: string) {
    this.submitted = true;

    this.transactionsData.cloneAssetsTransaction(transactionUID, transactionTypeUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated(data: AssetsTransactionHolder) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.UPDATED, { data });
  }


  private resolveTransactionDeleted(transactionUID: string) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.DELETED, { transactionUID });
  }

}
