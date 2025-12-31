/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { map } from 'rxjs';

import { ExternalAccountFields, FileReport, FinancialAccount, FinancialAccountDescriptor,
         FinancialAccountFields, FinancialAccountHolder, FinancialAccountOperationFields,
         FinancialAccountOperationsStructure, FinancialAccountsQuery } from '@app/models';


@Injectable()
export class FinancialAccountsDataService {


  constructor(private http: HttpService) { }


  //#region FINANCIAL PROJECTS ACCOUNTS
  getProjectAccountsTypes(): EmpObservable<Identifiable[]> {
    const path = `v1/financial-projects/financial-accounts-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getProjectStandardAccounts(projectUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(projectUID, 'projectUID');

    const path = `v1/financial-projects/${projectUID}/standard-accounts`;

    return this.http.get<Identifiable[]>(path);
  }


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


  //#region FINANCIAL-ACCOUNTS
  searchAccounts(query: FinancialAccountsQuery): EmpObservable<FinancialAccountDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounts/search`;

    return this.http.post<FinancialAccountDescriptor[]>(path, query);
  }


  exportAccounts(query: FinancialAccountsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounts/export`;

    return this.http.post<FileReport>(path, query);
  }


  getAccountData(accountUID: string): EmpObservable<FinancialAccountHolder> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}`;

    return this.http.get<FinancialAccountHolder>(path);
  }
  //#endregion


  //#region FINANCIAL-ACCOUNTS CRUD
  getStandardAccounts(chartOfAccountsUID: string,
                      accountTypeUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(chartOfAccountsUID, 'chartOfAccountsUID');
    Assertion.assertValue(accountTypeUID, 'accountTypeUID');

    const path = `v3/charts-of-accounts/${chartOfAccountsUID}/standard-accounts/types/${accountTypeUID}`;

    return this.http.get<Identifiable[]>(path);
  }


  getAccount(accountUID: string): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}`;

    return new EmpObservable<FinancialAccount>(
      this.http.get<FinancialAccountHolder>(path).pipe(map(x => x.account))
    );
  }


  createAccount(dataFields: FinancialAccountFields): EmpObservable<FinancialAccount> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/financial-accounts`;

    return this.http.post<FinancialAccount>(path, dataFields);
  }


  updateAccount(accountUID: string,
                dataFields: FinancialAccountFields): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/financial-accounts/${accountUID}`;

    return this.http.put<FinancialAccount>(path, dataFields);
  }


  removeAccount(accountUID: string): EmpObservable<void> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}`;

    return this.http.delete<void>(path);
  }


  activateAccount(accountUID: string): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}/activate`;

    return this.http.post<FinancialAccount>(path);
  }


  suspendAccount(accountUID: string): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}/suspend`;

    return this.http.post<FinancialAccount>(path);
  }
  //#endregion


  //#region EXTERNAL-SYSTEMS
  getAccountFromCreditSystem(accountNo: string): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountNo, 'accountNo');

    const path = `v2/financial-accounts/external-systems/credit/${accountNo}`;

    return this.http.get<FinancialAccount>(path);
  }


  createAccountFromCreditSystem(accountNo: string, dataFields: ExternalAccountFields): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountNo, 'accountNo');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/financial-accounts/external-systems/credit/${accountNo}/create`;

    return this.http.post<FinancialAccount>(path, dataFields);
  }


  refreshAccountFromCreditSystem(accountUID: string): EmpObservable<FinancialAccount> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/external-systems/credit/${accountUID}/refresh`;

    return this.http.put<FinancialAccount>(path, null);
  }
  //#endregion


  //#region OPERATIONS
  getProjectAccountOperations(projectUID: string,
                              accountUID: string): EmpObservable<FinancialAccountOperationsStructure> {
    Assertion.assertValue(projectUID, 'projectUID');
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v1/financial-projects/${projectUID}/accounts/${accountUID}/operations`;

    return this.http.get<FinancialAccountOperationsStructure>(path);
  }


  getAccountOperations(accountUID: string): EmpObservable<FinancialAccountOperationsStructure> {
    Assertion.assertValue(accountUID, 'accountUID');

    const path = `v2/financial-accounts/${accountUID}/operations`;

    return this.http.get<FinancialAccountOperationsStructure>(path);
  }


  addAccountOperation(accountUID: string,
                      dataFields: FinancialAccountOperationFields): EmpObservable<FinancialAccountOperationsStructure> {
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/financial-accounts/${accountUID}/operations`;

    return this.http.post<FinancialAccountOperationsStructure>(path, dataFields);
  }


  removeAccountOperation(accountUID: string,
                         operationUID: string): EmpObservable<FinancialAccountOperationsStructure> {
    Assertion.assertValue(accountUID, 'accountUID');
    Assertion.assertValue(operationUID, 'operationUID');

    const path = `v2/financial-accounts/${accountUID}/operations/${operationUID}`;

    return this.http.delete<FinancialAccountOperationsStructure>(path);
  }
  //#endregion

}
