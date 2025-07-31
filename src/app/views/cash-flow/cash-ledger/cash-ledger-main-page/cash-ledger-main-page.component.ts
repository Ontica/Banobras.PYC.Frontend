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

import { CashTransactionDescriptor, CashTransactionHolder, CashLedgerQuery, EmptyCashTransactionHolder,
         EmptyCashLedgerQuery } from '@app/models';

import { CashLedgerExplorerEventType } from '../cash-ledger-explorer/cash-ledger-explorer.component';

import {
  CashTransactionTabbedViewEventType
} from '../cash-transaction-tabbed-view/transaction-tabbed-view.component';


@Component({
  selector: 'emp-cf-cash-ledger-main-page',
  templateUrl: './cash-ledger-main-page.component.html',
})
export class CashLedgerMainPageComponent {

  query: CashLedgerQuery = Object.assign({}, EmptyCashLedgerQuery);

  dataList: CashTransactionDescriptor[] = [];

  selectedData: CashTransactionHolder = EmptyCashTransactionHolder;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private cashLedgerData: CashLedgerDataService,
              private messageBox: MessageBoxService) { }


  onCashLedgerExplorerEvent(event: EventInfo) {
    switch (event.type as CashLedgerExplorerEventType) {
      case CashLedgerExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as CashLedgerQuery);
        this.searchCashLedger(this.query);
        return;
      case CashLedgerExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as CashLedgerQuery);
        return;
      case CashLedgerExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.items, 'event.payload.command.items');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      case CashLedgerExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.id, 'event.payload.item.id');
        this.getCashTransaction(event.payload.item.id);
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
        return;
      case CashTransactionTabbedViewEventType.UPDATED:
        Assertion.assertValue(event.payload.data, 'event.payload.data');
        this.insertItemToList(event.payload.data as CashTransactionHolder);
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


  private searchCashLedger(query: CashLedgerQuery) {
    this.isLoading = true;

    this.cashLedgerData.searchCashLedger(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
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


  private setQueryAndClearExplorerData(query: CashLedgerQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyCashTransactionHolder);
  }


  private setDataList(data: CashTransactionDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: CashTransactionHolder) {
    this.selectedData = data;
    this.displayTabbedView = this.selectedData && this.selectedData.transaction.id > 0;
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

}
