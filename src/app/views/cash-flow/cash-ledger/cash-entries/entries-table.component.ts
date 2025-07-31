/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { CashEntry, ExplorerOperation, MarkAsNoCashEntriesOperation, TotalItemTypeList, TransactionStatus,
         RemoveCashEntriesOperation, CashEntriesOperationCommand, CashEntriesOperation } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum CashEntriesTableEventType {
  SELECT_ENTRY_CLICKED      = 'CashEntriesTableComponent.Event.SelectEntryClicked',
  EXECUTE_OPERATION_CLICKED = 'CashEntriesTableComponent.Event.ExecuteOperationClicked',
}

@Component({
  selector: 'emp-cf-cash-entries-table',
  templateUrl: './entries-table.component.html',
  styles: `
    .cell-cash-account {
      width: 100px;
    }

    .cell-cash-account-enabled {
      width: 100px;
      padding: 2px 0 2px 0;
      vertical-align: middle;
    }
  `,
})
export class CashEntriesTableComponent implements OnChanges {

  @Input() transactionID = null;

  @Input() status: TransactionStatus = null;

  @Input() entries: CashEntry[] = [];

  @Input() canEdit = false;

  @Output() entriesTableEvent = new EventEmitter<EventInfo>();

  editionMode = false;

  rowInEdition: CashEntry = null;

  displayedColumnsDefault: string[] = ['accountNumber', 'sector', 'accountName', 'verificationNumber',
    'responsibilityArea', 'currency', 'exchangeRate', 'debit', 'credit', 'cashAccount'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<CashEntry>;

  totalItemTypeList = TotalItemTypeList;

  selection = new SelectionModel<CashEntry>(true, []);

  operationsList: ExplorerOperation[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes.entries) {
      this.clearSelection();
      this.setDataTable();
    }

    if (changes.status) {
      this.buildOperationsList();
    }
  }


  get displayControls(): boolean {
    return this.canEdit && this.selection.selected.length > 0;
  }


  get isEntryInEditionValid(): boolean {
    return !!this.rowInEdition.cashAccountEdit;
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');

        const command: CashEntriesOperationCommand = {
          operation: event.payload.operation,
          entries: event.payload.command.items,
        };

        sendEvent(this.entriesTableEvent, CashEntriesTableEventType.EXECUTE_OPERATION_CLICKED,
          { transactionID: this.transactionID, command });
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  isRowInEdition(rowInEditionID: number): boolean {
    return this.editionMode && rowInEditionID === this.rowInEdition?.id;
  }


  onSelectEntryClicked(entry: CashEntry) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.entriesTableEvent, CashEntriesTableEventType.SELECT_ENTRY_CLICKED,
        { entry });
    }
  }


  onEditEntryClicked(entry: CashEntry) {
    if (!entry.canEditCashFlow) {
      return;
    }

    const cashAccountEdit = entry.cashAccount.uid === '0' ? '' : entry.cashAccount.name;

    this.rowInEdition = { ...{}, ...entry, cashAccountEdit };
    this.editionMode = true;
  }


  onCancelEditionClicked() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateEntryClicked() {
    const command: CashEntriesOperationCommand = {
      operation: CashEntriesOperation.MarkAsCashEntries,
      entries: [this.rowInEdition.id],
      cashAccount: this.rowInEdition.cashAccountEdit,
    };

    sendEvent(this.entriesTableEvent, CashEntriesTableEventType.EXECUTE_OPERATION_CLICKED,
      { transactionID: this.transactionID, command });
  }


  private clearSelection() {
    this.selection.clear();
    this.onCancelEditionClicked();
  }


  private setDataTable() {
    this.resetColumns();
    this.entries.forEach(x => x.canEditCashFlow = ['0'].includes(x.cashAccount.uid));
    this.dataSource = new MatTableDataSource(this.entries);
  }


  private resetColumns() {
    this.displayedColumns = this.canEdit ?
      ['check', ...this.displayedColumnsDefault, 'action'] :
      [...this.displayedColumnsDefault];
  }


  private buildOperationsList() {
    if (!this.canEdit) {
      this.operationsList = [];
      return;
    }

    if (this.status === TransactionStatus.Closed) {
      this.operationsList = [...[], RemoveCashEntriesOperation];
      return;
    }

    if (this.status === TransactionStatus.Pending) {
      this.operationsList = [...[], MarkAsNoCashEntriesOperation, RemoveCashEntriesOperation];
    }
  }

}
