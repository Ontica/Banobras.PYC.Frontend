/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionEntryDescriptor } from '@app/models';


export enum TransactionEntriesTableEventType {
  SELECT_ENTRY_CLICKED = 'BudgetTransactionEntriesTableComponent.Event.SelectEntryClicked',
  REMOVE_ENTRY_CLICKED = 'BudgetTransactionEntriesTableComponent.Event.RemoveEntryClicked',
}

@Component({
  selector: 'emp-bdg-transaction-entries-table',
  templateUrl: './transaction-entries-table.component.html',
})
export class BudgetTransactionEntriesTableComponent implements OnChanges {

  @Input() entries: BudgetTransactionEntryDescriptor[] = [];

  @Input() canDelete = false;

  @Input() canSelect = false;

  @Output() transactionEntriesTableEvent = new EventEmitter<EventInfo>();


  displayedColumnsDefault: string[] = ['budgetAccount', 'year', 'monthName', 'day', 'balanceColumn',
    'deposit', 'withdrawal'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<BudgetTransactionEntryDescriptor>;


  constructor(private messageBox: MessageBoxService) {

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.setDataTable();
    }
  }


  onSelectEntryClicked(entry: BudgetTransactionEntryDescriptor) {
    if (this.canSelect && window.getSelection().toString().length <= 0) {
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


  private setDataTable() {
    this.dataSource = new MatTableDataSource(this.entries);
    this.resetColumns();
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(entry: BudgetTransactionEntryDescriptor): string {
    return `
      <table class='confirm-data'>
        <tr><td class='nowrap'>Movimiento: </td><td><strong>
          ${entry.balanceColumn}
        </strong></td></tr>

        <tr><td class='nowrap'>Cuenta presupuestal: </td><td><strong>
          ${!entry.budgetAccountCode ? '' : entry.budgetAccountCode + ': '} ${entry.budgetAccountName}
        </strong></td></tr>
      </table>

     <br>¿Elimino el movimiento?`;
  }

}
