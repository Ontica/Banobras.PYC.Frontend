/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ArrayLibrary } from '@app/shared/utils';

import { AssetsTransactionsDataService } from '@app/data-services';

import { EmptyAssetsTransactionHolder, EmptyAssetsTransactionsQuery, AssetsTransactionHolder,
         AssetsTransactionDescriptor, AssetsTransactionsQuery,
         mapAssetsTransactionDescriptorFromTransaction } from '@app/models';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';

import { TransactionTabbedViewEventType } from '../transaction-tabbed-view/transaction-tabbed-view.component';

import { TransactionCreatorEventType } from '../transaction/transaction-creator.component';


@Component({
  selector: 'emp-inv-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class AssetsTransactionsMainPageComponent  {

  query: AssetsTransactionsQuery = Object.assign({}, EmptyAssetsTransactionsQuery);

  dataList: AssetsTransactionDescriptor[] = [];

  selectedData: AssetsTransactionHolder = EmptyAssetsTransactionHolder;

  fileUrl = '';

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private transactionsData: AssetsTransactionsDataService,
              private messageBox: MessageBoxService) { }


  onTransactionCreatorEvent(event: EventInfo) {
    switch (event.type as TransactionCreatorEventType) {
      case TransactionCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayCreator = false;
        return;
      case TransactionCreatorEventType.CREATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.displayCreator = false;
        this.insertItemToList(event.payload.data as AssetsTransactionHolder);
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
        this.setQueryAndClearExplorerData(event.payload.query as AssetsTransactionsQuery);
        this.searchTransactions(this.query);
        return;
      case TransactionsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as AssetsTransactionsQuery);
        return;
      case TransactionsExplorerEventType.EXPORT_CLICKED:
        this.exportTransactions(this.query);
        return;
      case TransactionsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
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


  onTransactionTabbedViewEvent(event: EventInfo) {
    switch (event.type as TransactionTabbedViewEventType) {
      case TransactionTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyAssetsTransactionHolder);
        return;
      case TransactionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as AssetsTransactionHolder);
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


  private searchTransactions(query: AssetsTransactionsQuery) {
    this.isLoading = true;

    this.transactionsData.searchAssetsTransactions(query)
      .firstValue()
      .then(x => this.resolveSearchTransactions(x))
      .finally(() => this.isLoading = false);
  }


  private exportTransactions(query: AssetsTransactionsQuery) {
    this.transactionsData.exportAssetsTransactions(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private getTransaction(transactionUID: string) {
    this.isLoadingSelection = true;

    this.transactionsData.getAssetsTransaction(transactionUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveSearchTransactions(data: AssetsTransactionDescriptor[]) {
    this.setDataList(data, true);
  }


  private refreshSelectedData(transactionUID: string) {
    this.getTransaction(transactionUID);
  }


  private setQueryAndClearExplorerData(query: AssetsTransactionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyAssetsTransactionHolder);
  }


  private setDataList(data: AssetsTransactionDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: AssetsTransactionHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.transaction);
  }


  private insertItemToList(data: AssetsTransactionHolder) {
    const dataToInsert = mapAssetsTransactionDescriptorFromTransaction(data.transaction);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(transactionUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== transactionUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyAssetsTransactionHolder);
  }

}
