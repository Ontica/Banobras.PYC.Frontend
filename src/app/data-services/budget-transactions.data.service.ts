/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { BudgetAccount, BudgetTransactionEntryByYear, BudgetTransactionEntryByYearFields,
         BudgetTransactionEntryFields, BudgetTransactionDescriptor, BudgetTransactionEntry,
         BudgetTransactionFields, BudgetTransactionHolder, BudgetTransactionsQuery,
         BudgetTransactionRejectFields, BudgetTypeForEdition, FileReport, ExplorerOperationType,
         ExplorerOperationCommand, ExplorerOperationResult, ImportBudgetTransactionsCommand,
         ImportBudgetTransactionsResult } from '@app/models';


@Injectable()
export class BudgetTransactionsDataService {


  constructor(private http: HttpService) { }


  //#region CATALOGUES
  getBudgetTypesForTransactionEdition(): EmpObservable<BudgetTypeForEdition[]> {
    const path = `v2/budgeting/budget-types/for-transaction-edition`;

    return this.http.get<BudgetTypeForEdition[]>(path);
  }


  getOrganizationalUnitsForTransactionEdition(budgetUID: string,
                                              transactionTypeUID: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(budgetUID, 'budgetUID');
    Assertion.assertValue(transactionTypeUID, 'transactionTypeUID');

    const path = `v2/budgeting/organizational-units/for-transaction-edition` +
      `?budgetUID=${budgetUID}&transactionTypeUID=${transactionTypeUID}`;

    return this.http.get<Identifiable[]>(path);
  }


  getOperationSources(): EmpObservable<Identifiable[]> {
    const path = 'v2/budgeting/transactions/operation-sources';

    return this.http.get<Identifiable[]>(path);
  }
  //#endregion CATALOGUES


  //#region TRANSACTIONS LIST
  searchTransactions(query: BudgetTransactionsQuery): EmpObservable<BudgetTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/budgeting/transactions/search';

    return this.http.post<BudgetTransactionDescriptor[]>(path, query);
  }


  bulkOperationTransactions(operationType: ExplorerOperationType,
                            command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/budgeting/transactions/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }


  generatePlanningTransactions(): EmpObservable<ExplorerOperationResult> {
    const path = `v2/budgeting/transactions/planning/generate`;

    return this.http.post<ExplorerOperationResult>(path);
  }
  //#endregion TRANSACTIONS


  //#region IMPORT TRANSACTIONS
  importTransactions(file: File,
                     command: ImportBudgetTransactionsCommand): EmpObservable<ImportBudgetTransactionsResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(command, 'command');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(command));

    const path = `v2/budgeting/transactions/import-excel`;

    return this.http.post<ImportBudgetTransactionsResult>(path, formData);
  }
  //#endregion IMPORT TRANSACTIONS


  //#region TRANSACTION (CRUD + OPERATIONS)
  getTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.get<BudgetTransactionHolder>(path);
  }


  getTransactionForPrint(transactionUID: string): EmpObservable<FileReport> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}/print`;

    return this.http.get<FileReport>(path);
  }


  createTransaction(dataFields: BudgetTransactionFields): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions`;

    return this.http.post<BudgetTransactionHolder>(path, dataFields);
  }


  updateTransaction(transactionUID: string,
                    dataFields: BudgetTransactionFields): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.put<BudgetTransactionHolder>(path, dataFields);
  }


  sendToAuthorizationTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}/send-to-authorization`;

    return this.http.post<BudgetTransactionHolder>(path);
  }


  authorizeTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}/authorize`;

    return this.http.post<BudgetTransactionHolder>(path);
  }


  rejectTransaction(transactionUID: string,
                    dataFields: BudgetTransactionRejectFields): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}/reject`;

    return this.http.post<BudgetTransactionHolder>(path, dataFields);
  }


  closeTransaction(transactionUID: string): EmpObservable<BudgetTransactionHolder> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}/close`;

    return this.http.post<BudgetTransactionHolder>(path);
  }


  deleteTransaction(transactionUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');

    const path = `v2/budgeting/transactions/${transactionUID}`;

    return this.http.delete<void>(path);
  }
  //#endregion TRANSACTION


  //#region TRANSACTION ENTRY (CRUD MONTHLY & ANNUALLY)
  getTransactionEntry(transactionUID: string,
                      entryUID: string): EmpObservable<BudgetTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.get<BudgetTransactionEntry>(path);
  }


  createTransactionEntry(transactionUID: string,
                         dataFields: BudgetTransactionEntryFields): EmpObservable<BudgetTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}/entries`;

    return this.http.post<BudgetTransactionEntry>(path, dataFields);
  }


  updateTransactionEntry(transactionUID: string,
                         entryUID: string,
                         dataFields: BudgetTransactionEntryFields): EmpObservable<BudgetTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.put<BudgetTransactionEntry>(path, dataFields);
  }


  removeTransactionEntry(transactionUID: string,
                         entryUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryUID, 'entryUID');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/${entryUID}`;

    return this.http.delete<void>(path);
  }


  getTransactionEntriesByYear(transactionUID: string,
                              entryByYearUID: string): EmpObservable<BudgetTransactionEntry> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryByYearUID, 'entryByYearUID');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/${entryByYearUID}/get-annually`;

    return this.http.get<BudgetTransactionEntry>(path);
  }


  createTransactionEntriesByYear(transactionUID: string,
                                 dataFields: BudgetTransactionEntryByYearFields): EmpObservable<BudgetTransactionEntryByYear> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/create-annually`;

    return this.http.post<BudgetTransactionEntryByYear>(path, dataFields);
  }


  updateTransactionEntriesByYear(transactionUID: string,
                                 entryByYearUID: string,
                                 dataFields: BudgetTransactionEntryByYearFields): EmpObservable<BudgetTransactionEntryByYear> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryByYearUID, 'entryByYearUID');
    Assertion.assertValue(dataFields, 'dataFields');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/${entryByYearUID}/update-annually`;

    return this.http.put<BudgetTransactionEntryByYear>(path, dataFields);
  }


  removeTransactionEntriesByYear(transactionUID: string,
                                 entryByYearUID: string): EmpObservable<void> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(entryByYearUID, 'entryByYearUID');

    const path = `v2/budgeting/transactions/${transactionUID}/entries/${entryByYearUID}/remove-annually`;

    return this.http.delete<void>(path);
  }


  requestBudgetAccount(transactionUID: string,
                       segmentUID: string): EmpObservable<BudgetAccount> {
    Assertion.assertValue(transactionUID, 'transactionUID');
    Assertion.assertValue(segmentUID, 'segmentUID');

    const path = `v2/budgeting/transactions/${transactionUID}/request-account/${segmentUID}`;

    return this.http.post<BudgetAccount>(path);
  }
  //#endregion TRANSACTION ENTRY

}
