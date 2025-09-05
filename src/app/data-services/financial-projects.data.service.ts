/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FinancialAccountOperationsStructure, FinancialAccount, FinancialAccountFields,
         FinancialProjectDescriptor, FinancialProjectFields, FinancialProjectHolder, FinancialProjectsQuery,
         FinancialProjectStructureForEdit, FinancialProject } from '@app/models';


@Injectable()
export class FinancialProjectsDataService {


  constructor(private http: HttpService) { }


  //#region CATALOGUES
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


  getStandardAccounts(projectUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}/standard-accounts`;

    return this.http.get<Identifiable[]>(path);
  }
  //#endregion


  //#region PROJECTS LIST
  searchProjects(query: FinancialProjectsQuery): EmpObservable<FinancialProjectDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/financial-projects/search';

    return this.http.post<FinancialProjectDescriptor[]>(path, query);
  }
  //#endregion


  //#region PROJECT (CRUD)
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
  //#endregion


  //#region PROJECT ACCOUNT (CRUD)
  getProjectAccount(projectUID: string,
                    accountUID: string): EmpObservable<FinancialAccount> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}`;

    return this.http.get<FinancialAccount>(path);
  }


  createProjectAccount(projectUID: string,
                       dataFields: FinancialAccountFields): EmpObservable<FinancialAccount> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/financial-projects/${projectUID}/accounts`;

    return this.http.post<FinancialAccount>(path, dataFields);
  }


  updateProjectAccount(projectUID: string,
                       accountUID: string,
                       dataFields: FinancialAccountFields): EmpObservable<FinancialAccount> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}`;

    return this.http.put<FinancialAccount>(path, dataFields);
  }


  removeProjectAccount(projectUID: string,
                       accountUID: string): EmpObservable<void> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}`;

    return this.http.delete<void>(path);
  }
  //#endregion


  //#region PROJECT ACCOUNT OPERATIONS
  getProjectAccountOperations(projectUID: string,
                              accountUID: string): EmpObservable<FinancialAccountOperationsStructure> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}/operations`;

    return this.http.get<FinancialAccountOperationsStructure>(path);
  }
  //#endregion

}
