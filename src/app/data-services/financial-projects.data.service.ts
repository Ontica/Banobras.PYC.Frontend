/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FinancialProjectDescriptor, FinancialProjectFields, FinancialProjectHolder,
         FinancialProjectOrgUnitsForEdition,
         FinancialProjectsQuery } from '@app/models';


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


  getOrganizationalUnitsForEdition(): EmpObservable<FinancialProjectOrgUnitsForEdition[]> {
    const path = 'v1/financial-projects/organizational-units-for-edition';

    return this.http.get<FinancialProjectOrgUnitsForEdition[]>(path);
  }


  getAssigneesByOrgUnit(orgUnitUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(orgUnitUID, 'orgUnitUID');

    const path = `v1/financial-projects/organizational-units/${orgUnitUID}/assignees`;

    return this.http.get<Identifiable[]>(path);
  }


  searchProjects(query: FinancialProjectsQuery): EmpObservable<FinancialProjectDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/financial-projects/search';

    return this.http.post<FinancialProjectDescriptor[]>(path, query);
  }


  getProject(projectUID: string): EmpObservable<FinancialProjectHolder> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}`;

    return this.http.get<FinancialProjectHolder>(path);
  }


  createProject(dataFields: FinancialProjectFields): EmpObservable<FinancialProjectHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/financial-projects`;

    return this.http.post<FinancialProjectHolder>(path, dataFields);
  }


  updateProject(projectUID: string,
                dataFields: FinancialProjectFields): EmpObservable<FinancialProjectHolder> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/financial-projects/${projectUID}`;

    return this.http.put<FinancialProjectHolder>(path, dataFields);
  }


  deleteProject(projectUID: string): EmpObservable<void> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}`;

    return this.http.delete<void>(path);
  }

}
