/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { BudgetTransactionEntryDescriptor, BudgetTransactionGroupedEntryData,
         EmptyBudgetTransactionGroupedEntryData } from '@app/models';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';


export enum TransactionEntriesTableEventType {
  SELECT_ENTRY_CLICKED         = 'BudgetTransactionEntriesTableComponent.Event.SelectEntryClicked',
  SELECT_GROUPED_ENTRY_CLICKED = 'BudgetTransactionEntriesTableComponent.Event.SelectGroupedEntryClicked',
  REMOVE_ENTRY_CLICKED         = 'BudgetTransactionEntriesTableComponent.Event.RemoveEntryClicked',
}

@Component({
  selector: 'emp-bdg-transaction-entries-table',
  templateUrl: './transaction-entries-table.component.html',
})
export class BudgetTransactionEntriesTableComponent implements OnChanges {

  @Input() displayGroupedEntries = false;

  @Input() entries: BudgetTransactionEntryDescriptor[] = [];

  @Input() groupedEntries: BudgetTransactionGroupedEntryData = Object.assign({}, EmptyBudgetTransactionGroupedEntryData);

  @Input() filter = '';

  @Input() canDelete = false;

  @Output() transactionEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['budgetAccount', 'year', 'monthName', 'day', 'balanceColumn',
    'deposit', 'withdrawal'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<BudgetTransactionEntryDescriptor>;


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.setDataTable();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  onSelectEntryClicked(entry: BudgetTransactionEntryDescriptor) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.SELECT_ENTRY_CLICKED,
        { entry });
    }
  }


  onRemoveEntryClicked(entry: BudgetTransactionEntryDescriptor) {
    const message = this.getConfirmMessage(entry);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.REMOVE_ENTRY_CLICKED,
            { entry });
        }
      });
  }


  onGroupedEntriesTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.ENTRY_CLICKED: {
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        const entry = event.payload.entry as BudgetTransactionEntryDescriptor;
        sendEvent(this.transactionEntriesTableEvent,
          TransactionEntriesTableEventType.SELECT_GROUPED_ENTRY_CLICKED, { entry });
        return;
      }
      case DataTableEventType.DELETE_ENTRY_CLICKED: {
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        const entry = event.payload.entry as BudgetTransactionEntryDescriptor;
        this.messageBox.showInDevelopment('Eliminar movimientos agrupados', entry);
        return;
      }
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setDataTable() {
    this.resetColumns();
    this.dataSource = new MatTableDataSource(this.entries);
  }


  private resetColumns() {
    this.displayedColumns = this.canDelete ?
      [...this.displayedColumnsDefault, 'actionDelete'] :
      [...this.displayedColumnsDefault];
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }


  private getConfirmMessage(entry: BudgetTransactionEntryDescriptor): string {
    const amount = entry.withdrawal > 0 ? entry.withdrawal : entry.deposit;
    const amountString = FormatLibrary.numberWithCommas(amount, '1.2-2');

    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Movimiento: </td><td><strong>
          ${entry.balanceColumn}
        </strong></td></tr>

        <tr><td class='nowrap'>Cuenta presupuestal: </td><td><strong>
          ${!entry.budgetAccountCode ? '' : entry.budgetAccountCode + ': '} ${entry.budgetAccountName}
        </strong></td></tr>

        <tr><td class='nowrap'>Importe: </td><td><strong>
          ${amountString}
        </strong></td></tr>
      </table>

     <br>¿Elimino el movimiento?`;
  }

}
