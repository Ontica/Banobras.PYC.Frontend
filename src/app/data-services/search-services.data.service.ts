/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { FileReport, RecordSearchData, RecordSearchQuery, ReportingColumnAction } from '@app/models';

import { BudgetTransactionsDataService } from './budget-transactions.data.service';


@Injectable()
export class SearchServicesDataService {

  constructor(private http: HttpService,
              private budgetTransactionsData: BudgetTransactionsDataService) { }


  searchRecords(query: RecordSearchQuery): EmpObservable<RecordSearchData> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(query.queryType, 'query.queryType');

    const path = `v1/tooling/record-search`;

    return this.http.post<RecordSearchData>(path, query);
  }


  exportRecords(query: RecordSearchQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');
    Assertion.assertValue(query.queryType, 'query.queryType');

    const path = 'v1/tooling/record-search/export';

    return this.http.post<FileReport>(path, query);
  }


  getRecordForPrint(action: ReportingColumnAction, linkField: string): EmpObservable<FileReport> {
    Assertion.assertValue(action, 'action');
    Assertion.assertValue(linkField, 'linkField');

    switch (action) {
      case 'PrintBudgetTransaction':
        return this.budgetTransactionsData.getTransactionForPrint(linkField);
      default:
        throw new Error(`Unhandled action for print: ${action}`);
    }
  }

}
