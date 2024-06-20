/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { RequestsList, Request, RequestFields, RequestQuery, RequestType,
         RequestDescriptor } from '@app/models';


@Injectable()
export class RequestsDataService {

  constructor(private http: HttpService) { }

  getOrganizationalUnits(requestsList: RequestsList): EmpObservable<Identifiable[]> {
    Assertion.assertValue(requestsList, 'requestsList');

    const path = `v4/requests/catalogues/organizational-units/?requestsList=${requestsList}`;

    return this.http.get<Identifiable[]>(path);
  }


  getRequestTypes(requestsList: RequestsList,
                  requesterOrgUnitUID?: string): EmpObservable<RequestType[]> {

    Assertion.assertValue(requestsList, 'requestsList');

    let path = `v4/requests/catalogues/requests-types/?requestsList=${requestsList}`;

    if (!!requesterOrgUnitUID) {
      path += `&requesterOrgUnitUID=${requesterOrgUnitUID}`;
    }

    return this.http.get<RequestType[]>(path);
  }


  getRequestStatus(): EmpObservable<Identifiable[]> {
    const path = `v4/requests/catalogues/status-list`;

    return this.http.get<Identifiable[]>(path);
  }


  getRequestResponsibles(): EmpObservable<Identifiable[]> {
    const path = `v4/requests/catalogues/responsible-list`;

    return this.http.get<Identifiable[]>(path);
  }


  searchRequests(query: RequestQuery): EmpObservable<RequestDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/requests/search';

    return this.http.post<RequestDescriptor[]>(path, query);
  }


  createRequest(dataFields: RequestFields): EmpObservable<Request> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/requests/create`;

    return this.http.post<Request>(path, dataFields);
  }

}
