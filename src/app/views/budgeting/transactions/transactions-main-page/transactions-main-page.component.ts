/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BudgetTransactionsDataService } from '@app/data-services';

import { BudgetTransaction, BudgetTransactionDescriptor, BudgetTransactionsQuery,
         EmptyBudgetTransactionsQuery } from '@app/models';

import { TransactionsExplorerEventType } from '../transactions-explorer/transactions-explorer.component';


@Component({
  selector: 'emp-bdg-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
})
export class TransactionsMainPageComponent {

  query: BudgetTransactionsQuery = Object.assign({}, EmptyBudgetTransactionsQuery);

  dataList: BudgetTransactionDescriptor[] = [];

  selectedData: BudgetTransaction = null;

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


  private searchTransactions(query: BudgetTransactionsQuery) {
    this.isLoading = true;

    this.budgetTransactionsData.searchTransactions(query)
      .firstValue()
      .then(x => this.resolveSearchTransactions(x))
      .finally(() => this.isLoading = false);
  }



  private getTransaction(transactionUID: string) {
    this.messageBox.showInDevelopment('Detalle de transacción', transactionUID);
  }


  private resolveSearchTransactions(data: BudgetTransactionDescriptor[]) {
    this.setDataList(data, true);
  }


  private setQueryAndClearExplorerData(query: BudgetTransactionsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
  }


  private setDataList(data: BudgetTransactionDescriptor[], queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }

}
