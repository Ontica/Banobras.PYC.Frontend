/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable } from './base/data-table';

import { ExplorerOperation } from './base/explorer-data';

import { BillsStructure, EmptyBillsStructure } from './bills';

import { Budget, BudgetSegmentType } from './budgets';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { TransactionEntryItemType, TransactionEntryType, TransactionPartyType,
         TransactionStages, TransactionStatus } from './transactions';

import { TaxEntry } from './taxes';


export interface BudgetTypeForEdition {
  uid: string;
  name: string;
  multiyear: boolean;
  budgets: BudgetForEdition[];
}


export interface BudgetForEdition extends Budget {
  segmentTypes: BudgetSegmentType[];
  transactionTypes: BudgetTransactionType[];
}


export interface BudgetTransactionType {
  uid: string;
  name: string;
  askForAllowsOverdrafts: boolean;
  operationSources: Identifiable[];
  relatedDocumentTypes: Identifiable[];
  entriesRules: BudgetTransactionEntriesRules;
}


export interface BudgetTransactionEntriesRules {
  balanceColumns: Identifiable[];
  selectProduct: ProductRule;
  selectParty: boolean;
  years: number[];
}


export enum ProductRule {
  Requerido   = 'True',
  NoRequerido = 'False',
  Opcional    = 'Unknown',
}


export interface BudgetTransactionsQuery {
  stage: TransactionStages,
  status: TransactionStatus;
  basePartyUID: string;
  keywords: string;
  baseBudgetUID: string;
  transactionTypeUID: string;
  operationSourceUID: string;
  transactionNo: string[];
  budgetAccountNo: string[];
  controlNo: string[];
  fromDate: DateString;
  toDate: DateString;
  partyType: TransactionPartyType;
  partyUID: string;
}


export interface BudgetTransactionDescriptor {
  uid: string;
  transactionNo: string;
  basePartyName: string;
  budgetTypeName: string;
  budgetName: string;
  transactionTypeName: string;
  operationSourceName: string;
  baseEntityNo: string;
  recordedBy: string;
  authorizedBy: string;
  recordingDate: DateString;
  authorizationDate : DateString;
  total: number;
  rejectedReason: string;
  statusName: string;
}


 export interface BudgetTransactionFields {
  basePartyUID: string;
  baseBudgetUID: string;
  transactionTypeUID: string;
  operationSourceUID: string;
  applicationDate: DateString;
  justification: string;
  baseEntityTypeUID: string;
  baseEntityUID: string;
  allowsOverdrafts: boolean;
}


export interface BudgetTransactionRejectFields {
  message: string;
}


export interface BudgetTransactionHolder {
  transaction: BudgetTransaction,
  entries: BudgetTransactionEntryDescriptor[];
  groupedEntries: BudgetTransactionGroupedEntryData;
  taxes: TaxEntry[];
  bills: BillsStructure;
  relatedTransactions: BudgetTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: BudgetTransactionActions;
}


export interface BudgetTransaction {
  uid: string;
  transactionType: BudgetTransactionType;
  transactionNo: string;
  budgetType: Identifiable;
  budget: Identifiable;
  baseParty: Identifiable;
  operationSource: Identifiable;
  baseEntityType: Identifiable;
  baseEntity: BaseEntity;
  baseEntityNo: string;
  allowsOverdrafts: boolean;
  justification: string;
  requestedBy: Identifiable;
  authorizedBy: Identifiable;
  appliedBy: Identifiable;
  recordedBy: Identifiable;
  requestedDate: DateString;
  authorizationDate: DateString;
  applicationDate: DateString;
  recordingDate: DateString;
  total: number;
  rejectedReason: string;
  status: Identifiable;
}


export interface BaseEntity extends Identifiable {
  uid: string;
  name: string;
  entityNo?: string;
  type?: Identifiable;
}


export interface BudgetTransactionEntryBaseDescriptor {
  uid: string;
  balanceColumn: string;
  partyName: string;
  budgetAccountName: string;
  itemType: TransactionEntryItemType;
}


export interface BudgetTransactionEntryDescriptor extends BudgetTransactionEntryBaseDescriptor {
  uid: string;
  partyName: string;
  budgetAccountCode: string;
  budgetAccountName: string;
  productCode: string;
  controlNo: string;
  description: string;
  program: string;
  year: number;
  month: number;
  monthName: string;
  day: number;
  balanceColumn: string;
  deposit: number;
  withdrawal: number;
  itemType: TransactionEntryItemType;
}


export interface BudgetTransactionEntryByYearDescriptor extends BudgetTransactionEntryBaseDescriptor {
  uid: string;
  balanceColumn: string;
  partyName: string;
  budgetAccount: string;
  total: number;
  itemType: TransactionEntryItemType;
}


export interface BudgetTransactionGroupedEntryData extends DataTable {
  entries: BudgetTransactionEntryByYearDescriptor[];
}


export interface BudgetTransactionEntryBase {
  uid: string;
  entryType: TransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
  party: Identifiable;
  budgetAccount: Identifiable;
  product: Identifiable;
  productUnit: Identifiable;
  description: string;
  project: Identifiable;
  year: number;
  currency: Identifiable;
}


export interface BudgetTransactionEntry extends BudgetTransactionEntryBase {
  uid: string;
  entryType: TransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
  party: Identifiable;
  budgetAccount: Identifiable;
  product: Identifiable;
  productUnit: Identifiable;
  productQty: number;
  project: Identifiable;
  year: number;
  month: Identifiable;
  day: number;
  currency: Identifiable;
  originalAmount: number;
  amount: number;
  exchangeRate: number;
  description: string;
  justification: string;
  status: Identifiable;
}


export interface BudgetTransactionEntryByYear extends BudgetTransactionEntryBase {
  uid: string;
  entryType: TransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
  party: Identifiable;
  budgetAccount: Identifiable;
  project: Identifiable;
  product: Identifiable;
  productUnit: Identifiable;
  year: number;
  description: string;
  justification: string;
  currency: Identifiable;
  amounts: BudgetMonthEntry[];
}


export interface BudgetMonthEntry {
  budgetEntryUID: string;
  month: number;
  productQty: number;
  amount: number;
}


export interface BudgetTransactionEntryFields {
  balanceColumnUID: string;
  budgetAccountUID: string;
  year: number;
  month: string;
  amount: number;
  projectUID: string;
  productUID: string;
  productUnitUID: string;
  productQty: number;
  description: string;
  justification: string;
}


export interface BudgetTransactionEntryByYearFields {
  balanceColumnUID: string;
  budgetAccountUID: string;
  year: number
  projectUID: string;
  productUID: string;
  productUnitUID: string;
  description: string;
  justification: string;
  amounts: BudgetMonthEntryFields[];
}


export interface BudgetMonthEntryFields {
  budgetEntryUID: string;
  month: number;
  amount: number;
  productQty: number;
  label?: string;
}


export interface BudgetTransactionActions {
  canUpdate: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canSendToAuthorization: boolean;
  canAuthorize: boolean;
  canReject: boolean;
  canClose: boolean;
  canClone: boolean;
  canEditDocuments: boolean;
}


export enum BudgetTransactionsOperationType {
  exportEntriesGrouped   = 'export-entries-grouped',
  exportEntriesUngrouped = 'export-entries-ungrouped',
}


export const BudgetTransactionsOperationsList: ExplorerOperation[] = [
  {
    uid: BudgetTransactionsOperationType.exportEntriesGrouped,
    name: 'Exportar movimientos agrupados por mes'
  },
  {
    uid: BudgetTransactionsOperationType.exportEntriesUngrouped,
    name: 'Exportar movimientos sin agrupar'
  },
];


export const EmptyBudgetTransactionsQuery: BudgetTransactionsQuery = {
  stage: null,
  status: null,
  transactionTypeUID: '',
  keywords: '',
  baseBudgetUID: '',
  operationSourceUID: '',
  transactionNo: [],
  budgetAccountNo: [],
  controlNo: [],
  fromDate: '',
  toDate: '',
  partyType: TransactionPartyType.RequestedBy,
  partyUID: '',
  basePartyUID: '',
};



export const EmptyBudgetTransactionType: BudgetTransactionType = {
  uid: '',
  name: '',
  askForAllowsOverdrafts: false,
  operationSources: [],
  relatedDocumentTypes: [],
  entriesRules: {
    balanceColumns: [],
    selectProduct: ProductRule.NoRequerido,
    selectParty: false,
    years: [],
  },
}


export const EmptyBudgetTransaction: BudgetTransaction = {
  uid: '',
  transactionType: EmptyBudgetTransactionType,
  transactionNo: '',
  budgetType: Empty,
  budget: Empty,
  baseParty: Empty,
  operationSource: Empty,
  baseEntityType: Empty,
  baseEntity: Empty,
  baseEntityNo: '',
  allowsOverdrafts: false,
  justification: '',
  requestedBy: Empty,
  authorizedBy: Empty,
  appliedBy: Empty,
  recordedBy: Empty,
  requestedDate: '',
  authorizationDate: '',
  applicationDate: '',
  recordingDate: '',
  total: null,
  rejectedReason: '',
  status: Empty,
}


export const EmptyBudgetTransactionGroupedEntryData: BudgetTransactionGroupedEntryData = {
  query: {},
  columns: [],
  entries: [],
}


export const EmptyBudgetTransactionActions: BudgetTransactionActions = {
  canUpdate: false,
  canCancel: false,
  canDelete: false,
  canSendToAuthorization: false,
  canAuthorize: false,
  canReject: false,
  canClose: false,
  canClone: false,
  canEditDocuments: false,
}


export const EmptyBudgetTransactionHolder: BudgetTransactionHolder = {
  transaction: EmptyBudgetTransaction,
  entries: [],
  groupedEntries: EmptyBudgetTransactionGroupedEntryData,
  taxes: [],
  bills: EmptyBillsStructure,
  relatedTransactions: [],
  documents: [],
  history: [],
  actions: EmptyBudgetTransactionActions,
};


export const EmptyBudgetTransactionEntryBase: BudgetTransactionEntryBase = {
  uid: '',
  entryType: null,
  transactionUID: '',
  balanceColumn: Empty,
  party: Empty,
  budgetAccount: Empty,
  product: Empty,
  productUnit: Empty,
  project: Empty,
  year: null,
  currency: Empty,
  description: '',
};


export const EmptyBudgetTransactionEntryByYear: BudgetTransactionEntryByYear = {
  uid: '',
  entryType: null,
  transactionUID: '',
  balanceColumn: Empty,
  party: Empty,
  budgetAccount: Empty,
  project: Empty,
  product: Empty,
  productUnit: Empty,
  year: null,
  currency: Empty,
  description: '',
  justification: '',
  amounts: [],
};


export const EmptyBudgetTransactionEntry: BudgetTransactionEntry = {
  uid: '',
  entryType: null,
  transactionUID: '',
  balanceColumn: Empty,
  party: Empty,
  budgetAccount: Empty,
  product: Empty,
  productUnit: Empty,
  productQty: null,
  project: Empty,
  year: null,
  month: Empty,
  day: null,
  currency: Empty,
  originalAmount: null,
  amount: null,
  exchangeRate: null,
  description: '',
  justification: '',
  status: Empty,
};


export function mapBudgetTransactionDescriptorFromTransaction(data: BudgetTransaction): BudgetTransactionDescriptor {
  return {
    uid: data.uid,
    transactionNo: data.transactionNo,
    basePartyName: data.baseParty.name,
    budgetTypeName: data.budgetType.name,
    budgetName: data.budget.name,
    transactionTypeName: data.transactionType.name,
    operationSourceName: data.operationSource.name,
    baseEntityNo: data.baseEntityNo,
    recordedBy: data.recordedBy.name,
    authorizedBy: data.authorizedBy.name,
    recordingDate: data.recordingDate,
    authorizationDate: data.authorizationDate,
    total: data.total,
    rejectedReason: data.rejectedReason,
    statusName: data.status.name,
  };
}
