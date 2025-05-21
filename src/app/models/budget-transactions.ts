/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable } from './_data-table';

import { ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Budget, BudgetSegmentType } from './budgets';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { TransactionDateType, TransactionPartyType, TransactionStages,
         TransactionStatus } from './transactions';


export interface BudgetTypeForEdition {
  uid: string;
  name: string;
  multiyear: boolean;
  budgets: BudgetForEdition[];
}


export interface BudgetForEdition extends Budget {
  operationSources: Identifiable[];
  segmentTypes: BudgetSegmentType[];
  transactionTypes: BudgetTransactionType[];
}


export interface BudgetTransactionType {
  uid: string;
  name: string;
  operationSources: Identifiable[];
  relatedDocumentTypes: Identifiable[];
  entriesRules: BudgetTransactionEntriesRules;
}


export interface BudgetTransactionEntriesRules {
  balanceColumns: Identifiable[];
  selectProduct: ProductRule;
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
  budgetTypeUID: string;
  baseBudgetUID: string;
  transactionTypeUID: string;
  operationSourceUID: string;
  entriesKeywords: string;
  transactionsNo: string[];
  tags: string[];
  dateType: TransactionDateType;
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
  recordedBy: string;
  authorizedBy: string;
  recordingDate: DateString;
  authorizationDate : DateString;
  total: number;
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
}


export interface BudgetTransactionRejectFields {
  message: string;
}


export interface BudgetTransactionHolder {
  transaction: BudgetTransaction,
  entries: BudgetTransactionEntryDescriptor[];
  groupedEntries: BudgetTransactionGroupedEntryData;
  documents: Document[];
  history: HistoryEntry[];
  actions: TransactionActions;
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
  baseEntity: Identifiable;
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
  status: Identifiable;
}


export interface BudgetTransactionEntryBaseDescriptor {
  uid: string;
  balanceColumn: string;
  budgetAccountName: string;
  itemType: 'Entry' | 'Total';
}


export interface BudgetTransactionEntryDescriptor extends BudgetTransactionEntryBaseDescriptor {
  uid: string;
  budgetAccountName: string;
  year: number;
  month: number;
  monthName: string;
  day: number;
  balanceColumn: string;
  deposit: number;
  withdrawal: number;
  itemType: 'Entry' | 'Total';
}


export interface BudgetTransactionEntryByYearDescriptor extends BudgetTransactionEntryBaseDescriptor {
  uid: string;
  balanceColumn: string;
  budgetAccount: string;
  total: number;
  itemType: 'Entry' | 'Total';
}


export interface BudgetTransactionGroupedEntryData extends DataTable {
  entries: BudgetTransactionEntryByYearDescriptor[];
}


export interface BudgetTransactionEntryBase {
  uid: string;
  entryType: BudgetTransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
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
  entryType: BudgetTransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
  budgetAccount: Identifiable;
  product: Identifiable;
  productUnit: Identifiable;
  productQty: number;
  project: Identifiable;
  party: Identifiable;
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
  entryType: BudgetTransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
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


export enum BudgetTransactionEntryType {
  Annually = 'Annually',
  Monthly  = 'Monthly',
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


export interface TransactionActions {
  canUpdate: boolean;
  canDelete: boolean;
  canSendToAuthorization: boolean;
  canAuthorize: boolean;
  canReject: boolean;
  canClose: boolean;
  canClone: boolean;
  canEditDocuments: boolean;
}


export const BudgetTransactionsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excelEntries,
    name: 'Exportar movimientos'
  },
];


export const EmptyBudgetTransactionsQuery: BudgetTransactionsQuery = {
  stage: null,
  status: null,
  transactionTypeUID: '',
  keywords: '',
  budgetTypeUID: '',
  baseBudgetUID: '',
  operationSourceUID: '',
  transactionsNo: [],
  entriesKeywords: '',
  tags: [],
  dateType: TransactionDateType.Requested,
  fromDate: '',
  toDate: '',
  partyType: TransactionPartyType.RequestedBy,
  partyUID: '',
  basePartyUID: '',
};



export const EmptyBudgetTransactionType: BudgetTransactionType = {
  uid: '',
  name: '',
  operationSources: [],
  relatedDocumentTypes: [],
  entriesRules: {
    balanceColumns: [],
    selectProduct: ProductRule.NoRequerido,
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
  status: Empty,
}


export const EmptyBudgetTransactionGroupedEntryData: BudgetTransactionGroupedEntryData = {
  query: {},
  columns: [],
  entries: [],
}


export const EmptyTransactionActions: TransactionActions = {
  canUpdate: false,
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
  documents: [],
  history: [],
  actions: EmptyTransactionActions,
};


export const EmptyBudgetTransactionEntryBase: BudgetTransactionEntryBase = {
  uid: '',
  entryType: null,
  transactionUID: '',
  balanceColumn: Empty,
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
  budgetAccount: Empty,
  product: Empty,
  productUnit: Empty,
  productQty: null,
  project: Empty,
  party: Empty,
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
    recordedBy: data.recordedBy.name,
    authorizedBy: data.authorizedBy.name,
    recordingDate: data.recordingDate,
    authorizationDate: data.authorizationDate,
    total: data.total,
    statusName: data.status.name,
  };
}
