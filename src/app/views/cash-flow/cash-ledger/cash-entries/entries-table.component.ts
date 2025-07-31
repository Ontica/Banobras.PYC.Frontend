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

import { MessageBoxService } from '@app/shared/services';

import { CashEntry, ExplorerOperation, NoCashFlowOperation, TotalItemTypeList, TransactionStatus,
         UndoCashFlowDataOperation } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum CashEntriesTableEventType {
  SELECT_ENTRY_CLICKED              = 'CashEntriesTableComponent.Event.SelectEntryClicked',
  UPDATE_ENTRY_CASH_ACCOUNT_CLICKED = 'CashEntriesTableComponent.Event.UpdateEntryCashAccountClicked',
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


  constructor(private messageBox: MessageBoxService) { }


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
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
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


  onEditEntryCashAccountClicked(entry: CashEntry) {
    const cashAccountEdit = entry.cashAccount?.name ?? '';
    this.rowInEdition = { ...{}, ...entry, cashAccountEdit };
    this.editionMode = true;
  }


  onCancelEditionClicked() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateEntryCashAccountClicked() {
    const payload = {
      transactionID: this.transactionID,
      entryId: this.rowInEdition.id,
      cashAccount: this.rowInEdition.cashAccountEdit,
    };

    sendEvent(this.entriesTableEvent, CashEntriesTableEventType.UPDATE_ENTRY_CASH_ACCOUNT_CLICKED,
      payload);
  }


  private clearSelection() {
    this.selection.clear();
  }


  private setDataTable() {
    this.resetColumns();
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
      this.operationsList = [...[], UndoCashFlowDataOperation];
      return;
    }

    if (this.status === TransactionStatus.Pending) {
      this.operationsList = [...[], NoCashFlowOperation, UndoCashFlowDataOperation];
    }
  }

}
