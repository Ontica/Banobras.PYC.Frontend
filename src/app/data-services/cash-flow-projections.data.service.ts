/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { CashFlowProjectionDescriptor, CashFlowProjectionHolder, CashFlowProjectionsQuery } from '@app/models';


@Injectable()
export class CashFlowProjectionsDataService {


  constructor(private http: HttpService) { }


  getPlans(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/projections/plans';

    return this.http.get<Identifiable[]>(path);
  }


  getCategories(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/projections/categories';

    return this.http.get<Identifiable[]>(path);
  }


  getClassifications(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/projections/classifications';

    return this.http.get<Identifiable[]>(path);
  }


  getOperationSources(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/projections/operation-sources';

    return this.http.get<Identifiable[]>(path);
  }


  searchProjections(query: CashFlowProjectionsQuery): EmpObservable<CashFlowProjectionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/cash-flow/projections/search';

    return this.http.post<CashFlowProjectionDescriptor[]>(path, query);
  }

}
