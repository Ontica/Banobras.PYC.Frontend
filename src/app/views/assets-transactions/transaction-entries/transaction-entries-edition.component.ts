/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { AssetsTransactionsDataService } from '@app/data-services';

import { AssetTransactionEntry, AssetTransaction, AssetTransactionEntryFields,
         EmptyAssetTransaction } from '@app/models';

import { TransactionEntriesTableEventType } from './transaction-entries-table.component';


export enum TransactionEntriesEditionEventType {
  UPDATED = 'AssetTransactionEntriesEditionComponent.Event.Updated',
  DELETED = 'AssetTransactionEntriesEditionComponent.Event.Deleted',
}

@Component({
  selector: 'emp-pyc-transaction-entries-edition',
  templateUrl: './transaction-entries-edition.component.html',
})
export class AssetTransactionEntriesEditionComponent implements OnChanges {

  @Input() transaction: AssetTransaction = EmptyAssetTransaction;

  @Input() entries: AssetTransactionEntry[] = [];

  @Input() canEdit = false;

  @Output() transactionEntriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  filter = '';


  constructor(private transactionsData: AssetsTransactionsDataService,
              private messageBox: MessageBoxService) {

  }


  ngOnChanges(){
    this.filter = '';
  }


  onCreateEntryButtonClicked() {
    this.messageBox.showInDevelopment('Agregar movimiento');
  }


  onTransactionEntriesTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionEntriesTableEventType) {
      case TransactionEntriesTableEventType.UPDATE_CLICKED:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.updateTransactionEntry(this.transaction.uid, event.payload.entryUID, event.payload.dataFields);
        return;
      case TransactionEntriesTableEventType.DELETE_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.deleteTransactionEntry(this.transaction.uid, event.payload.entry.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateTransactionEntry(transactionUID: string, entryUID: string, dataFields: AssetTransactionEntryFields) {
    this.submitted = true;

    this.transactionsData.updateAssetTransactionEntry(transactionUID, entryUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private deleteTransactionEntry(transactionUID: string, entryUID: string) {
    this.submitted = true;

    this.transactionsData.deleteAssetTransactionEntry(transactionUID, entryUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated() {
    const payload = { transactionUID: this.transaction.uid };
    sendEvent(this.transactionEntriesEditionEvent, TransactionEntriesEditionEventType.UPDATED, payload);
  }

}
