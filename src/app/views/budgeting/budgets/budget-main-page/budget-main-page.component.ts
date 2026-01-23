/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { BudgetTransactionsDataService, BudgetsDataService } from '@app/data-services';

import { BudgetData, BudgetEntryBreakdown, BudgetEntryBreakdownData, BudgetEntryDescriptor, BudgetQuery,
         EmptyBudgetData, EmptyBudgetEntryBreakdown, EmptyBudgetEntryBreakdownData,
         EmptyBudgetEntryDescriptor, EmptyBudgetQuery, FileReport } from '@app/models';

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

  query: BudgetQuery = Object.assign({}, EmptyBudgetQuery);

  data: BudgetData = Object.assign({}, EmptyBudgetData);

  selectedEntry: BudgetEntryBreakdownData = Object.assign({}, EmptyBudgetEntryBreakdownData);

  fileUrl = '';

  displayEntry = false;

  displayExportModal = false;

  expandEntry = false;

  isLoading = false;

  isLoadingEntry = false;

  queryExecuted = false;


  constructor(private budgetsData: BudgetsDataService,
              private transactionsData: BudgetTransactionsDataService) { }


  onBudgetExplorerEvent(event: EventInfo) {
    switch (event.type as BudgetExplorerEventType) {
      case BudgetExplorerEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.query as BudgetQuery);
        this.searchBudgetData(this.query);
        return;
      case BudgetExplorerEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setQueryAndClearData(event.payload.query as BudgetQuery);
        return;
      case BudgetExplorerEventType.SELECT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.getBudgetEntryBreakdown(event.payload.entry as BudgetEntryDescriptor);
        return;
      case BudgetExplorerEventType.EXPORT_CLICKED:
        this.setDisplayExportModal(true);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onBudgetEntryBreakdownEvent(event: EventInfo) {
    switch (event.type as BudgetEntryBreakdownEventType) {
      case BudgetEntryBreakdownEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedEntry(EmptyBudgetEntryDescriptor, EmptyBudgetEntryBreakdown);
        this.resetExpandEntry();
        return;
      case BudgetEntryBreakdownEventType.EXPAND_CLICKED:
        this.setExpandEntry();
        return;
      case BudgetEntryBreakdownEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.dataUID, 'event.payload.dataUID');
        this.getTransactionForPrint(event.payload.dataUID);
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
        this.exportBudgetData(this.query);
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


  private getBudgetEntryBreakdown(entry: BudgetEntryDescriptor) {
    this.isLoadingEntry = true;

    this.budgetsData.getBudgetEntryBreakdown(this.query, entry)
      .firstValue()
      .then(x => this.setSelectedEntry(entry, x))
      .finally(() => this.isLoadingEntry = false);
  }


  private getTransactionForPrint(transactionUID: string) {
    this.isLoading = true;

    this.transactionsData.getTransactionForPrint(transactionUID)
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private exportBudgetData(query: BudgetQuery) {
    this.budgetsData.exportBudgetData(query)
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }


  private setQueryAndClearData(query: BudgetQuery) {
    this.query = Object.assign({}, query);
    this.setData(EmptyBudgetData, false);
    this.setSelectedEntry(EmptyBudgetEntryDescriptor, EmptyBudgetEntryBreakdown);
    this.resetExpandEntry();
  }


  private setData(data: BudgetData, queryExecuted: boolean = true) {
    this.data = Object.assign({}, data.columns ? data : EmptyBudgetData);
    this.queryExecuted = queryExecuted;
  }


  private setSelectedEntry(entry: BudgetEntryDescriptor, breakdown: BudgetEntryBreakdown) {
    this.selectedEntry = { entry, breakdown };
    this.displayEntry = !!this.selectedEntry.entry.title;
  }


  private setExpandEntry() {
    this.expandEntry = !this.expandEntry;
  }


  private resetExpandEntry() {
    this.expandEntry = false;
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
