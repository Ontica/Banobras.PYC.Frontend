/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { BudgetTransactionsDataService, BudgetsDataService } from '@app/data-services';

import { BudgetData, BudgetEntryBreakdown, BudgetEntryBreakdownData, BudgetEntryDescriptor, BudgetEntryQuery,
         BudgetExplorerOperationTypes, BudgetExplorerReportType, BudgetQuery, EmptyBudgetData,
         EmptyBudgetEntryBreakdown, EmptyBudgetEntryBreakdownData, EmptyBudgetEntryDescriptor,
         EmptyBudgetEntryQuery, EmptyBudgetExplorerReportType, EmptyBudgetQuery,
         EmptyExplorerBulkOperationData, ExplorerBulkOperationData, FileReport } from '@app/models';

import { FilePreviewComponent } from '@app/shared/containers';

import { BudgetExplorerEventType } from '../budget-explorer/budget-explorer.component';

import { BudgetEntryBreakdownEventType } from '../budget-entry-breakdown/budget-entry-breakdown.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


@Component({
  selector: 'emp-bdg-budget-main-page',
  templateUrl: './budget-main-page.component.html',
})
export class BudgetMainPageComponent {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  selectedReportType: BudgetExplorerReportType = Object.assign({}, EmptyBudgetExplorerReportType);

  query: BudgetQuery = Object.assign({}, EmptyBudgetQuery);

  data: BudgetData = Object.assign({}, EmptyBudgetData);

  selectedEntry: BudgetEntryBreakdownData = Object.assign({}, EmptyBudgetEntryBreakdownData);

  subQuery: BudgetEntryQuery = Object.assign({}, EmptyBudgetEntryQuery);

  displayEntry = false;

  displayExportModal = false;

  expandEntry = false;

  isLoading = false;

  isLoadingEntry = false;

  queryExecuted = false;

  selectedExportData: ExplorerBulkOperationData = Object.assign({}, EmptyExplorerBulkOperationData);


  constructor(private budgetsData: BudgetsDataService,
              private transactionsData: BudgetTransactionsDataService) { }


  onBudgetExplorerEvent(event: EventInfo) {
    switch (event.type as BudgetExplorerEventType) {
      case BudgetExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.reportType, event.payload.query as BudgetQuery);
        this.searchBudgetData(this.query);
        return;
      case BudgetExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.reportType, event.payload.query as BudgetQuery);
        return;
      case BudgetExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.setSubquery({ reportType: this.selectedReportType.defaultEntryReportType });
        this.getBudgetEntryBreakdown(this.query, this.subQuery, event.payload.entry as BudgetEntryDescriptor);
        return;
      case BudgetExplorerEventType.EXPORT_CLICKED:
        this.setDisplayExportModal(true, BudgetExplorerOperationTypes.exportBudget, 'Exportar presupuesto',
          'Se generará la exportación a Excel con el último filtro consultado.'
        );
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBudgetEntryBreakdownEvent(event: EventInfo) {
    switch (event.type as BudgetEntryBreakdownEventType) {
      case BudgetEntryBreakdownEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedEntry(this.query, EmptyBudgetEntryQuery, EmptyBudgetEntryDescriptor, EmptyBudgetEntryBreakdown);
        this.setSubquery(EmptyBudgetEntryQuery);
        this.resetExpandEntry();
        return;
      case BudgetEntryBreakdownEventType.EXPAND_CLICKED:
        this.setExpandEntry();
        return;
      case BudgetEntryBreakdownEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.getTransactionForPrint(event.payload.dataUID);
        return;
      case BudgetEntryBreakdownEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.subQuery, 'event.payload.subQuery');
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.setSubquery(event.payload.subQuery);
        this.getBudgetEntryBreakdown(this.query, this.subQuery, event.payload.entry);
        return;
      case BudgetEntryBreakdownEventType.EXPORT_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        Assertion.assertValue(event.payload.subQuery, 'event.payload.subQuery');
        this.setSubquery(event.payload.subQuery);
        this.setDisplayExportModal(true, BudgetExplorerOperationTypes.exportBudgetEntry,
          'Exportar desglose de presupuesto', 'Se generará la exportación a Excel con los últimos filtros consultados.');
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
        switch (this.selectedExportData.operation) {
          case BudgetExplorerOperationTypes.exportBudget:
            this.exportBudgetData(this.query);
            break;
          case BudgetExplorerOperationTypes.exportBudgetEntry:
            this.exportBudgetEntryBreakdown(this.query, this.subQuery, this.selectedEntry.entry);
            break;
          default:
            break;
        }
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchBudgetData(query: BudgetQuery) {
    this.isLoading = true;

    this.budgetsData.searchBudgetData(query)
      .firstValue()
      .then(x => this.setData(x))
      .finally(() => this.isLoading = false);
  }


  private exportBudgetData(query: BudgetQuery) {
    this.budgetsData.exportBudgetData(query)
      .firstValue()
      .then(x => this.resolveExportData(x.url));
  }


  private getBudgetEntryBreakdown(query: BudgetQuery,
                                  subQuery: BudgetEntryQuery,
                                  entry: BudgetEntryDescriptor) {
    this.isLoadingEntry = true;

    this.budgetsData.getBudgetEntryBreakdown(query, subQuery, entry)
      .firstValue()
      .then(x => this.setSelectedEntry(query, subQuery, entry, x))
      .finally(() => this.isLoadingEntry = false);
  }


  private exportBudgetEntryBreakdown(query: BudgetQuery,
                                     subQuery: BudgetEntryQuery,
                                     entry: BudgetEntryDescriptor) {
    this.budgetsData.exportBudgetEntryBreakdown(query, subQuery, entry)
      .firstValue()
      .then(x => this.resolveExportData(x.url));
  }


  private getTransactionForPrint(transactionUID: string) {
    this.isLoading = true;

    this.transactionsData.getTransactionForPrint(transactionUID)
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private setQueryAndClearData(reportType: BudgetExplorerReportType, query: BudgetQuery) {
    this.selectedReportType = isEmpty(reportType) ? EmptyBudgetExplorerReportType : reportType;
    this.query = Object.assign({}, query);
    this.setSubquery(EmptyBudgetEntryQuery);
    this.setData(EmptyBudgetData, false);
    this.setSelectedEntry(query, EmptyBudgetEntryQuery, EmptyBudgetEntryDescriptor, EmptyBudgetEntryBreakdown);
    this.resetExpandEntry();
  }


  private setData(data: BudgetData, queryExecuted: boolean = true) {
    this.data = Object.assign({}, data.columns ? data : EmptyBudgetData);
    this.queryExecuted = queryExecuted;
  }


  private setSelectedEntry(query: BudgetQuery,
                           subQuery: BudgetEntryQuery,
                           entry: BudgetEntryDescriptor,
                           breakdown: BudgetEntryBreakdown) {
    this.selectedEntry = { query, subQuery, entry, breakdown };
    this.displayEntry = !!this.selectedEntry.entry.title;
  }


  private setSubquery(subQuery: BudgetEntryQuery) {
    this.subQuery = Object.assign({}, subQuery);
  }


  private setExpandEntry() {
    this.expandEntry = !this.expandEntry;
  }


  private resetExpandEntry() {
    this.expandEntry = false;
  }


  private setDisplayExportModal(display: boolean,
                               operation?: BudgetExplorerOperationTypes,
                               title?: string,
                               message?: string) {
    this.displayExportModal = display;
    this.selectedExportData = {
      operation: operation ?? null,
      title: title ?? null,
      message: message ?? null,
      fileUrl: '',
      command: null,
    };
  }


  private resolveExportData(fileUrl: string) {
    this.selectedExportData.fileUrl = fileUrl;
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
