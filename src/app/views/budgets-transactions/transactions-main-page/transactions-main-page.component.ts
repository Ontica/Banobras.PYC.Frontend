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

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransactionData, BudgetTransactionDescriptor, BudgetTransactionsQuery,
         EmptyBudgetTransactionData, EmptyBudgetTransactionsQuery,
         mapBudgetTransactionDescriptorFromTransaction } from '@app/models';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';

import { TransactionTabbedViewEventType } from '../transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-bdg-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class BudgetTransactionsMainPageComponent {

  query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  dataList: BudgetTransactionDescriptor[] = [];

  selectedData: BudgetTransactionData = EmptyBudgetTransactionData;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private budgetTransactionsData: BudgetTransactionsDataService,
              private messageBox: MessageBoxService) { }


  onTransactionsExplorerEvent(event: EventInfo) {
    switch (event.type as TransactionsExplorerEventType) {
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
        this.setSelectedData(EmptyBudgetTransactionData);
        return;
      case TransactionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as BudgetTransactionData);
        return;
      case TransactionTabbedViewEventType.DATA_DELETED:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        this.removeItemFromList(event.payload.transactionUID);
        return;
      case TransactionTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.transactionUID, 'event.payload.transactionUID');
        this.getTransaction(event.payload.transactionUID);
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


  private getTransaction(transactionUID: string) {
    this.isLoadingSelection = true;

    this.budgetTransactionsData.getTransaction(transactionUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearExplorerData(query: BudgetTransactionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
  }


  private setDataList(data: BudgetTransactionDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: BudgetTransactionData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.transaction);
  }


  private insertItemToList(data: BudgetTransactionData) {
    const dataToInsert = mapBudgetTransactionDescriptorFromTransaction(data.transaction);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }


  private removeItemFromList(transactionUID: string) {
    const dataListNew = this.dataList.filter(x => x.uid !== transactionUID);
    this.setDataList(dataListNew);
    this.setSelectedData(EmptyBudgetTransactionData);
  }

}
