/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransaction, BudgetTransactionEntry, BudgetTransactionEntryDescriptor, BudgetEntryFields,
         EmptyBudgetTransaction, EmptyBudgetTransactionEntry, BudgetTransactionEntryType,
         BudgetEntryByYearFields, BudgetTransactionGroupedEntryData,
         EmptyBudgetTransactionGroupedEntryData } from '@app/models';

import { TransactionEntriesControlsEventType } from './transaction-entries-controls.component';

import { TransactionEntriesTableEventType } from './transaction-entries-table.component';

import { TransactionEntryEditorEventType } from './transaction-entry-editor.component';


export enum TransactionEntriesEditionEventType {
  UPDATED = 'BudgetTransactionEntriesEditionComponent.Event.Updated',
}

@Component({
  selector: 'emp-bdg-transaction-entries-edition',
  templateUrl: './transaction-entries-edition.component.html',
})
export class BudgetTransactionEntriesEditionComponent implements OnChanges {

  @Input() transaction: BudgetTransaction = EmptyBudgetTransaction;

  @Input() entries: BudgetTransactionEntryDescriptor[] = [];

  @Input() groupedEntries: BudgetTransactionGroupedEntryData = Object.assign({}, EmptyBudgetTransactionGroupedEntryData);

  @Input() canEdit = false;

  @Output() transactionEntriesEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayEntryEditor = false;

  selectedEntry = EmptyBudgetTransactionEntry;

  filter = '';

  displayGroupedEntries = false;


  constructor(private transactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges(){
    this.filter = '';
    this.setSelectedEntry(EmptyBudgetTransactionEntry);
  }


  onTransactionEntriesControlsEvent(event: EventInfo) {
    switch (event.type as TransactionEntriesControlsEventType) {
      case TransactionEntriesControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case TransactionEntriesControlsEventType.GROUPED_ENTRIES_CHANGED:
        this.displayGroupedEntries = event.payload.displayGroupedEntries as boolean;
        return;
      case TransactionEntriesControlsEventType.AUTOMATIC_GENERATION_BUTTON_CLICKED:
        this.messageBox.showInDevelopment('Generación automática');
        return;
      case TransactionEntriesControlsEventType.CREATE_ENTRY_BUTTON_CLICKED:
        this.setSelectedEntry(EmptyBudgetTransactionEntry, true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionEntryEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionEntryEditorEventType) {
      case TransactionEntryEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedEntry(EmptyBudgetTransactionEntry);
        return;
      case TransactionEntryEditorEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.entryType, 'event.payload.entryType');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');

        if (event.payload.entryType === BudgetTransactionEntryType.Monthly) {
          this.createTransactionEntry(event.payload.transactionUID,
            event.payload.dataFields as BudgetEntryFields);
        }

        if (event.payload.entryType === BudgetTransactionEntryType.Annually) {
          this.createTransactionEntriesByYear(event.payload.transactionUID,
            event.payload.dataFields as BudgetEntryByYearFields)
        }

        return;
      case TransactionEntryEditorEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.entryType, 'event.payload.entryType');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');

        if (event.payload.entryType === BudgetTransactionEntryType.Monthly) {
          this.updateTransactionEntry(event.payload.transactionUID, event.payload.entryUID,
            event.payload.dataFields as BudgetEntryFields);
        }

        if (event.payload.entryType === BudgetTransactionEntryType.Annually) {
          this.messageBox.showInDevelopment('Actualizar movimientos agrupados', event.payload);
        }

        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionEntriesTableEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TransactionEntriesTableEventType) {
      case TransactionEntriesTableEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getTransactionEntry(this.transaction.uid, event.payload.entry.uid);
        return;
      case TransactionEntriesTableEventType.REMOVE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.removeTransactionEntry(this.transaction.uid, event.payload.entry.uid);
        return;
      case TransactionEntriesTableEventType.SELECT_GROUPED_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.messageBox.showInDevelopment('Actualizar movimientos agrupados', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getTransactionEntry(transactionUID: string, entryUID: string) {
    this.submitted = true;

    this.transactionsData.getTransactionEntry(transactionUID, entryUID)
      .firstValue()
      .then(x => this.setSelectedEntry(x))
      .finally(() => this.submitted = false);
  }


  private createTransactionEntry(transactionUID: string, dataFields: BudgetEntryFields) {
    this.submitted = true;

    this.transactionsData.createTransactionEntry(transactionUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private updateTransactionEntry(transactionUID: string, entryUID: string, dataFields: BudgetEntryFields) {
    this.submitted = true;

    this.transactionsData.updateTransactionEntry(transactionUID, entryUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private removeTransactionEntry(transactionUID: string, entryUID: string) {
    this.submitted = true;

    this.transactionsData.removeTransactionEntry(transactionUID, entryUID)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private createTransactionEntriesByYear(transactionUID: string, dataFields: BudgetEntryByYearFields) {
    this.submitted = true;

    this.transactionsData.createTransactionEntriesByYear(transactionUID, dataFields)
      .firstValue()
      .then(x => this.resolveTransactionUpdated())
      .finally(() => this.submitted = false);
  }


  private resolveTransactionUpdated() {
    const payload = { transactionUID: this.transaction.uid };
    sendEvent(this.transactionEntriesEditionEvent, TransactionEntriesEditionEventType.UPDATED, payload);
    this.setSelectedEntry(EmptyBudgetTransactionEntry);
  }


  private setSelectedEntry(entry: BudgetTransactionEntry, display?: boolean) {
    this.selectedEntry = entry;
    this.displayEntryEditor = display ?? !isEmpty(entry);
  }

}
