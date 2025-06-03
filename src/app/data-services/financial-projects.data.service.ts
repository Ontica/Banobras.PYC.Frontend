/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FinancialAccountOperations, FinancialProjectAccount, FinancialProjectAccountFields,
         FinancialProjectDescriptor, FinancialProjectFields, FinancialProjectHolder,
         FinancialProjectOrgUnitsForEdition, FinancialProjectsQuery } from '@app/models';


@Injectable()
export class FinancialProjectsDataService {


  constructor(private http: HttpService) { }


  //#region CATALOGUES
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


  getStandardAccounts(projectUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}/standard-accounts`;

    return this.http.get<Identifiable[]>(path);
  }


  getFinancialAccountsTypes(projectUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}/financial-accounts-types`;

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


  //#region PROJECT (CRUD + OPERATIONS)
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
  //#endregion


  //#region PROJECT ACCOUNT (CRUD)
  getProjectAccount(projectUID: string,
                    accountUID: string): EmpObservable<FinancialProjectAccount> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}`;

    return this.http.get<FinancialProjectAccount>(path);
  }


  createProjectAccount(projectUID: string,
                       dataFields: FinancialProjectAccountFields): EmpObservable<FinancialProjectAccount> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/financial-projects/${projectUID}/accounts`;

    return this.http.post<FinancialProjectAccount>(path, dataFields);
  }


  updateProjectAccount(projectUID: string,
                       accountUID: string,
                       dataFields: FinancialProjectAccountFields): EmpObservable<FinancialProjectAccount> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}`;

    return this.http.put<FinancialProjectAccount>(path, dataFields);
  }


  removeProjectAccount(projectUID: string,
                       accountUID: string): EmpObservable<void> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}`;

    return this.http.delete<void>(path);
  }
  //#endregion


  //#region PROJECT ACCOUNT OPERATIONS (CRD)
  getAccountOperations(projectUID: string,
                       accountUID: string): EmpObservable<FinancialAccountOperations> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}/operations`;

    return this.http.get<FinancialAccountOperations>(path);
  }


  addAccountOperation(projectUID: string,
                      accountUID: string,
                      operationUID: string): EmpObservable<FinancialAccountOperations> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(operationUID, 'operationUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}/operations/${operationUID}`;

    return this.http.post<FinancialAccountOperations>(path);
  }


  removeAccountOperation(projectUID: string,
                         accountUID: string,
                         operationUID: string): EmpObservable<FinancialAccountOperations> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(operationUID, 'operationUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}/operations/${operationUID}`;

    return this.http.delete<FinancialAccountOperations>(path);
  }
  //#endregion

}
