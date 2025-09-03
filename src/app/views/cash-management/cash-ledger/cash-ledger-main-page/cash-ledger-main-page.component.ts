/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { CashLedgerDataService } from '@app/data-services';

import { CashAccountStatus, CashLedgerDescriptor, CashLedgerOperationType, CashLedgerQuery,
         CashLedgerQueryType, CashTransactionHolder, EmptyCashLedgerQuery, EmptyCashTransactionHolder,
         EmptyExplorerBulkOperationData, ExplorerBulkOperationData, ExplorerOperationCommand,
         ExplorerOperationResult } from '@app/models';

import { CashLedgerExplorerEventType } from '../cash-ledger-explorer/cash-ledger-explorer.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import {
  CashTransactionTabbedViewEventType
} from '../cash-transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-cf-cash-ledger-main-page',
  templateUrl: './cash-ledger-main-page.component.html',
})
export class CashLedgerMainPageComponent {

  queryType: CashLedgerQueryType = CashLedgerQueryType.transactions;

  query: CashLedgerQuery = Object.assign({}, EmptyCashLedgerQuery);

  queryCashAccountStatus: CashAccountStatus = null;

  dataList: CashLedgerDescriptor[] = [];

  selectedData: CashTransactionHolder = EmptyCashTransactionHolder;

  selectedID = null;

  displayTabbedView = false;

  expandTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  displayExportModal = false;

  selectedExportData: ExplorerBulkOperationData = Object.assign({}, EmptyExplorerBulkOperationData);


  constructor(private cashLedgerData: CashLedgerDataService,
              private messageBox: MessageBoxService) { }


  get isQueryTypeEntries(): boolean {
    return this.queryType === CashLedgerQueryType.entries;
  }


  onCashLedgerExplorerEvent(event: EventInfo) {
    switch (event.type as CashLedgerExplorerEventType) {
      case CashLedgerExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.queryType as CashLedgerQueryType,
                                          event.payload.query as CashLedgerQuery);
        if (this.queryType === CashLedgerQueryType.transactions) {
          this.searchCashTransactions(this.query);
        } else {
          this.searchCashEntries(this.query);
        }
        return;
      case CashLedgerExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        this.setQueryAndClearExplorerData(event.payload.queryType as CashLedgerQueryType,
                                          event.payload.query as CashLedgerQuery);
        return;
      case CashLedgerExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.validateBulkOperation(event.payload.operation,
                                   event.payload.command);
        return;
      case CashLedgerExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');

        const itemId = this.queryType === CashLedgerQueryType.transactions ?
          event.payload.item.id : event.payload.item.transactionId;

        Assertion.assertValue(itemId, 'itemId');

        this.selectedID = event.payload.item.id ?? null;
        this.getCashTransaction(itemId);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;
      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        if (this.queryType === CashLedgerQueryType.transactions) {
          this.bulkOperationCashTransactions(this.selectedExportData.operation, this.selectedExportData.command);
        } else {
          this.bulkOperationCashEntries(this.selectedExportData.operation, this.selectedExportData.command);
        }
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCashTransactionTabbedViewEvent(event: EventInfo) {
    switch (event.type as CashTransactionTabbedViewEventType) {
      case CashTransactionTabbedViewEventType.CLOSE:
        this.setSelectedData(EmptyCashTransactionHolder);
        this.resetExpandTabbedView();
        return;
      case CashTransactionTabbedViewEventType.EXPAND:
        this.setExpandTabbedView();
        return;
      case CashTransactionTabbedViewEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        if (this.queryType === CashLedgerQueryType.transactions) {
          this.insertItemToList(event.payload.data as CashTransactionHolder);
        } else {
          this.refreshData(event.payload.data);
        }
        return;
      case CashTransactionTabbedViewEventType.REFRESH:
        Assertion.assertValue(event.payload.dataID, 'event.payload.dataID');
        this.refreshSelectedData(event.payload.dataID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchCashTransactions(query: CashLedgerQuery) {
    this.isLoading = true;

    this.cashLedgerData.searchCashTransactions(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private searchCashEntries(query: CashLedgerQuery) {
    this.isLoading = true;

    this.cashLedgerData.searchCashEntries(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private bulkOperationCashTransactions(operation: CashLedgerOperationType,
                                        command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.cashLedgerData.bulkOperationCashTransactions(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private bulkOperationCashEntries(operation: CashLedgerOperationType,
                                   command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.cashLedgerData.bulkOperationCashEntries(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getCashTransaction(dataID: number, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.cashLedgerData.getCashTransaction(dataID)
      .firstValue()
      .then(x => this.resolveGetCashTransaction(x, refresh))
      .catch(e => this.setSelectedData(EmptyCashTransactionHolder))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveGetCashTransaction(data: CashTransactionHolder, refresh: boolean = false) {
    this.setSelectedData(data);
    if (refresh) {
      this.insertItemToList(data);
    }
  }


  private resolveBulkOperationResponse(operation: CashLedgerOperationType,
                                       result: ExplorerOperationResult) {
    switch (operation) {
      case CashLedgerOperationType.autoCodify:
        this.messageBox.show(result.message, 'Codificación automática');
        this.refreshData();
        this.setSelectedData(EmptyCashTransactionHolder);
        this.resetExpandTabbedView();
        return;
      case CashLedgerOperationType.exportEntries:
      case CashLedgerOperationType.exportTotales:
      case CashLedgerOperationType.exportAnalysis:
      case CashLedgerOperationType.export:
        this.resolveExportOperation(result);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveExportOperation(result: ExplorerOperationResult) {
    this.selectedExportData.fileUrl = result.file.url;
    this.selectedExportData.message = result.message;
  }


  private setQueryAndClearExplorerData(queryType: CashLedgerQueryType, query: CashLedgerQuery) {
    this.queryType = queryType;
    this.query = Object.assign({}, query);
    this.queryCashAccountStatus = this.isQueryTypeEntries ? this.query.cashAccountStatus ?? null : null;
    this.setDataList([], false);
    this.setSelectedData(EmptyCashTransactionHolder);
    this.resetExpandTabbedView();
  }


  private setDataList(data: CashLedgerDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;

    if (this.isQueryTypeEntries && this.selectedID && !this.dataList.some(x => x.id === this.selectedID)) {
      this.selectedID = null;
    }
  }


  private setSelectedData(data: CashTransactionHolder) {
    this.selectedData = data;
    this.displayTabbedView = this.selectedData && this.selectedData.transaction.id > 0;
    if (!this.displayTabbedView) {
      this.selectedID = null;
    }
  }


  private refreshData(selectedData: CashTransactionHolder = EmptyCashTransactionHolder) {
    if (this.queryType === CashLedgerQueryType.transactions) {
      this.searchCashTransactions(this.query);
    } else {
      this.searchCashEntries(this.query);
    }

    this.setSelectedData(selectedData);
  }


  private refreshSelectedData(dataID: number) {
    this.getCashTransaction(dataID, true);
  }


  private insertItemToList(data: CashTransactionHolder) {
    const dataToInsert = data.transaction;
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'id');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private setExpandTabbedView(){
    this.expandTabbedView = !this.expandTabbedView;
  }


  private resetExpandTabbedView() {
    this.expandTabbedView = false;
  }


  private validateBulkOperation(operation: CashLedgerOperationType,
                                command: ExplorerOperationCommand) {
    switch (operation) {
      case CashLedgerOperationType.autoCodify:
        this.bulkOperationCashTransactions(operation, command);
        return;
      case CashLedgerOperationType.exportEntries: {
        const title = `Exportar movimientos`;
        const message = `Esta operación exportará los movimientos de las ` +
          `<strong>${command.items.length} pólizas</strong> seleccionadas.` +
          `<br><br>¿Exporto los movimientos?`;
        this.setDisplayExportModal(true, operation, command, title, message);
        return;
      }
      case CashLedgerOperationType.exportTotales: {
        const title = `Exportar totales`;
        const message = `Esta operación exportará los totales de las ` +
          `<strong>${command.items.length} pólizas</strong> seleccionadas.` +
          `<br><br>¿Exporto los totales?`;
        this.setDisplayExportModal(true, operation, command, title, message);
        return;
      }
      case CashLedgerOperationType.exportAnalysis: {
        const title = `Exportar análisis de la codificación`;
        const message = `Esta operación exportará el análisis de la codificación de las ` +
          `<strong>${command.items.length} pólizas</strong> seleccionadas.` +
          `<br><br>¿Exporto el análisis?`;
        this.setDisplayExportModal(true, operation, command, title, message);
        return;
      }
      case CashLedgerOperationType.export: {
        const title = `Exportar movimientos`;
        const message = `Esta operación exportará los ` +
          `<strong>${command.items.length} movimientos</strong> seleccionados.` +
          `<br><br>¿Exporto los movimientos?`;
        this.setDisplayExportModal(true, operation, command, title, message);
        return;
      }
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private setDisplayExportModal(display: boolean,
                                operation?: CashLedgerOperationType, command?: ExplorerOperationCommand,
                                title?: string, message?: string) {
    this.displayExportModal = display;
    this.selectedExportData = {
      operation: operation ?? null,
      command: command ?? null,
      title: title ?? null,
      message: message ?? null,
      fileUrl: '',
    };
  }
}
