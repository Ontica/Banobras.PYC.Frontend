/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Assertion, EmpObservable, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { SkipIf } from '@app/shared/decorators';

import { BudgetTransactionsDataService, PaymentOrdersDataService,
         ReportingDataService } from '@app/data-services';

import { EmptyReportData, EmptyReportType, FileReport, FileType, ReportController, ReportData, ReportEntry,
         ReportGroup, ReportQuery, ReportType, ReportTypeFlags, ReportTypes } from '@app/models';

import { FilePreviewComponent } from '@app/shared/containers';

import { BudgetReportFilterEventType } from './report-filters/budget-report-filter.component';

import { ReportFilterEventType } from './report-filters/report-filter.component';

import { ReportViewerEventType } from './report-viewer.component';


@Component({
  selector: 'emp-pyc-report-builder',
  templateUrl: './report-builder.component.html',
})
export class ReportBuilderComponent implements OnInit, OnDestroy {

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  reportGroup: ReportGroup;

  ReportGroups = ReportGroup;

  isLoading = false;

  queryExecuted = false;

  reportQuery: ReportQuery = Object.assign({});

  selectedReportType: ReportType<ReportTypeFlags> = EmptyReportType;

  reportData: ReportData = Object.assign({}, EmptyReportData);

  fileUrl = '';

  filePreviewData = {
    heading: '',
    hint: '',
  }

  showFilters = false;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private reportingData: ReportingDataService,
              private paymentOrdersData: PaymentOrdersDataService,
              private budgetTnxData: BudgetTransactionsDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setReportGroupFromCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  @SkipIf('isLoading')
  onReportFilterEvent(event: EventInfo) {
    switch (event.type as ReportFilterEventType | BudgetReportFilterEventType) {
      case ReportFilterEventType.SEARCH_CLICKED:
      case BudgetReportFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setReportQuery(event.payload.query as ReportQuery);
        this.setReportType(event.payload.reportType as ReportType<ReportTypeFlags>);
        this.validateGetReportData();
        return;
      case ReportFilterEventType.CLEAR_CLICKED:
      case BudgetReportFilterEventType.CLEAR_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setReportQuery(event.payload.query as ReportQuery);
        this.setReportType(event.payload.reportType as ReportType<ReportTypeFlags>);
        this.clearReportData();
        this.showFilters = false;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onReportViewerEvent(event: EventInfo) {
    switch (event.type as ReportViewerEventType) {
      case ReportViewerEventType.REPORT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.reportEntry, 'event.payload.reportEntry');
        this.validateReportEntry(event.payload.reportEntry as ReportEntry, event.payload.linkField);
        return;
      case ReportViewerEventType.EXPORT_DATA_CLICKED:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        const reportQuery = this.getReportQueryForExport(event.payload.exportationType as FileType);
        this.validateExportReportData();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setReportGroupFromCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));
  }


  private onCurrentViewChanged(newView: View) {
    switch (newView.name) {
      case 'Budget.Reporting':
        this.reportGroup = ReportGroup.BudgetReports;
        return;
      case 'Payments.Reporting':
        this.reportGroup = ReportGroup.PaymentReports;
        return;
      default:
        this.reportGroup = null;
        return;
    }
  }


  private validateGetReportData() {
    this.clearReportData();

    let observable: EmpObservable<ReportData> = null;

    switch (this.selectedReportType.controller) {
      case ReportController.FinancialManagementReport:
        const reportType = this.reportQuery.reportType as ReportTypes;
        observable = this.reportingData.getFinancialManagementReport(reportType, this.reportQuery);
        break;
      default:
        console.log(`Unhandled ${this.selectedReportType.controller}`);
        return;
    }

    this.getReportData(observable);
  }


  private validateExportReportData() {
    let observable: EmpObservable<FileReport> = null;

    switch (this.selectedReportType.controller) {
      case ReportController.FinancialManagementReport:
        const reportType = this.reportQuery.reportType as ReportTypes;
        observable = this.reportingData.exportFinancialManagementReport(reportType, this.reportQuery);
        break;
      default:
        console.log(`Unhandled report ${this.selectedReportType.controller}`);
        return;
    }

    this.exportReportData(observable);
  }


  private validateReportEntry(reportEntry: ReportEntry, linkField: string) {
    if (!linkField || (!!linkField && !reportEntry[linkField])) {
      console.log('Unhandled report entry');
      return;
    }

    let observable: EmpObservable<FileReport> = null;
    const linkFieldValue = reportEntry[linkField];

    switch (linkField) {
      case 'paymentOrderUID':
        observable = this.paymentOrdersData.getPaymentOrderForPrint(linkFieldValue)
        this.setFilePreviewData('Impresion de la solicitud de pago',
          'Información de la solicitud de pago');
        break;
      case 'budgetTransactionUID':
        observable = this.budgetTnxData.getTransactionForPrint(linkFieldValue)
        this.setFilePreviewData('Impresion de la transacción presupuestal',
          'Información de la transacción presupuestal');
      break;
      default:
        console.log(`Unhandled link field: ${linkField}`);
        return;
    }

    this.printReportEntry(observable);
  }


  private getReportData(observable: EmpObservable<ReportData>) {
    this.isLoading = true;

    observable
      .firstValue()
      .then(x => this.resolveGetReportData(x))
      .finally(() => this.isLoading = false);
  }


  private exportReportData(observable: EmpObservable<FileReport>) {
    observable
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }


  private printReportEntry(observable: EmpObservable<FileReport>) {
    this.isLoading = true;

    observable
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private resolveGetReportData(reportData: ReportData) {
    this.setReportData(reportData);
    this.showFilters = false;
  }


  private setReportQuery(query: ReportQuery) {
    this.reportQuery = query;
  }


  private setReportType(reportType: ReportType<ReportTypeFlags>) {
    this.selectedReportType = reportType;
  }


  private setReportData(reportData: ReportData, queryExecuted = true) {
    this.reportData = reportData;
    this.queryExecuted = queryExecuted;
  }


  private setFilePreviewData(heading: string, hint: string) {
    this.filePreviewData = { heading, hint };
  }


  private clearReportData() {
    this.setReportData(EmptyReportData, false);
  }


  private getReportQueryForExport(exportTo: FileType): ReportQuery {
    return Object.assign({}, this.reportQuery, { exportTo });
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
