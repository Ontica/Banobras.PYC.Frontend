/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { BudgetTransactionEntryDescriptor, TotalItemTypeList } from '@app/models';


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

  @Input() filter = '';

  @Input() canDelete = false;

  @Output() transactionEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['party', 'budgetAccount', 'productCode', 'description', 'controlNo',
    'program', 'year', 'month', 'day', 'balanceColumn', 'deposit', 'withdrawal'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<BudgetTransactionEntryDescriptor>;

  totalItemTypeList = TotalItemTypeList;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.setDataTable();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  get hasItems(): boolean {
    return !!this.dataSource && this.dataSource?.data.length > 0;
  }


  onSelectEntryClicked(entry: BudgetTransactionEntryDescriptor) {
    if (window.getSelection().toString().length <= 0 && !TotalItemTypeList.includes(entry.itemType)) {
      sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.SELECT_ENTRY_CLICKED,
        { entry });
    }
  }


  onRemoveEntryClicked(entry: BudgetTransactionEntryDescriptor) {
    sendEvent(this.transactionEntriesTableEvent, TransactionEntriesTableEventType.REMOVE_ENTRY_CLICKED,
      { entry });
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

}
