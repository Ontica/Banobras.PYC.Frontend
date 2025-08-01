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
  { uid: TransactionStatus.Pending, name: 'Pendiente' },
  { uid: TransactionStatus.Closed,  name: 'Cerrada' },
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
  status: TransactionStatus;
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

  cashAccountEdit: string;
  canEditCashFlow: boolean;
}


export interface CashTransactionActions {
  canUpdate: boolean;
  canEditDocuments: boolean;
}


export interface CashTransactionHolder {
  transaction: CashTransactionDescriptor,
  entries: CashEntry[];
  documents: Document[];
  history: HistoryEntry[];
  actions: CashTransactionActions;
}


export enum CashEntriesOperation {
  MarkAsCashEntries   = 'MarkAsCashEntries',
  MarkAsNoCashEntries = 'MarkAsNoCashEntries',
  RemoveCashEntries   = 'RemoveCashEntries',
}


export interface CashEntriesOperationCommand {
  operation: CashEntriesOperation;
  entries: number[];
  cashAccount?: string;
}


export const MarkAsNoCashEntriesOperation: ExplorerOperation = {
  uid: CashEntriesOperation.MarkAsNoCashEntries,
  name: 'Marcar sin flujo',
  showConfirm: true,
  confirmOperationMessage: 'marcará sin flujo',
  confirmQuestionMessage: 'Marco sin flujo'
};


export const RemoveCashEntriesOperation: ExplorerOperation = {
  uid: CashEntriesOperation.RemoveCashEntries,
  name: 'Descartar cambios de flujo',
  showConfirm: true,
  confirmOperationMessage: 'descartará los cambios del flujo de',
  confirmQuestionMessage: 'Descarto los cambios del flujo de'
};


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
  status: null,
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

  cashAccountEdit: null,
  canEditCashFlow: false,
};


export const EmptyCashTransactionActions: CashTransactionActions = {
  canUpdate: false,
  canEditDocuments: false,
};


export const EmptyCashTransactionHolder: CashTransactionHolder = {
  transaction: EmptyCashTransactionDescriptor,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyCashTransactionActions,
};
