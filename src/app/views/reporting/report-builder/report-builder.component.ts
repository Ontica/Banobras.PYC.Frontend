/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EmpObservable, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { SkipIf } from '@app/shared/decorators';

import { ReportingDataService } from '@app/data-services';

import { EmptyReportData, EmptyReportType, FileReport, FileType, ReportController, ReportData, ReportGroup,
         ReportQuery, ReportType, ReportTypeFlags, ReportTypes } from '@app/models';

import { ReportFilterEventType } from './report-filter.component';

import { ReportViewerEventType } from './report-viewer.component';


@Component({
  selector: 'emp-pyc-report-builder',
  templateUrl: './report-builder.component.html',
})
export class ReportBuilderComponent implements OnInit, OnDestroy {

  reportGroup: ReportGroup;

  ReportGroups = ReportGroup;

  isLoading = false;

  queryExecuted = false;

  reportQuery: ReportQuery = Object.assign({});

  selectedReportType: ReportType<ReportTypeFlags> = EmptyReportType;

  reportData: ReportData = Object.assign({}, EmptyReportData);

  fileUrl = '';

  showFilters = false;

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private reportingData: ReportingDataService) {
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
    switch (event.type as ReportFilterEventType) {
      case ReportFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setReportQuery(event.payload.query as ReportQuery);
        this.setReportType(event.payload.reportType as ReportType<ReportTypeFlags>);
        this.validateGetReportData();
        return;
      case ReportFilterEventType.CLEAR_CLICKED:
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
        return;
      case ReportViewerEventType.EXPORT_DATA_CLICKED:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        const reportQuery = this.getReportQueryForExport(event.payload.exportationType as FileType);
        this.validateExportReportData(reportQuery);
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


  private validateExportReportData(reportQuery: ReportQuery) {
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


  private clearReportData() {
    this.setReportData(EmptyReportData, false);
  }


  private getReportQueryForExport(exportTo: FileType): ReportQuery {
    return Object.assign({}, this.reportQuery, { exportTo });
  }

}
