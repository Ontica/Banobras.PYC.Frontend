/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable, isEmpty } from '@app/core';

import { of } from 'rxjs';

import { FinancialProjectDescriptor, FinancialProjectFields, FinancialProjectHolder, FinancialProjectsQuery,
         FinancialProjectStructureForEdit, FinancialProject } from '@app/models';


@Injectable()
export class FinancialProjectsDataService {


  constructor(private http: HttpService) { }


  getProjectTypes(): EmpObservable<Identifiable[]> {
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


  getStructureForEditProjects(orgUnitUID: string): EmpObservable<FinancialProjectStructureForEdit> {
    Assertion.assertValue(orgUnitUID, 'orgUnitUID');

    const path = `v1/financial-projects/organizational-units/${orgUnitUID}/structured-data-for-edition`;

    return this.http.get<FinancialProjectStructureForEdit>(path);
  }


  getAssigneesByOrgUnit(orgUnitUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(orgUnitUID, 'orgUnitUID');

    const path = `v1/financial-projects/organizational-units/${orgUnitUID}/assignees`;

    return this.http.get<Identifiable[]>(path);
  }


  // TODO: Fix this
  getStandardAccounts(projectUID: string): EmpObservable<Identifiable[]> {
    // Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}/standard-accounts`;

    return isEmpty({uid: projectUID}) ?
      new EmpObservable<Identifiable[]>(of([])) :
      this.http.get<Identifiable[]>(path);
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


  getProjectPlain(projectUID: string): EmpObservable<FinancialProject> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}/plain`;

    return this.http.get<FinancialProject>(path);
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
