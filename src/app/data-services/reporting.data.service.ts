/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { CashFlowReport, CashFlowReportQuery, CashFlowReportTypes, FileReport, PaymentsReportTypes,
         ReportData, ReportQuery } from '@app/models';




@Injectable()
export class ReportingDataService {


  constructor(private http: HttpService) { }


  //
  // Cash Flow
  //

  searchCashFlowReport(reportType: CashFlowReportTypes,
                       query: CashFlowReportQuery): EmpObservable<CashFlowReport> {
    Assertion.assertValue(reportType, 'reportType');
    Assertion.assertValue(query, 'query');

    const path = `v1/cash-flows/reports/${reportType}`;

    return this.http.post<CashFlowReport>(path, query);
  }


  exportCashFlowReport(reportType: CashFlowReportTypes,
                       query: CashFlowReportQuery): EmpObservable<FileReport> {
    Assertion.assertValue(reportType, 'reportType');
    Assertion.assertValue(query, 'query');

    const path = `v1/cash-flow/reports/${reportType}/export`;

    return this.http.post<FileReport>(path, query);
  }

  //
  // Payments
  //

  getPaymentsReport(reportType: PaymentsReportTypes,
                    query: ReportQuery): EmpObservable<ReportData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-management/reports/${reportType}`;

    return this.http.post<ReportData>(path, query);
  }


  exportPaymentsReport(reportType: PaymentsReportTypes,
                       query: ReportQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-management/reports/${reportType}/export`;

    return this.http.post<FileReport>(path, query);
  }

}
