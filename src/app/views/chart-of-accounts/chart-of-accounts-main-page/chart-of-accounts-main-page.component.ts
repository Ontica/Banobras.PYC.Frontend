/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ChartOfAccountsDataService } from '@app/data-services';

import { ChartOfAccounts, ChartOfAccountsQuery, EmptyChartOfAccounts, EmptyChartOfAccountsQuery,
         EmptyStandardAccountHolder, StandardAccountHolder } from '@app/models';

import {
  ChartOfAccountsExplorerEventType
} from '../chart-of-accounts-explorer/chart-of-accounts-explorer.component';

import {
  StandardAccountTabbedViewEventType
} from '../standard-account-tabbed-view/standard-account-tabbed-view.component';


@Component({
  selector: 'emp-financial-chart-of-accounts-main-page',
  templateUrl: './chart-of-accounts-main-page.component.html',
})
export class ChartOfAccountsMainPageComponent {

  query: ChartOfAccountsQuery = Object.assign({}, EmptyChartOfAccountsQuery);

  data: ChartOfAccounts = Object.assign({}, EmptyChartOfAccounts);

  selectedData: StandardAccountHolder = EmptyStandardAccountHolder;

  displayTabbedView = false;

  displayCreator = false;

  isLoading = false;

  isLoadingSelection = false;

  queryExecuted = false;


  constructor(private chartOfAccountsData: ChartOfAccountsDataService,
              private messageBox: MessageBoxService) { }


  onChartOfAccountsExplorerEvent(event: EventInfo) {
    switch (event.type as ChartOfAccountsExplorerEventType) {
      case ChartOfAccountsExplorerEventType.CREATE_CLICKED:
        this.displayCreator = true;
        this.messageBox.showInDevelopment('Agregar cuenta estándar');
        return;
      case ChartOfAccountsExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ChartOfAccountsQuery);
        this.searchData(this.query);
        return;
      case ChartOfAccountsExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as ChartOfAccountsQuery);
        return;
      case ChartOfAccountsExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar cuentas estándar', event.payload);
        return;
      case ChartOfAccountsExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.item, ' event.payload.item');
        Assertion.assertValue(event.payload.item.uid, 'event.payload.item.uid');
        this.getStandardAccount(this.data.uid, event.payload.item.uid);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onStandardAccountTabbedViewEvent(event: EventInfo) {
    switch (event.type as StandardAccountTabbedViewEventType) {
      case StandardAccountTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedData(EmptyStandardAccountHolder);
        return;
      case StandardAccountTabbedViewEventType.REFRESH_DATA:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.refreshSelectedData(event.payload.dataUID);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchData(query: ChartOfAccountsQuery) {
    this.isLoading = true;

    this.chartOfAccountsData.searchChartOfAccounts(query)
      .firstValue()
      .then(x => this.setData(x, true))
      .finally(() => this.isLoading = false);
  }


  private getStandardAccount(chartOfAccountsUID: string, stdAccountUID: string, refresh: boolean = false) {
    this.isLoadingSelection = true;

    this.chartOfAccountsData.getStandardAccount(chartOfAccountsUID, stdAccountUID)
      .firstValue()
      .then(x => this.resolveGetStandardAccount(x, refresh))
      .catch(e => this.setSelectedData(EmptyStandardAccountHolder))
      .finally(() => this.isLoadingSelection = false);
  }


  private resolveGetStandardAccount(data: StandardAccountHolder, refresh: boolean = false) {
    this.setSelectedData(data);

    if (refresh) {

    }
  }


  private setQueryAndClearExplorerData(query: ChartOfAccountsQuery) {
    this.query = Object.assign({}, query);
    this.setData(EmptyChartOfAccounts, false);
    this.setSelectedData(EmptyStandardAccountHolder);
  }


  private setData(data: ChartOfAccounts,
                  queryExecuted: boolean = true) {
    this.data = isEmpty(data) ? Object.assign({}, EmptyChartOfAccounts) : data;
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: StandardAccountHolder) {
    this.selectedData = data;
    this.displayTabbedView = !isEmpty(this.selectedData.standardAccount);
  }


  private refreshSelectedData(accountUID: string) {
    this.getStandardAccount(this.data.uid, accountUID, true);
  }

}
