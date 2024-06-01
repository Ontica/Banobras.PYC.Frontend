/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { ProcessGroup, Request, RequestData, RequestFields, RequestQuery, RequestType } from '@app/models';


@Injectable()
export class RequestsDataService {

  constructor(private http: HttpService) { }


  getOrganizationalUnits(processGroup: ProcessGroup): EmpObservable<Identifiable[]> {
    const path = `v4/workflow/process-groups/${processGroup}/organizational-units`;

    return this.http.get<Identifiable[]>(path);
  }


  getRequestTypes(processGroup: ProcessGroup, organizationalUnitUID: string): EmpObservable<RequestType[]> {
    const path = `v4/workflow/process-groups/${processGroup}/` +
      `organizational-units/${organizationalUnitUID}/process-types`;

    return this.http.get<RequestType[]>(path);
  }


  getRequestStatus(): EmpObservable<Identifiable[]> {
    const path = `v4/workflow/catalogues/work-items/status-list`;

    return this.http.get<Identifiable[]>(path);
  }


  getRequestResponsibles(): EmpObservable<Identifiable[]> {
    const path = `v4/workflow/catalogues/work-items/responsible-list`;

    return this.http.get<Identifiable[]>(path);
  }


  searchRequests(query: RequestQuery): EmpObservable<RequestData> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/workflow/requests/search';

    return this.http.post<RequestData>(path, query);
  }


  createRequest(dataFields: RequestFields): EmpObservable<Request> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/workflow/requests/create`;

    return this.http.post<Request>(path, dataFields);
  }

}
