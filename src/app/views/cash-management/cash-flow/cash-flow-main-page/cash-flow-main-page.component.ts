/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { CashFlowDataService } from '@app/data-services';

import { CashFlowExplorer, CashFlowEntryDescriptor, CashFlowExplorerQuery, EmptyCashFlowExplorer,
         EmptyCashFlowExplorerQuery } from '@app/models';

import { CashFlowExplorerEventType } from '../cash-flow-explorer/cash-flow-explorer.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


@Component({
  selector: 'emp-cf-cash-flow-main-page',
  templateUrl: './cash-flow-main-page.component.html',
})
export class CashFlowMainPageComponent {

  query: CashFlowExplorerQuery = Object.assign({}, EmptyCashFlowExplorerQuery);

  data: CashFlowExplorer = Object.assign({}, EmptyCashFlowExplorer);

  selectedData: CashFlowEntryDescriptor = null;

  isLoading = false;

  queryExecuted = false;

  selectedReportType: Identifiable = Empty;

  displayExportModal = false;

  fileUrl = '';


  constructor(private cashFlowData: CashFlowDataService,
              private messageBox: MessageBoxService) { }


  onCashFlowExplorerEvent(event: EventInfo) {
    switch (event.type as CashFlowExplorerEventType) {
      case CashFlowExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.reportType, event.payload.query as CashFlowExplorerQuery);
        this.searchCashFlowExplorer(this.query);
        return;
      case CashFlowExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.reportType, event.payload.query as CashFlowExplorerQuery);
        return;
      case CashFlowExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccionar elemento', event.payload.entry);
        return;
      case CashFlowExplorerEventType.EXPORT_CLICKED:
        this.setDisplayExportModal(true);
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
        this.exportCashFlowExplorer(this.query);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchCashFlowExplorer(query: CashFlowExplorerQuery) {
    this.isLoading = true;

    this.cashFlowData.searchCashFlowExplorer(query)
      .firstValue()
      .then(x => this.setData(x))
      .finally(() => this.isLoading = false);
  }


  private exportCashFlowExplorer(query: CashFlowExplorerQuery) {
    this.cashFlowData.exportCashFlowExplorer(query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private setQueryAndClearData(reportType: Identifiable, query: CashFlowExplorerQuery) {
    this.selectedReportType = isEmpty(reportType) ? Empty : reportType;
    this.query = Object.assign({}, EmptyCashFlowExplorerQuery, query);
    this.setData(EmptyCashFlowExplorer, false);
    this.setSelectedData(null);
  }


  private setData(data: CashFlowExplorer, queryExecuted: boolean = true) {
    this.data = data.columns ? data : Object.assign({}, EmptyCashFlowExplorer);
    this.queryExecuted = queryExecuted;
  }


  private setSelectedData(data: CashFlowEntryDescriptor) {
    this.selectedData = data;
  }

  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
