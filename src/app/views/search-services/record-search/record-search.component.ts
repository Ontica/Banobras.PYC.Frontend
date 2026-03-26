/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { SearchServicesAction,
         SearchServicesStateSelector } from '@app/presentation/exported.presentation.types';

import { SearchServicesDataService } from '@app/data-services';

import { buildExplorerHint, EmptyRecordSearchData, RecordSearchData, RecordSearchQuery, RecordQueryType,
         FileReport, ReportingColumnAction } from '@app/models';

import { FilePreviewComponent } from '@app/shared/containers';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { RecordSearchFilterEventType } from './record-search-filter.component';


@Component({
  selector: 'emp-pyc-record-search',
  templateUrl: './record-search.component.html',
})
export class RecordSearchComponent implements OnInit, OnDestroy {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  data: RecordSearchData = Object.assign({}, EmptyRecordSearchData);

  hint = 'Seleccionar los filtros';

  isLoading = false;

  helper: SubscriptionHelper;

  selectedExportData = {
    displayExportModal: false,
    heading: null,
    message: null,
    fileUrl: null,
    hasError: false,
  }

  filePreviewData = {
    heading: '',
    hint: '',
  };


  constructor(private uiLayer: PresentationLayer,
              private searchData: SearchServicesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.helper.select<any>(SearchServicesStateSelector.RECORD_SEARCH_DATA)
      .subscribe(x => this.setInitData(x));
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onRecordSearchFilterEvent(event: EventInfo) {
    switch (event.type as RecordSearchFilterEventType) {
      case RecordSearchFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.validateQueryType(event.payload.queryValid,
                               event.payload.queryType,
                               event.payload.query as RecordSearchQuery);
        return;
      case RecordSearchFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.queryType, 'event.payload.queryType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.clearData(event.payload.queryType,
                       event.payload.query);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {
      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;
      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.column.action, 'event.payload.column.action');
        Assertion.assertValue(event.payload.column.linkField, 'event.payload.column.linkField');
        this.printRecordEntry(event.payload.column.action, event.payload.column.linkField)
        return;
      case DataTableEventType.EXPORT_DATA:
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
        this.exportRecords(this.data.query);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateQueryType(queryValid: boolean, queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    if (!queryValid) {
      return;
    }

    this.resetRecords(queryType, query);
    this.searchRecords(queryType, query);
  }


  private resetRecords(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    this.resolveSearchRecords(queryType, query, EmptyRecordSearchData, false);
  }


  private searchRecords(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    this.isLoading = true;

    this.searchData.searchRecords(query)
      .firstValue()
      .then(x => this.resolveSearchRecords(queryType, query, x))
      .finally(() => this.isLoading = false);
  }


  private exportRecords(query: RecordSearchQuery) {
    this.searchData.exportRecords(query)
      .firstValue()
      .then(x => this.resolveExportData(x.url))
      .catch (e => this.resolveExportDataError());
  }


  private printRecordEntry(action: ReportingColumnAction, linkField: string) {
    this.isLoading = true;

    this.searchData.getRecordForPrint(action, linkField)
      .firstValue()
      .then(x => this.openFilePreview(action, x))
      .finally(() => this.isLoading = false);
  }


  private resolveSearchRecords(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery,
                               result: RecordSearchData, queryExecuted: boolean = true) {
    const data: RecordSearchData = {
      queryType,
      query,
      queryExecuted,
      columns: result?.columns ?? [],
      entries: result?.entries ?? [],
    };

    this.data = Object.assign({}, data);
    this.saveDataInState(data);
  }


   private clearData(queryType: Identifiable<RecordQueryType>, query: RecordSearchQuery) {
    const data: RecordSearchData = {
      queryType,
      query,
      queryExecuted: false,
      columns: [],
      entries: [],
    };

    this.setInitData(data);
  }


  private saveDataInState(data: RecordSearchData) {
    this.uiLayer.dispatch(SearchServicesAction.SET_RECORD_SEARCH_DATA, {data});
  }


  private setInitData(data: RecordSearchData) {
    this.data = Object.assign({}, data);
    this.setText();
  }


  private setText(displayedEntriesMessage?: string) {
    this.hint = buildExplorerHint(this.data.queryExecuted, this.data.entries.length,
      displayedEntriesMessage, this.data.queryType.name);
  }


  private setDisplayExportModal(display: boolean) {
    this.selectedExportData = {
      displayExportModal: display,
      heading: display ? `Exportar ${this.data.queryType.name.toLowerCase()}` : null,
      message: display ? 'Se generará la exportación a Excel con el último filtro consultado.' : null,
      fileUrl: null,
      hasError: false,
    };
  }


  private resolveExportData(fileUrl: string) {
    this.selectedExportData.fileUrl = fileUrl;
  }


  private resolveExportDataError() {
    this.selectedExportData.hasError = true;
  }


  private openFilePreview(action: ReportingColumnAction, file: FileReport) {
    this.filePreviewData = {
      heading: action === 'PrintBudgetTransaction' ? 'Impresión de la transacción presupuestal' : null,
      hint: action === 'PrintBudgetTransaction' ? 'Información de la transacción presupuestal' : null,
    };

    this.filePreview.open(file.url, file.type);
  }

}
