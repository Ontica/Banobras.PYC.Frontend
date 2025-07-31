/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { TransactionStatus } from './transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';


export const CashTransactionStatusList: Identifiable<TransactionStatus>[] = [
  { uid: TransactionStatus.Pending,         name: 'Pendiente' },
  { uid: TransactionStatus.Closed,          name: 'Cerrada' },
];


export const CashLedgerOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excelEntries,
    name: 'Exportar movimientos'
  },
];


export interface CashLedgerQuery {
  status: TransactionStatus;
  fromAccountingDate?: DateString;
  toAccountingDate?: DateString;
  keywords: string;
  concept: string;
  cashAccounts: string[];
  voucherAccounts: string[];
  subledgerAccounts: string[];
  verificationNumbers: string[];
  accountingLedgerUID: string;
  transactionTypeUID: string;
  voucherTypeUID: string;
  sourceUID: string;
  entriesKeywords: string;
  fromRecordingDate?: DateString;
  toRecordingDate?: DateString;
  partyUID: string;
  projectTypeUID: string;
  projectUID: string;
  projectAccountUID: string;
}


export interface CashTransactionDescriptor {
  id: number;
  number: string;
  ledgerName: string;
  sourceName: string;
  transactionTypeName: string;
  recordingDate: DateString;
  elaboratedBy: string;
  voucherTypeName: string;
  accountingDate: DateString;
  concept: string;
  statusName: string;
}


export interface CashEntry {
  id: number;
  accountNumber: string;
  accountName: string;
  sectorCode: string;
  subledgerAccountNumber: string;
  subledgerAccountName: string;
  verificationNumber: string;
  responsibilityAreaName: string;
  currencyName: string;
  exchangeRate: number;
  debit: number;
  credit: number;
  cashAccount: Identifiable;
}


export interface CashTransactionActions {
  canUpdate: boolean;
}


export interface CashTransactionHolder {
  transaction: CashTransactionDescriptor,
  entries: CashEntry[];
  documents: Document[];
  history: HistoryEntry[];
  actions: CashTransactionActions;
}


export const EmptyCashLedgerQuery: CashLedgerQuery = {
  status: null,
  keywords: '',
  fromAccountingDate: '',
  toAccountingDate: '',
  fromRecordingDate: '',
  toRecordingDate: '',
  cashAccounts: [],
  voucherAccounts: [],
  subledgerAccounts: [],
  verificationNumbers: [],
  transactionTypeUID: '',
  accountingLedgerUID: '',
  voucherTypeUID: '',
  sourceUID: '',
  partyUID: '',
  projectUID: '',
  projectTypeUID: '',
  projectAccountUID: '',
  entriesKeywords: '',
  concept: '',
};


export const EmptyCashTransactionDescriptor: CashTransactionDescriptor = {
  id: null,
  number: '',
  ledgerName: '',
  concept: '',
  transactionTypeName: '',
  voucherTypeName: '',
  sourceName: '',
  accountingDate: '',
  recordingDate: '',
  elaboratedBy: '',
  statusName: '',
}


export const EmptyCashEntry: CashEntry = {
  id: null,
  accountNumber: '',
  accountName: '',
  sectorCode: '',
  subledgerAccountNumber: '',
  subledgerAccountName: '',
  verificationNumber: '',
  responsibilityAreaName: '',
  currencyName: '',
  exchangeRate: null,
  debit: null,
  credit: null,
  cashAccount: Empty,
};


export const EmptyCashTransactionActions: CashTransactionActions = {
  canUpdate: false,
};


export const EmptyCashTransactionHolder: CashTransactionHolder = {
  transaction: EmptyCashTransactionDescriptor,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyCashTransactionActions,
};
