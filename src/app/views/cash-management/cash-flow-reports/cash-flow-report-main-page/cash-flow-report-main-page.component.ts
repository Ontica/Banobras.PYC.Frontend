/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, Empty, EventInfo, Identifiable, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { ReportingDataService } from '@app/data-services';

import { CashFlowReport, CashFlowEntryDescriptor, CashFlowReportQuery, EmptyCashFlowReport,
         EmptyCashFlowReportQuery, CashFlowReportTypes} from '@app/models';

import { CashFlowReportExplorerEventType } from '../cash-flow-report-explorer/cash-flow-report-explorer.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


@Component({
  selector: 'emp-cf-cash-flow-report-main-page',
  templateUrl: './cash-flow-report-main-page.component.html',
})
export class CashFlowReportMainPageComponent {

  query: CashFlowReportQuery = Object.assign({}, EmptyCashFlowReportQuery);

  data: CashFlowReport = Object.assign({}, EmptyCashFlowReport);

  selectedData: CashFlowEntryDescriptor = null;

  isLoading = false;

  queryExecuted = false;

  selectedReportType: Identifiable<CashFlowReportTypes> = Empty;

  displayExportModal = false;

  fileUrl = '';


  constructor(private reportingData: ReportingDataService,
              private messageBox: MessageBoxService) { }


  onCashFlowReportExplorerEvent(event: EventInfo) {
    switch (event.type as CashFlowReportExplorerEventType) {
      case CashFlowReportExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.reportType, event.payload.query);
        this.searchCashFlowReport(this.selectedReportType?.uid as CashFlowReportTypes, this.query);
        return;
      case CashFlowReportExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.reportType, event.payload.query);
        return;
      case CashFlowReportExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.messageBox.showInDevelopment('Seleccionar elemento', event.payload.entry);
        return;
      case CashFlowReportExplorerEventType.EXPORT_CLICKED:
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
        this.exportCashFlowReport(this.selectedReportType?.uid as CashFlowReportTypes, this.query);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchCashFlowReport(reportType: CashFlowReportTypes, query: CashFlowReportQuery) {
    this.isLoading = true;

    this.reportingData.searchCashFlowReport(reportType, query)
      .firstValue()
      .then(x => this.setData(x))
      .finally(() => this.isLoading = false);
  }


  private exportCashFlowReport(reportType: CashFlowReportTypes, query: CashFlowReportQuery) {
    this.reportingData.exportCashFlowReport(reportType, query)
      .firstValue()
      .then(x => {this.fileUrl = x.url});
  }


  private setQueryAndClearData(reportType: Identifiable<CashFlowReportTypes>, query: CashFlowReportQuery) {
    this.selectedReportType = isEmpty(reportType) ? Empty : reportType;
    this.query = Object.assign({}, EmptyCashFlowReportQuery, query);
    this.setData(EmptyCashFlowReport, false);
    this.setSelectedData(null);
  }


  private setData(data: CashFlowReport, queryExecuted: boolean = true) {
    this.data = data.columns ? data : Object.assign({}, EmptyCashFlowReport);
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
