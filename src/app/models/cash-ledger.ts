/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, FlexibleIdentifiable, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';

import { TransactionStatus } from './transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';


export enum CashLedgerQueryType {
  transactions = '2',
  entries      = '1',
}


export const CashLedgerQueryTypesList: Identifiable<CashLedgerQueryType>[] = [
  { uid: CashLedgerQueryType.transactions, name: 'Pólizas' },
  { uid: CashLedgerQueryType.entries,      name: 'Movimientos'},
];


export const CashTransactionStatusList: Identifiable<TransactionStatus>[] = [
  { uid: TransactionStatus.Pending, name: 'Pendiente' },
  { uid: TransactionStatus.Closed,  name: 'Cerrada' },
];


export enum CashLedgerOperationType {
  autoCodify = 'auto-codify',
  excel      = 'excel',
}


export const AutoCodifyOperation: ExplorerOperation = {
  uid: CashLedgerOperationType.autoCodify,
  name: 'Codificación automática',
  showConfirm: true,
  confirmTitleWithoutName: true,
  confirmOperationMessage: 'ejecutará el proceso de codificación automática de',
  confirmQuestionMessage: 'Ejecuto el proceso de codificación automática de',
};


export const ExcelOperation: ExplorerOperation = {
  uid: CashLedgerOperationType.excel,
  name: 'Exportar'
};


export interface CashLedgerQuery {
  transactionStatus: TransactionStatus;
  cashAccountStatus: CashAccountStatus;
  fromAccountingDate?: DateString;
  toAccountingDate?: DateString;
  keywords: string;
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


export interface CashLedgerDescriptor {
  id: number;
}


export interface CashTransactionDescriptor extends CashLedgerDescriptor {
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


export interface CashEntryDescriptor extends CashLedgerDescriptor {
  id: number;

  transactionId: number;
  transactionNumber: string;
  transactionLedgerName: string;
  transactionRecordingDate: DateString;
  transactionAccountingDate: DateString;
  transactionConcept: string;

  accountNumber: string;
  accountName: string;
  parentAccountFullName: string;
  sectorCode: string;
  subledgerAccountNumber: string;
  subledgerAccountName: string;
  verificationNumber: string;
  responsibilityAreaCode: string;
  responsibilityAreaName: string;
  currencyId: number;
  currencyName: string;
  exchangeRate: number;
  debit: number;
  credit: number;
  cashAccountName: string;
}


export interface CashEntry {
  id: number;
  accountNumber: string;
  accountName: string;
  parentAccountFullName: string;
  sectorCode: string;
  subledgerAccountNumber: string;
  subledgerAccountName: string;
  verificationNumber: string;
  responsibilityAreaCode: string;
  responsibilityAreaName: string;
  budgetCode: string;
  description: string;
  date: DateString;
  currencyId: number;
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


export enum CashAccountStatus {
  CashAccountWaiting = -2,
  NoCashAccount      = -1,
  CashAccountPending = 0,
  WithCashAccount    = 1,
}


export const CashAccountStatusList: FlexibleIdentifiable[] = [
  { id: CashAccountStatus.CashAccountPending, name: 'Pendientes' },
  { id: CashAccountStatus.CashAccountWaiting, name: 'Con flujo pendiente'},
  { id: CashAccountStatus.WithCashAccount,    name: 'Con flujo asignado' },
  { id: CashAccountStatus.NoCashAccount,      name: 'Sin flujo' },
];


export enum CashEntriesOperation {
  MarkAsCashEntries        = 'MarkAsCashEntries',
  MarkAsCashEntriesWaiting = 'MarkAsCashEntriesWaiting',
  MarkAsNoCashEntries      = 'MarkAsNoCashEntries',
  RemoveCashEntries        = 'RemoveCashEntries',
}


export interface CashEntriesOperationCommand {
  operation: CashEntriesOperation;
  entries: number[];
  cashAccount?: string;
}


export const MarkAsCashEntriesWaitingOperation: ExplorerOperation = {
  uid: CashEntriesOperation.MarkAsCashEntriesWaiting,
  name: 'Marcar con flujo pendiente',
  showConfirm: true,
  confirmOperationMessage: 'marcará con flujo pendiente',
  confirmQuestionMessage: 'Marco con flujo pendiente'
};


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
  transactionStatus: null,
  cashAccountStatus: null,
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
  parentAccountFullName: '',
  subledgerAccountName: '',
  verificationNumber: '',
  responsibilityAreaCode: '',
  responsibilityAreaName: '',
  budgetCode: '',
  description: '',
  date: '',
  currencyId: null,
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
