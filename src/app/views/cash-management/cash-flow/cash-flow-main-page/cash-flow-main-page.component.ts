/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { CashFlowDataService } from '@app/data-services';

import { CashFlowData, CashFlowEntryDescriptor, CashFlowQuery, EmptyCashFlowData,
         EmptyCashFlowQuery } from '@app/models';

import { CashFlowExplorerEventType } from '../cash-flow-explorer/cash-flow-explorer.component';


@Component({
  selector: 'emp-cf-cash-flow-main-page',
  templateUrl: './cash-flow-main-page.component.html',
})
export class CashFlowMainPageComponent {

  query: CashFlowQuery = Object.assign({}, EmptyCashFlowQuery);

  data: CashFlowData = Object.assign({}, EmptyCashFlowData);

  selectedData: CashFlowEntryDescriptor = null;

  isLoading = false;

  queryExecuted = false;


  constructor(private cashFlowData: CashFlowDataService,
              private messageBox: MessageBoxService) { }


  onCashFlowExplorerEvent(event: EventInfo) {
    switch (event.type as CashFlowExplorerEventType) {
      case CashFlowExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as CashFlowQuery);
        this.searchCashFlowData(this.query);
        return;
      case CashFlowExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearExplorerData(event.payload.query as CashFlowQuery);
        return;
      case CashFlowExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccionar elemento', event.payload.entry);
        return;
      case CashFlowExplorerEventType.EXPORT_CLICKED:
        this.messageBox.showInDevelopment('Exportar flujo de efectivo', this.query);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchCashFlowData(query: CashFlowQuery) {
    this.isLoading = true;

    this.cashFlowData.searchCashFlowData(query)
      .firstValue()
      .then(x => this.setData(x))
      .finally(() => this.isLoading = false);
  }


  private setQueryAndClearExplorerData(query: CashFlowQuery) {
    this.query = Object.assign({}, EmptyCashFlowQuery, query);
    this.setData(EmptyCashFlowData, false);
    this.setSelectedData(null);
  }


  private setData(data: CashFlowData, queryExecuted: boolean = true) {
    this.data = data.columns ? data : Object.assign({}, EmptyCashFlowData);
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: CashFlowEntryDescriptor) {
    this.selectedData = data;
  }

}
