/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';


export enum SearcherAPIS {

}

@Injectable()
export class SearcherDataService {


  constructor(private http: HttpService) { }


  searchData(searcherAPI: SearcherAPIS, keywords: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(searcherAPI, 'searcherAPI');
    Assertion.assertValue(keywords, 'keywords');

    const path = searcherAPI + `?keywords=${keywords}`;

    return this.http.get<Identifiable[]>(path);
  }

}
