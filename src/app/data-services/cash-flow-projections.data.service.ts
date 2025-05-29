/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { CashFlowProjectionDescriptor, CashFlowProjectionEntry, CashFlowProjectionEntryByYear,
         CashFlowProjectionEntryByYearFields, CashFlowProjectionEntryFields, CashFlowProjectionFields,
         CashFlowProjectionHolder, CashFlowProjectionOrgUnitsForEdition, CashFlowProjectionsQuery,
         FileReport } from '@app/models';


@Injectable()
export class CashFlowProjectionsDataService {


  constructor(private http: HttpService) { }


  //#region CATALOGUES
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


  getStructuredDataForEdition(): EmpObservable<CashFlowProjectionOrgUnitsForEdition[]> {
    const path = 'v1/cash-flow/projections/structured-data-for-edition';

    return this.http.get<CashFlowProjectionOrgUnitsForEdition[]>(path);
  }
  //#endregion


  //#region PROJECTIONS LIST
  searchProjections(query: CashFlowProjectionsQuery): EmpObservable<CashFlowProjectionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/cash-flow/projections/search';

    return this.http.post<CashFlowProjectionDescriptor[]>(path, query);
  }
  //#endregion


  //#region PROJECTION (CRUD + OPERATIONS)
  getProjection(projectionUID: string): EmpObservable<CashFlowProjectionHolder> {
    Assertion.assertValue(projectionUID, 'projectionUID');

    const path = `v1/cash-flow/projections/${projectionUID}`;

    return this.http.get<CashFlowProjectionHolder>(path);
  }


  getProjectionForPrint(projectionUID: string): EmpObservable<FileReport> {
    Assertion.assertValue(projectionUID, 'projectionUID');

    const path = `v1/cash-flow/projections/${projectionUID}/print`;

    return this.http.get<FileReport>(path);
  }


  createProjection(dataFields: CashFlowProjectionFields): EmpObservable<CashFlowProjectionHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/cash-flow/projections`;

    return this.http.post<CashFlowProjectionHolder>(path, dataFields);
  }


  updateProjection(projectionUID: string,
                   dataFields: CashFlowProjectionFields): EmpObservable<CashFlowProjectionHolder> {
    Assertion.assertValue(projectionUID, 'projectionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/cash-flow/projections/${projectionUID}`;

    return this.http.put<CashFlowProjectionHolder>(path, dataFields);
  }


  deleteProjection(projectionUID: string): EmpObservable<void> {
    Assertion.assertValue(projectionUID, 'projectionUID');

    const path = `v1/cash-flow/projections/${projectionUID}`;

    return this.http.delete<void>(path);
  }
  //#endregion


}
