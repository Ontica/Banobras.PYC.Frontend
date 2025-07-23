/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { MessageBoxService } from '@app/shared/services';

import { AssetsTransactionsDataService } from '@app/data-services';

import { AssetsTransactionEntry, AssetsTransaction, AssetsTransactionEntryFields,
         EmptyAssetsTransaction } from '@app/models';

import { TransactionEntriesTableEventType } from './transaction-entries-table.component';


export enum TransactionEntriesEditionEventType {
  UPDATED = 'AssetsTransactionEntriesEditionComponent.Event.Updated',
  DELETED = 'AssetsTransactionEntriesEditionComponent.Event.Deleted',
}

@Component({
  selector: 'emp-inv-transaction-entries-edition',
  templateUrl: './transaction-entries-edition.component.html',
})
export class AssetsTransactionEntriesEditionComponent implements OnChanges {

  @Input() transaction: AssetsTransaction = EmptyAssetsTransaction;

  @Input() entries: AssetsTransactionEntry[] = [];

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


  @SkipIf('submitted')
  onTransactionEntriesTableEvent(event: EventInfo) {
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


  private updateTransactionEntry(transactionUID: string, entryUID: string, dataFields: AssetsTransactionEntryFields) {
    this.submitted = true;

    this.transactionsData.updateAssetsTransactionEntry(transactionUID, entryUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private deleteTransactionEntry(transactionUID: string, entryUID: string) {
    this.submitted = true;

    this.transactionsData.deleteAssetsTransactionEntry(transactionUID, entryUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated() {
    const payload = { transactionUID: this.transaction.uid };
    sendEvent(this.transactionEntriesEditionEvent, TransactionEntriesEditionEventType.UPDATED, payload);
  }

}
