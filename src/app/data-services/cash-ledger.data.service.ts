/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { CashEntriesOperationCommand, CashEntryDescriptor, CashLedgerOperationType, CashLedgerQuery,
         CashTransactionDescriptor, CashTransactionHolder, ExplorerOperationCommand, ExplorerOperationResult,
         FileReport } from '@app/models';


@Injectable()
export class CashLedgerDataService {


  constructor(private http: HttpService) { }


  getAccountingLedgers(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/cash-ledger/accounting-ledgers';

    return this.http.get<Identifiable[]>(path);
  }


  getTransactionSources(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/cash-ledger/transaction-sources';

    return this.http.get<Identifiable[]>(path);
  }


  getTransactionTypes(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/cash-ledger/transaction-types';

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherTypes(): EmpObservable<Identifiable[]> {
    const path = 'v1/cash-flow/cash-ledger/voucher-types';

    return this.http.get<Identifiable[]>(path);
  }


  searchCashTransactions(query: CashLedgerQuery): EmpObservable<CashTransactionDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/cash-flow/cash-ledger/transactions/search';

    return this.http.post<CashTransactionDescriptor[]>(path, query);
  }



  searchCashEntries(query: CashLedgerQuery): EmpObservable<CashEntryDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v1/cash-flow/cash-ledger/entries/search';

    return this.http.post<CashEntryDescriptor[]>(path, query);
  }


  bulkOperationCashTransactions(operationType: CashLedgerOperationType,
                                command: ExplorerOperationCommand): EmpObservable<ExplorerOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v1/cash-flow/cash-ledger/transactions/bulk-operation/${operationType}`;

    return this.http.post<ExplorerOperationResult>(path, command);
  }


  getCashTransaction(transactionID: number): EmpObservable<CashTransactionHolder> {
    Assertion.assertValue(transactionID, 'transactionID');

    const path = `v1/cash-flow/cash-ledger/transactions/${transactionID}`;

    return this.http.get<CashTransactionHolder>(path);
  }


  autoCodifyCashTransaction(transactionID: number): EmpObservable<CashTransactionHolder> {
    Assertion.assertValue(transactionID, 'transactionID');

    const path = `v1/cash-flow/cash-ledger/transactions/${transactionID}/auto-codify`;

    return this.http.post<CashTransactionHolder>(path);
  }


  executeCashEntriesOperation(transactionID: number,
                              command: CashEntriesOperationCommand): EmpObservable<CashTransactionHolder> {
    Assertion.assertValue(transactionID, 'transactionID');
    Assertion.assertValue(command, 'command');

    const path = `v1/cash-flow/cash-ledger/transactions/${transactionID}/execute-command`;

    return this.http.post<CashTransactionHolder>(path, command);
  }


  getCashTransactionForPrint(transactionID: number): EmpObservable<FileReport> {
    Assertion.assertValue(transactionID, 'transactionID');

    const path = `v1/cash-flow/cash-ledger/transactions/${transactionID}/print`;

    return this.http.get<FileReport>(path);
  }

}
