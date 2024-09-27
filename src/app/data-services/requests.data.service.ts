/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { RequestFields, RequestQuery, RequestDescriptor, RequestData, RequestsList,
         RequestType } from '@app/models';


@Injectable()
export class RequestsDataService {


  constructor(private http: HttpService) { }


  getRequestsTypes(requestsList: RequestsList,
                  requesterOrgUnitUID?: string): EmpObservable<RequestType[]> {
    Assertion.assertValue(requestsList, 'requestsList');

    let path = `v4/requests/catalogues/requests-types/?requestsList=${requestsList}`;

    if (!!requesterOrgUnitUID) {
      path += `&requesterOrgUnitUID=${requesterOrgUnitUID}`;
    }

    return this.http.get<RequestType[]>(path);
  }


  getRequestsStatus(): EmpObservable<Identifiable[]> {
    const path = `v4/requests/catalogues/status-list`;

    return this.http.get<Identifiable[]>(path);
  }


  searchRequests(query: RequestQuery): EmpObservable<RequestDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v4/requests/search';

    return this.http.post<RequestDescriptor[]>(path, query);
  }


  getRequest(requestUID: string): EmpObservable<RequestData> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}`;

    return this.http.get<RequestData>(path);
  }


  createRequest(dataFields: RequestFields): EmpObservable<RequestData> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/requests/create`;

    return this.http.post<RequestData>(path, dataFields);
  }


  updateRequest(requestUID: string, dataFields: RequestFields): EmpObservable<RequestData> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v4/requests/${requestUID}`;

    return this.http.put<RequestData>(path, dataFields);
  }


  startRequest(requestUID: string): EmpObservable<RequestData> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}/start`;

    return this.http.post<RequestData>(path);
  }


  cancelRequest(requestUID: string): EmpObservable<RequestData> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}/cancel`;

    return this.http.post<RequestData>(path);
  }


  suspendRequest(requestUID: string): EmpObservable<RequestData> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}/suspend`;

    return this.http.post<RequestData>(path);
  }


  activateRequest(requestUID: string): EmpObservable<RequestData> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}/activate`;

    return this.http.post<RequestData>(path);
  }


  closeRequest(requestUID: string): EmpObservable<RequestData> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}/close`;

    return this.http.post<RequestData>(path);
  }


  deleteRequest(requestUID: string): EmpObservable<void> {
    Assertion.assertValue(requestUID, 'requestUID');

    const path = `v4/requests/${requestUID}`;

    return this.http.delete<void>(path);
  }

}
