/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { CashFlowData, CashFlowQuery } from '@app/models';

@Injectable()
export class CashFlowDataService {


  constructor(private http: HttpService) { }


  getFinancingSources(): EmpObservable<Identifiable[]> {
    const path = 'v3/standard-accounts/segments/financingSource';

    return this.http.get<Identifiable[]>(path);
  }


  getOperationTypes(): EmpObservable<Identifiable[]> {
    const path = 'v3/standard-accounts/segments/operationType';

    return this.http.get<Identifiable[]>(path);
  }


  getPrograms(): EmpObservable<Identifiable[]> {
    const path = 'v3/standard-accounts/segments/program';

    return this.http.get<Identifiable[]>(path);
  }


  getSubprograms(): EmpObservable<Identifiable[]> {
    const path = 'v3/standard-accounts/segments/subprogram';

    return this.http.get<Identifiable[]>(path);
  }


  searchCashFlowData(query: CashFlowQuery): EmpObservable<CashFlowData> {
    Assertion.assertValue(query, 'query');

    const path = `v1/cash-flow/explorer`;

    return this.http.post<CashFlowData>(path, query);
  }

}
