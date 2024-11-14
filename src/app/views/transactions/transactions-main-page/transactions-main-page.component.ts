/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BudgetTransactionsDataService, FixedAssetTransactionsDataService } from '@app/data-services';

import { BudgetTransactionData, BudgetTransactionDescriptor, BudgetTransactionsQuery,
         EmptyBudgetTransactionData, EmptyBudgetTransactionsQuery, FixedAssetTransactionDescriptor,
         FixedAssetTransactionsQuery, mapTransactionDescriptorFromTransaction } from '@app/models';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';

import { TransactionTabbedViewEventType } from '../budget/transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-bdg-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class TransactionsMainPageComponent implements OnInit, OnDestroy {

  queryType: 'budgets' | 'fixed-assets' = 'budgets';

  query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  dataList: BudgetTransactionDescriptor[] | FixedAssetTransactionDescriptor[] = [];

  selectedData: BudgetTransactionData = EmptyBudgetTransactionData;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private budgetTransactionsData: BudgetTransactionsDataService,
              private fixedAssetTransactionsData: FixedAssetTransactionsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscribeToCurrentViewChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onTransactionsExplorerEvent(event: EventInfo) {
    switch (event.type as TransactionsExplorerEventType) {
      case TransactionsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as BudgetTransactionsQuery);
        this.validateSearchTransaction(this.query);
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
        this.setSelectedData(EmptyBudgetTransactionData);
        return;
      case TransactionTabbedViewEventType.DATA_UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as BudgetTransactionData);
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


  private subscribeToCurrentViewChanges() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setQueryTypeFromCurrentView(x));
  }


  private setQueryTypeFromCurrentView(newView: View) {
    switch (newView.name) {
      case 'Budget.Transactions':
        this.queryType = 'budgets';
        return;
      case 'FixedAssets.Transactions':
        this.queryType = 'fixed-assets';
        return;
      default:
        this.queryType = null;
        return;
    }
  }


  private validateSearchTransaction(query: BudgetTransactionsQuery | FixedAssetTransactionsQuery){
    switch (this.queryType) {
      case 'budgets':
        this.searchTransactions(query as BudgetTransactionsQuery);
        return;
      case 'fixed-assets':
        this.searchFixedAssetTransactions(query as FixedAssetTransactionsQuery);
        return;
      default:
        return;
    }
  }


  private searchTransactions(query: BudgetTransactionsQuery) {
    this.isLoading = true;

    this.budgetTransactionsData.searchTransactions(query)
      .firstValue()
      .then(x => this.resolveSearchTransactions(x))
      .finally(() => this.isLoading = false);
  }


  private searchFixedAssetTransactions(query: FixedAssetTransactionsQuery) {
    this.isLoading = true;

    this.fixedAssetTransactionsData.searchTransactions(query)
      .firstValue()
      .then(x => this.resolveSearchTransactions(x))
      .finally(() => this.isLoading = false);
  }


  private getTransactionData(transactionUID: string) {
    this.isLoadingSelection = true;

    this.budgetTransactionsData.getTransactionData(transactionUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(transactionUID: string) {
    this.getTransactionData(transactionUID);
  }


  private resolveSearchTransactions(data: BudgetTransactionDescriptor[] | FixedAssetTransactionDescriptor[]) {
    this.setDataList(data, true);
  }


  private setQueryAndClearExplorerData(query: BudgetTransactionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
  }


  private setDataList(data: BudgetTransactionDescriptor[] | FixedAssetTransactionDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: BudgetTransactionData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.transaction);
  }


  private insertItemToList(data: BudgetTransactionData) {
    const dataToInsert = mapTransactionDescriptorFromTransaction(data);
    const dataListNew = ArrayLibrary.insertItemTop(this.dataList, dataToInsert, 'uid');
    this.setDataList(dataListNew);
    this.setSelectedData(data);
  }

}
