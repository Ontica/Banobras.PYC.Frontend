/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the account root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FinancialAccountsDataService } from '@app/data-services';

import { EmptyFinancialAccountHolder, EmptyFinancialAccountsQuery, FinancialAccountDescriptor,
         FinancialAccountHolder, FinancialAccountsQuery  } from '@app/models';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { AccountsExplorerEventType } from '../accounts-explorer/accounts-explorer.component';

import { AccountTabbedViewEventType } from '../account-tabbed-view/account-tabbed-view.component';


@Component({
  selector: 'emp-cf-account-main-page',
  templateUrl: './accounts-main-page.component.html',
})
export class FinancialAccountsMainPageComponent {

  query: FinancialAccountsQuery = Object.assign({}, EmptyFinancialAccountsQuery);

  dataList: FinancialAccountDescriptor[] = [];

  selectedData: FinancialAccountHolder = EmptyFinancialAccountHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;

  displayExportModal = false;

  fileUrl = '';


  constructor(private accountsData: FinancialAccountsDataService) { }


  onAccountsExplorerEvent(event: EventInfo) {
    switch (event.type as AccountsExplorerEventType) {
      case AccountsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FinancialAccountsQuery);
        this.searchAccounts(this.query);
        return;
      case AccountsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as FinancialAccountsQuery);
        return;
      case AccountsExplorerEventType.EXPORT_CLICKED:
        this.setDisplayExportModal(true);
        return;
      case AccountsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getAccount(event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountTabbedViewEvent(event: EventInfo) {
    switch (event.type as AccountTabbedViewEventType) {
      case AccountTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyFinancialAccountHolder);
        return;
      case AccountTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.refreshSelectedData(event.payload.dataUID);
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
        this.exportAccounts(this.query);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchAccounts(query: FinancialAccountsQuery) {
    this.isLoading = true;

    this.accountsData.searchAccounts(query)
      .firstValue()
      .then(x => this.setDataList(x, true))
      .finally(() => this.isLoading = false);
  }


  private exportAccounts(query: FinancialAccountsQuery) {
    this.accountsData.exportAccounts(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private getAccount(accountUID: string) {
    this.isLoadingSelection = true;

    this.accountsData.getAccount(accountUID)
      .firstValue()
      .then(x => this.setSelectedData(x))
      .catch(e => this.setSelectedData(EmptyFinancialAccountHolder))
      .finally(() => this.isLoadingSelection = false);
  }


  private setQueryAndClearExplorerData(query: FinancialAccountsQuery) {
    this.query = Object.assign({}, query);
    this.setDataList([], false);
    this.setSelectedData(EmptyFinancialAccountHolder);
  }


  private setDataList(data: FinancialAccountDescriptor[],
                      queryExecuted: boolean = true) {
    this.dataList = data ?? [];
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: FinancialAccountHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.account);
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private refreshSelectedData(dataUID: string) {
    this.getAccount(dataUID);
  }

}
