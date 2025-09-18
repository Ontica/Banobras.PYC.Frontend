/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { RecordSearchData, RecordSearchQuery } from '@app/models';


@Injectable()
export class SearchServicesDataService {

  constructor(private http: HttpService) { }


  searchRecords(query: RecordSearchQuery): EmpObservable<RecordSearchData> {
    Assertion.assertValue(query, 'query');

    const path = `v1/cash-flow/accounts-totals/search`;

    return this.http.post<RecordSearchData>(path, query);
  }

}
