/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FinancialProjectDescriptor, FinancialProjectsQuery } from '@app/models';


@Injectable()
export class FinancialProjectsDataService {


  constructor(private http: HttpService) { }


  getCategories(): EmpObservable<Identifiable[]> {
    const path = 'v1/financial-projects/categories';

    return this.http.get<Identifiable[]>(path);
  }


  getPrograms(): EmpObservable<Identifiable[]> {
    const path = 'v1/financial-projects/programs';

    return this.http.get<Identifiable[]>(path);
  }


  getSubprograms(): EmpObservable<Identifiable[]> {
    const path = 'v1/financial-projects/subprograms';

    return this.http.get<Identifiable[]>(path);
  }


  searchProjects(query: FinancialProjectsQuery): EmpObservable<FinancialProjectDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/financial-projects/search';

    return this.http.post<FinancialProjectDescriptor[]>(path, query);
  }

}
