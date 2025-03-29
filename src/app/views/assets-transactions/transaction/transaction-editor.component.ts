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

import { AssetTransaction, AssetTransactionFields, AssetTransactionHolder, EmptyAssetTransaction,
         EmptyAssetTransactionActions, AssetTransactionActions, AssetTransactionTypes } from '@app/models';

import { TransactionHeaderEventType } from './transaction-header.component';


export enum TransactionEditorEventType {
  UPDATED = 'AssetTransactionEditorComponent.Event.TransactionUpdated',
  DELETED = 'AssetTransactionEditorComponent.Event.TransactionDeleted',
}

@Component({
  selector: 'emp-pyc-transaction-editor',
  templateUrl: './transaction-editor.component.html',
})
export class AssetTransactionEditorComponent {

  @Input() transaction: AssetTransaction = EmptyAssetTransaction;

  @Input() actions: AssetTransactionActions = EmptyAssetTransactionActions;

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
        this.updateTransaction(this.transaction.uid, event.payload.dataFields as AssetTransactionFields);
        return;
      case TransactionHeaderEventType.DELETE:
        this.deleteTransaction(this.transaction.uid);
        return;
      case TransactionHeaderEventType.CLOSE:
        this.closeTransaction(this.transaction.uid);
        return;
      case TransactionHeaderEventType.CHANGE_CUSTODY:
        this.cloneTransaction(this.transaction.uid, AssetTransactionTypes.AssetsCustody);
        return;
      case TransactionHeaderEventType.INVENTORY:
        this.cloneTransaction(this.transaction.uid, AssetTransactionTypes.AssetsInventory);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateTransaction(transactionUID: string, dataFields: AssetTransactionFields) {
    this.submitted = true;

    this.transactionsData.updateAssetTransaction(transactionUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.deleteAssetTransaction(transactionUID)
      .firstValue()
      .then(() => this.resolveTransactionDeleted(transactionUID))
      .finally(() => this.submitted = false);
  }


  private closeTransaction(transactionUID: string) {
    this.submitted = true;

    this.transactionsData.closeAssetTransaction(transactionUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private cloneTransaction(transactionUID: string, transactionTypeUID: string) {
    this.submitted = true;

    this.transactionsData.cloneAssetTransaction(transactionUID, transactionTypeUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated(x))
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated(data: AssetTransactionHolder) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.UPDATED, { data });
  }


  private resolveTransactionDeleted(transactionUID: string) {
    sendEvent(this.transactionEditorEvent, TransactionEditorEventType.DELETED, { transactionUID });
  }

}
