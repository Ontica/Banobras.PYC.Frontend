/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { map } from 'rxjs';

import { CashFlowReport, CashFlowReportQuery, CashFlowReportTypes, FileReport, ReportTypes,
         ReportData, ReportQuery, calculateDataColumnsSize } from '@app/models';




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
  // Financial Management
  //

  getFinancialManagementReport(reportType: ReportTypes,
                               query: ReportQuery): EmpObservable<ReportData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-management/reports/${reportType}`;

    return new EmpObservable<ReportData>(
      this.http.post<ReportData>(path, query)
        .pipe(map(x => calculateDataColumnsSize(x) as ReportData))
    );
  }


  exportFinancialManagementReport(reportType: ReportTypes,
                                  query: ReportQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-management/reports/${reportType}/export`;

    return this.http.post<FileReport>(path, query);
  }

}
