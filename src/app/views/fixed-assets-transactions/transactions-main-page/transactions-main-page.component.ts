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

import { FixedAssetTransactionsDataService } from '@app/data-services';

import { EmptyFixedAssetTransactionData, EmptyFixedAssetTransactionsQuery, FixedAssetTransactionData,
         FixedAssetTransactionDescriptor, FixedAssetTransactionsQuery,
         mapFixedAssetTransactionDescriptorFromTransaction } from '@app/models';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';

import { TransactionTabbedViewEventType } from '../transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-fa-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class FixedAssetTransactionsMainPageComponent  {

  query: FixedAssetTransactionsQuery = Object.assign({}, EmptyFixedAssetTransactionsQuery);

  dataList: FixedAssetTransactionDescriptor[] = [];

  selectedData: FixedAssetTransactionData = EmptyFixedAssetTransactionData;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private fixedAssetTransactionsData: FixedAssetTransactionsDataService,
              private messageBox: MessageBoxService) { }



  onTransactionsExplorerEvent(event: EventInfo) {
    switch (event.type as TransactionsExplorerEventType) {
      case TransactionsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FixedAssetTransactionsQuery);
        this.searchTransactions(this.query);
        return;
      case TransactionsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FixedAssetTransactionsQuery);
        return;
      case TransactionsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      case TransactionsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.transaction, ' event.payload.transaction');
        Assertion.assertValue(event.payload.transaction.uid, 'event.payload.transaction.uid');
        this.getTransactionData(event.payload.transaction.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionTabbedViewEvent(event: EventInfo) {
    switch (event.type as TransactionTabbedViewEventType) {
      case TransactionTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyFixedAssetTransactionData);
        return;
      case TransactionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as FixedAssetTransactionData);
        return;
      case TransactionTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');

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


  private searchTransactions(query: FixedAssetTransactionsQuery) {
    this.isLoading = true;

    this.fixedAssetTransactionsData.searchTransactions(query)
      .firstValue()
      .then(x => this.resolveSearchTransactions(x))
      .finally(() => this.isLoading = false);
  }


  private getTransactionData(transactionUID: string) {
    this.isLoadingSelection = true;

    this.fixedAssetTransactionsData.getTransactionData(transactionUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(transactionUID: string) {
    this.getTransactionData(transactionUID);
  }


  private resolveSearchTransactions(data: FixedAssetTransactionDescriptor[]) {
    this.setDataList(data, true);
  }


  private setQueryAndClearExplorerData(query: FixedAssetTransactionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyFixedAssetTransactionData);
  }


  private setDataList(data: FixedAssetTransactionDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FixedAssetTransactionData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.transaction);
  }


  private insertItemToList(data: FixedAssetTransactionData) {
    const dataToInsert = mapFixedAssetTransactionDescriptorFromTransaction(data);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }

}
