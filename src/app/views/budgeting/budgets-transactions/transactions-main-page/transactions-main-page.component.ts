/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { ArrayLibrary } from '@app/shared/utils';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransactionDescriptor, BudgetTransactionHolder, BudgetTransactionsOperationType,
         BudgetTransactionsQuery, EmptyBudgetTransactionHolder, EmptyBudgetTransactionsQuery,
         EmptyExplorerBulkOperationData, ExplorerBulkOperationData, ExplorerOperationCommand,
         ExplorerOperationResult, mapBudgetTransactionDescriptorFromTransaction,
         TransactionStages } from '@app/models';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';

import { TransactionsImporterEventType } from '../transactions-importer/transactions-importer.component';

import { TransactionCreatorEventType } from '../transaction/transaction-creator.component';

import { TransactionTabbedViewEventType } from '../transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-bdg-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class BudgetTransactionsMainPageComponent implements OnInit,OnDestroy {

  helper: SubscriptionHelper;

  query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  dataList: BudgetTransactionDescriptor[] = [];

  selectedData: BudgetTransactionHolder = EmptyBudgetTransactionHolder;

  displayTabbedView = false;

  displayCreator = false;

  displayImporter = false;

  displayExportModal = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  selectedExportData: ExplorerBulkOperationData = Object.assign({}, EmptyExplorerBulkOperationData);


  constructor(private uiLayer: PresentationLayer,
              private transactionsData: BudgetTransactionsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToCurrentViewChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }

  onTransactionsImporterEvent(event: EventInfo) {
    switch (event.type as TransactionsImporterEventType) {
      case TransactionsImporterEventType.CLOSE_MODAL_CLICKED:
        this.displayImporter = false;
        return;
      case TransactionsImporterEventType.DATA_IMPORTED:
        // TODO: define what to do after import data
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


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
      case TransactionsExplorerEventType.IMPORT_CLICKED:
        this.displayImporter = true;
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
        this.validateBulkOperationTransactions(event.payload.operation as BudgetTransactionsOperationType,
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


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setTransactionStageFromCurrentView(x));
  }


  private setTransactionStageFromCurrentView(view: View) {
    switch (view.name) {
      case 'Budget.ControlDesk':
        this.setInitQueryStage(TransactionStages.ControlDesk);
        return;
      case 'Budget.Transactions':
      default:
        this.setInitQueryStage(TransactionStages.MyInbox);
        return;
    }
  }


  private setInitQueryStage(stage: TransactionStages) {
    this.query = Object.assign({}, this.query, { stage });
  }


  private searchTransactions(query: BudgetTransactionsQuery) {
    this.isLoading = true;

    this.transactionsData.searchTransactions(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private bulkOperationTransactions(operation: BudgetTransactionsOperationType,
                                    command: ExplorerOperationCommand) {
    this.isLoadingSelection = true;

    this.transactionsData.bulkOperationTransactions(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationTransactionsResponse(operation, x))
      .finally(() => this.isLoadingSelection = false);
  }


  private getTransaction(transactionUID: string, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.transactionsData.getTransaction(transactionUID)
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


  private validateBulkOperationTransactions(operation: BudgetTransactionsOperationType,
                                            command: ExplorerOperationCommand) {
    switch (operation) {
      case BudgetTransactionsOperationType.exportEntriesGrouped:
      case BudgetTransactionsOperationType.exportEntriesUngrouped:
        this.showExportTransactionsEntries(operation, command);
        return;
      default:
        console.log(`Unhandled user interface event ${operation}`);
        return;
    }
  }


  private showExportTransactionsEntries(operation: BudgetTransactionsOperationType,
                                        command: ExplorerOperationCommand) {
    let title = '';
    let message = '';

    switch (operation) {
      case BudgetTransactionsOperationType.exportEntriesGrouped:
        title = 'Exportar los movimientos agrupados por mes';
        message = `Esta operación exportará los movimientos de las ` +
          `<strong> ${command.items.length} transacciones</strong> seleccionadas agrupados por mes.` +
          `<br><br>¿Exporto los movimientos de las transacciones?`;
        break;
      case BudgetTransactionsOperationType.exportEntriesUngrouped:
        title = 'Exportar movimientos sin agrupar';
        message = `Esta operación exportará los movimientos de las ` +
          `<strong> ${command.items.length} transacciones</strong> seleccionadas sin agrupar.` +
          `<br><br>¿Exporto los movimientos de las transacciones?`;
        break;
      default:
        console.log(`Unhandled export transactions operation type ${operation}`);
        return;
    }

    this.setDisplayExportModal(true, operation, command, title, message);
  }


  private setDisplayExportModal(display: boolean,
                                operation?: BudgetTransactionsOperationType,
                                command?: ExplorerOperationCommand,
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


  private resolveBulkOperationTransactionsResponse(operation: BudgetTransactionsOperationType,
                                                   result: ExplorerOperationResult) {
    switch (operation) {
      case BudgetTransactionsOperationType.exportEntriesGrouped:
      case BudgetTransactionsOperationType.exportEntriesUngrouped:
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
