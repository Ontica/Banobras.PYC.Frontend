/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransactionDescriptor, BudgetTransactionHolder, BudgetTransactionsQuery,
         EmptyBudgetTransactionHolder, EmptyBudgetTransactionsQuery, EmptyExplorerBulkOperationData,
         ExplorerBulkOperationData, ExplorerOperationCommand, ExplorerOperationResult, ExplorerOperationType,
         mapBudgetTransactionDescriptorFromTransaction } from '@app/models';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';

import { TransactionCreatorEventType } from '../transaction/transaction-creator.component';

import { TransactionTabbedViewEventType } from '../transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-bdg-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class BudgetTransactionsMainPageComponent {

  query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  dataList: BudgetTransactionDescriptor[] = [];

  selectedData: BudgetTransactionHolder = EmptyBudgetTransactionHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  displayExportModal = false;

  selectedExportData: ExplorerBulkOperationData = Object.assign({}, EmptyExplorerBulkOperationData);


  constructor(private budgetTransactionsData: BudgetTransactionsDataService) { }


  onTransactionCreatorEvent(event: EventInfo) {
    switch (event.type as TransactionCreatorEventType) {
      case TransactionCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case TransactionCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.insertItemToList(event.payload.data as BudgetTransactionHolder);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionsExplorerEvent(event: EventInfo) {
    switch (event.type as TransactionsExplorerEventType) {
      case TransactionsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        return;
      case TransactionsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as BudgetTransactionsQuery);
        this.searchTransactions(this.query);
        return;
      case TransactionsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as BudgetTransactionsQuery);
        return;
      case TransactionsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.validateBulkOperationTransactions(event.payload.operation as ExplorerOperationType,
                                               event.payload.command as ExplorerOperationCommand);
        return;
      case TransactionsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.transaction, ' event.payload.transaction');
        Assertion.assertValue(event.payload.transaction.uid, 'event.payload.transaction.uid');
        this.getTransaction(event.payload.transaction.uid);
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
        this.bulkOperationTransactions(this.selectedExportData.operation, this.selectedExportData.command);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionTabbedViewEvent(event: EventInfo) {
    switch (event.type as TransactionTabbedViewEventType) {
      case TransactionTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyBudgetTransactionHolder);
        return;
      case TransactionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as BudgetTransactionHolder);
        return;
      case TransactionTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        this.removeItemFromList(event.payload.transactionUID);
        return;
      case TransactionTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        this.refreshSelectedData(event.payload.transactionUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchTransactions(query: BudgetTransactionsQuery) {
    this.isLoading = true;

    this.budgetTransactionsData.searchTransactions(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private bulkOperationTransactions(operation: ExplorerOperationType, command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.budgetTransactionsData.bulkOperationTransactions(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationTransactionsResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getTransaction(transactionUID: string, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.budgetTransactionsData.getTransaction(transactionUID)
      .firstValue()
      .then(x => this.resolveGetTransaction(x, refresh))
      .catch(e => this.setSelectedData(EmptyBudgetTransactionHolder))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveGetTransaction(data: BudgetTransactionHolder, refresh: boolean = false) {
    this.setSelectedData(data);

    if (refresh) {
      this.insertItemToList(data);
    }
  }


  private setQueryAndClearExplorerData(query: BudgetTransactionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyBudgetTransactionHolder);
  }


  private setDataList(data: BudgetTransactionDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: BudgetTransactionHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.transaction);
  }


  private refreshSelectedData(transactionUID: string) {
    this.getTransaction(transactionUID, true);
  }


  private insertItemToList(data: BudgetTransactionHolder) {
    const dataToInsert = mapBudgetTransactionDescriptorFromTransaction(data.transaction);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(transactionUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== transactionUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyBudgetTransactionHolder);
  }


  private validateBulkOperationTransactions(operation: ExplorerOperationType, command: ExplorerOperationCommand) {
    switch (operation) {
      case ExplorerOperationType.excelEntries:
        this.showExportTransactionsEntries(operation, command);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private showExportTransactionsEntries(operation: ExplorerOperationType, command: ExplorerOperationCommand) {
    let title = '';
    let message = '';

    switch (operation) {
      case ExplorerOperationType.excelEntries:
        title = 'Exportar los movimientos de las transacciones';
        message = `Esta operación exportará los movimientos de las ` +
          `<strong> ${command.items.length} transacciones</strong> seleccionadas.` +
          `<br><br>¿Exporto los movimientos de las transacciones?`;
        break;
      default:
        console.log(`Unhandled export transactions operation type ${operation}`);
        return;
    }

    this.setDisplayExportModal(true, operation, command, title, message);
  }


  private setDisplayExportModal(display: boolean,
                                operation?: ExplorerOperationType, command?: ExplorerOperationCommand,
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


  private resolveBulkOperationTransactionsResponse(operation: ExplorerOperationType,
                                                   result: ExplorerOperationResult) {
    switch (operation) {
      case ExplorerOperationType.excelEntries:
        this.resolveExportTransactionsEntries(result);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private resolveExportTransactionsEntries(result: ExplorerOperationResult) {
    this.selectedExportData.fileUrl = result.file.url;
    this.selectedExportData.message = result.message;
  }

}
