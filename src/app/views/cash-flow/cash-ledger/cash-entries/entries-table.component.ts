/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';

import { Assertion, EventInfo, FlexibleIdentifiable } from '@app/core';

import { FormatLibrary, sendEvent, sendEventIf } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { CashAccountPendingID, CashAccountStatusList, CashAccountWaitingID, CashEntriesOperation,
         CashEntriesOperationCommand, CashEntry, ExplorerOperation, MarkAsCashEntriesWaitingOperation,
         MarkAsNoCashEntriesOperation, NoCashAccountID, RemoveCashEntriesOperation,  TotalItemTypeList,
         TransactionStatus, WithCashAccountID } from '@app/models';

import { ListControlsEventType } from '@app/views/_reports-controls/explorer/list-controls.component';


export enum CashEntriesTableEventType {
  AUTO_CODIFY_CLICKED       = 'CashEntriesTableComponent.Event.AutoCodifyClicked',
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

  cashAccountStatusList = CashAccountStatusList;

  cashAccountStatus: FlexibleIdentifiable = null;

  filter = '';

  displayedItemsText = '';


  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionID) {
      const transactionChanged = changes.transactionID.previousValue !== changes.transactionID.currentValue;
      this.resetControls(transactionChanged);
    }

    if (changes.entries) {
      this.resetControls(false);
      this.setDataTable();
      this.setDisplayedItemsText();
    }

    if (changes.status) {
      this.buildOperationsList();
    }
  }


  get isEntryInEditionValid(): boolean {
    return !!this.rowInEdition.cashAccountEdit;
  }


  get hasData(): boolean {
    return this.dataSource.data.length > 0;
  }


  get showNotFound(): boolean {
    return !this.hasData || (this.hasData && this.dataSource.filteredData.length === 0);
  }


  onAutoCodifyClicked() {
    this.showConfirmAutoCodify();
  }


  onListControlsEvent(event: EventInfo) {
    switch (event.type as ListControlsEventType) {
      case ListControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter ?? '';
        this.applyFilter(this.cashAccountStatus?.id ?? null, this.filter);
        this.setDisplayedItemsText();
        return;
      case ListControlsEventType.STATUS_CHANGED:
        this.cashAccountStatus = event.payload.status ?? null;
        this.applyFilter(this.cashAccountStatus?.id ?? null, this.filter);
        this.setDisplayedItemsText();
        return;
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

    const cashAccountEdit = [CashAccountPendingID, CashAccountWaitingID].includes(+entry.cashAccount.uid) ?
      '' : entry.cashAccount.name;

    this.rowInEdition = { ...{}, ...entry, cashAccountEdit };
    this.editionMode = true;
  }


  onCancelEditionClicked() {
    this.editionMode = false;
    this.rowInEdition = null;
  }


  onUpdateEntryClicked() {
    if (!this.rowInEdition.cashAccountEdit) {
      return;
    }

    const command: CashEntriesOperationCommand = {
      operation: CashEntriesOperation.MarkAsCashEntries,
      entries: [this.rowInEdition.id],
      cashAccount: this.rowInEdition.cashAccountEdit,
    };

    sendEvent(this.entriesTableEvent, CashEntriesTableEventType.EXECUTE_OPERATION_CLICKED,
      { transactionID: this.transactionID, command });
  }


  private resetControls(fullReset: boolean) {
    this.clearSelection();
    this.clearFilter(fullReset);
    this.onCancelEditionClicked();
  }


  private clearSelection() {
    this.selection.clear();
  }


  private clearFilter(fullReset: boolean) {
    this.filter = '';
    if (fullReset) {
      this.cashAccountStatus = null;
    }
  }


  private setDataTable() {
    this.resetColumns();
    this.entries.forEach(x =>
      x.canEditCashFlow = [CashAccountPendingID, CashAccountWaitingID].includes(+x.cashAccount.uid)
    );
    this.dataSource = new MatTableDataSource(this.entries);
    this.dataSource.filterPredicate = this.getFilterPredicate();

    if (this.cashAccountStatus?.id !== null) {
      this.applyFilter(this.cashAccountStatus?.id, this.filter);
    }
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
      this.operationsList = [...[],
        MarkAsNoCashEntriesOperation,
        MarkAsCashEntriesWaitingOperation,
        RemoveCashEntriesOperation];
    }
  }


  private getFilterPredicate(): (data: any, filter: string) => boolean {
    return (row: CashEntry, filter: string) => {
      const { keywords, status } = JSON.parse(filter);
      const keyword = keywords.toLowerCase();

      const uid = +row.cashAccount?.uid || 0;
      const isControlStatus = [CashAccountPendingID, CashAccountWaitingID, NoCashAccountID].includes(status);

      const matchesKeyword = Object.values(row).some(value => String(value).toLowerCase().includes(keyword));
      const matchesStatus = status === WithCashAccountID ? uid > 1 : isControlStatus ? uid === status : true;

      return matchesKeyword && matchesStatus;
    };
  }


  private applyFilter(status: number, keywords: string) {
    const filterValue = { status, keywords: keywords.trim().toLowerCase() };
    this.dataSource.filter = JSON.stringify(filterValue);
  }


  private setDisplayedItemsText() {
    if (this.dataSource.filteredData.length === this.dataSource.data.length) {
      this.displayedItemsText = FormatLibrary.numberWithCommas(this.dataSource.data.length) +
        ' registros encontrados';
    } else {
      this.displayedItemsText = FormatLibrary.numberWithCommas(this.dataSource.filteredData.length) +
        ' de ' + FormatLibrary.numberWithCommas(this.dataSource.data.length) + ' registros mostrados';
    }
  }


  private showConfirmAutoCodify() {
    const message = `Esta operación ejecutará el proceso de codificación automática sobre todos los movimientos pendientes.
      <br><br>¿Ejecuto el proceso de codificación automática?`;

    this.messageBox.confirm(message, 'Codificación automática')
      .firstValue()
      .then(x => sendEventIf(x, this.entriesTableEvent, CashEntriesTableEventType.AUTO_CODIFY_CLICKED));
  }

}
