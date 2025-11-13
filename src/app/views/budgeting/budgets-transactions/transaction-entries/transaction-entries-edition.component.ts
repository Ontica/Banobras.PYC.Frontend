/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EmpObservable, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { SkipIf } from '@app/shared/decorators';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransaction, BudgetTransactionEntryDescriptor, BudgetTransactionEntryFields,
         EmptyBudgetTransaction, EmptyBudgetTransactionEntry, TransactionEntryType,
         BudgetTransactionEntryByYearFields, BudgetTransactionGroupedEntryData,
         EmptyBudgetTransactionGroupedEntryData, BudgetTransactionEntryBase, EmptyBudgetTransactionEntryBase,
         BudgetTransactionEntryBaseDescriptor, BudgetTransactionEntryByYearDescriptor } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

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

  selectedEntry: BudgetTransactionEntryBase = EmptyBudgetTransactionEntryBase;

  filter = '';

  displayAllEntries = false;


  constructor(private transactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges(){
    this.filter = '';
    this.setSelectedEntry(EmptyBudgetTransactionEntry);
  }


  onEntriesControlsEvent(event: EventInfo) {
    switch (event.type as TransactionEntriesControlsEventType) {
      case TransactionEntriesControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        return;
      case TransactionEntriesControlsEventType.CHECK_ALL_ENTRIES_CHANGED:
        this.displayAllEntries = event.payload.displayAllEntries as boolean;
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

  @SkipIf('submitted')
  onEntryEditorEvent(event: EventInfo) {
    switch (event.type as TransactionEntryEditorEventType) {
      case TransactionEntryEditorEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedEntry(EmptyBudgetTransactionEntry);
        return;
      case TransactionEntryEditorEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.entryType, 'event.payload.entryType');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.handleCreateEntry(event.payload.entryType, this.transaction.uid, event.payload.dataFields);
        return;
      case TransactionEntryEditorEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.entryType, 'event.payload.entryType');
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.dataFields, 'event.payload.dataFields');
        this.handleUpdateEntry(event.payload.entryType, this.transaction.uid, event.payload.entryUID, event.payload.dataFields);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onEntriesTableEvent(event: EventInfo) {
    switch (event.type as TransactionEntriesTableEventType) {
      case TransactionEntriesTableEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.handleGetEntry(TransactionEntryType.Monthly, this.transaction.uid, event.payload.entry.uid);
        return;
      case TransactionEntriesTableEventType.REMOVE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.confirmRemoveEntry(TransactionEntryType.Monthly,
          event.payload.entry as BudgetTransactionEntryBaseDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  @SkipIf('submitted')
  onEntriesGroupedTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.handleGetEntry(TransactionEntryType.Annually, this.transaction.uid, event.payload.entry.uid);
        return;
      case DataTableEventType.DELETE_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.confirmRemoveEntry(TransactionEntryType.Annually,
          event.payload.entry as BudgetTransactionEntryBaseDescriptor);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private handleGetEntry(type: TransactionEntryType, transactionUID: string, entryUID: string) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.transactionsData.getTransactionEntry(transactionUID, entryUID)
        break;
      case TransactionEntryType.Annually:
        observable = this.transactionsData.getTransactionEntriesByYear(transactionUID, entryUID)
        break;
      default:
        return;
    }
    this.executeGetEntry(observable);
  }


  private handleCreateEntry(type: TransactionEntryType, transactionUID: string, dataFields) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.transactionsData.createTransactionEntry(transactionUID, dataFields as BudgetTransactionEntryFields);
        break;
      case TransactionEntryType.Annually:
        observable = this.transactionsData.createTransactionEntriesByYear(transactionUID, dataFields as BudgetTransactionEntryByYearFields);
        break;
      default:
        return;
    }
    this.executeEditEntry(observable);
  }


  private handleUpdateEntry(type: TransactionEntryType, transactionUID: string, entryUID: string, dataFields) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.transactionsData.updateTransactionEntry(transactionUID, entryUID, dataFields as BudgetTransactionEntryFields);
        break;
      case TransactionEntryType.Annually:
        observable = this.transactionsData.updateTransactionEntriesByYear(transactionUID, entryUID, dataFields as BudgetTransactionEntryByYearFields);
        break;
      default:
        return;
    }
    this.executeEditEntry(observable);
  }


  private handleRemoveEntry(type: TransactionEntryType, transactionUID: string, entryUID: string) {
    let observable = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        observable = this.transactionsData.removeTransactionEntry(transactionUID, entryUID);
        break;
      case TransactionEntryType.Annually:
        observable = this.transactionsData.removeTransactionEntriesByYear(transactionUID, entryUID);
        break;
      default:
        return;
    }
    this.executeEditEntry(observable);
  }


  private executeGetEntry(observable: EmpObservable<BudgetTransactionEntryBase>) {
    this.submitted = true;
    observable
      .firstValue()
      .then(x => this.setSelectedEntry(x))
      .finally(() => this.submitted = false);
  }


  private executeEditEntry(observable: EmpObservable<BudgetTransactionEntryBase | void>) {
    this.submitted = true;
    observable
      .firstValue()
      .then(x => this.resolveEntriesUpdated())
      .finally(() => this.submitted = false);
  }


  private setSelectedEntry(entry: BudgetTransactionEntryBase, display?: boolean) {
    this.selectedEntry = entry;
    this.displayEntryEditor = display ?? !isEmpty(entry);
  }


  private resolveEntriesUpdated() {
    const payload = { transactionUID: this.transaction.uid };
    sendEvent(this.transactionEntriesEditionEvent, TransactionEntriesEditionEventType.UPDATED, payload);
    this.setSelectedEntry(EmptyBudgetTransactionEntry);
  }


  private getConfirmRemoveEntryTitle(type: TransactionEntryType): string {
    switch (type) {
      case TransactionEntryType.Monthly: return 'Eliminar movimiento mensual';
      case TransactionEntryType.Annually: return 'Eliminar movimiento anual';
      default: return 'Eliminar movimiento';
    }
  }


  private confirmRemoveEntry(type: TransactionEntryType, entry: BudgetTransactionEntryBaseDescriptor) {
    const title = this.getConfirmRemoveEntryTitle(type);
    const message = this.getConfirmRemoveEntryMessage(type, entry);

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .firstValue()
      .then(x => x ? this.handleRemoveEntry(type, this.transaction.uid, entry.uid) : null);
  }


  private getConfirmRemoveEntryMessage(type: TransactionEntryType, entry: BudgetTransactionEntryBaseDescriptor): string {
    const total = this.getEntryTotal(type, entry);
    const budgetAccount = this.getEntryBudgetAccount(type, entry);

    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Movimiento: </td><td><strong>${entry.balanceColumn}</strong></td></tr>
        <tr><td class='nowrap'>Partida: </td><td><strong>${budgetAccount}</strong></td></tr>
        <tr><td class='nowrap'>Importe: </td><td><strong>${total}</strong></td></tr>
      </table>
      <br>¿Elimino el movimiento?`;
  }


  private getEntryBudgetAccount(type: TransactionEntryType, entry: BudgetTransactionEntryBaseDescriptor): string {
    switch (type) {
      case TransactionEntryType.Monthly: return (entry as BudgetTransactionEntryDescriptor).budgetAccountName;
      case TransactionEntryType.Annually: return (entry as BudgetTransactionEntryByYearDescriptor).budgetAccount;
      default: return '';
    }
  }


  private getEntryTotal(type: TransactionEntryType, entry: BudgetTransactionEntryBaseDescriptor): string {
    let total = null;
    switch (type) {
      case TransactionEntryType.Monthly:
        total = (entry as BudgetTransactionEntryDescriptor).withdrawal > 0 ?
          (entry as BudgetTransactionEntryDescriptor).withdrawal :
          (entry as BudgetTransactionEntryDescriptor).deposit;
        break;
      case TransactionEntryType.Annually:
        total = (entry as BudgetTransactionEntryByYearDescriptor).total;
        break;
      default: total = 0;
    }
    return FormatLibrary.numberWithCommas(total, '1.2-2');
  }

}
