/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { BillsDataService } from '@app/data-services';

import { BillData, BillDescriptor, BillsDataTable, BillsQuery, EmptyBillData, EmptyBillsDataTable,
         EmptyBillsQuery } from '@app/models';

import { BillsExplorerEventType } from '../bills-explorer/bills-explorer.component';

import { BillTabbedViewEventType } from '../bill-tabbed-view/bill-tabbed-view.component';


@Component({
  selector: 'emp-ng-bills-main-page',
  templateUrl: './bills-main-page.component.html',
})
export class BillsMainPageComponent {

  query: BillsQuery = Object.assign({}, EmptyBillsQuery);

  dataList: BillsDataTable = Object.assign({}, EmptyBillsDataTable);

  selectedData: BillData = EmptyBillData;

  displayTabbedView = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private billsData: BillsDataService,
              private messageBox: MessageBoxService) { }


  onBillsExplorerEvent(event: EventInfo) {
    switch (event.type as BillsExplorerEventType) {
      case BillsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as BillsQuery);
        this.searchBills(this.query);
        return;
      case BillsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as BillsQuery);
        return;
      case BillsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getBillData(event.payload.item.uid);
        return;
      case BillsExplorerEventType.EXECUTE_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.messageBox.showInDevelopment('Ejecutar operación', event.payload);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBillTabbedViewEvent(event: EventInfo) {
    switch (event.type as BillTabbedViewEventType) {
      case BillTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyBillData);
        return;
      case BillTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.billUID, 'event.payload.billUID');
        this.refreshSelectedData(event.payload.billUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchBills(query: BillsQuery) {
    this.isLoading = true;

    this.billsData.searchBills(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private getBillData(billUID: string) {
    this.isLoadingSelection = true;

    this.billsData.getBillData(billUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .finally(() => this.isLoadingSelection = false);
  }


  private refreshSelectedData(billUID: string) {
    this.getBillData(billUID);
  }


  private setQueryAndClearExplorerData(query: BillsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyBillData);
  }


  private setDataList(data: BillDescriptor[], queryExecuted: boolean = true) {
    this.dataList = Object.assign({}, this.dataList, { query: this.query, entries: data });
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: BillData) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.bill);
  }

}
