/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { RecordQueryType, RecordSearchData, RecordSearchQuery } from '@app/models';


@Injectable()
export class SearchServicesDataService {

  constructor(private http: HttpService) { }


  searchRecords(queryType: RecordQueryType, query: RecordSearchQuery): EmpObservable<RecordSearchData> {
    Assertion.assertValue(queryType, 'queryType');
    Assertion.assertValue(query, 'query');

    const path = `v1/financial-management/search-services/${queryType}`;

    return this.http.post<RecordSearchData>(path, query);
  }

}
