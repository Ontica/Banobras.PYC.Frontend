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

import { History } from './history';


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
  selectProduct: ThreeStateValue;
  years: number[];
}


export enum ThreeStateValue {
  True    = 'True',
  False   = 'False',
  Unknown = 'Unknown',
}


export enum BudgetTransactionsStatus {
  Pending         = 'Pending',
  OnAuthorization = 'OnAuthorization',
  Authorized      = 'Authorized',
  Closed          = 'Closed',
  Rejected        = 'Rejected',
  Canceled        = 'Canceled',
  Deleted         = 'Deleted',
}


export const BudgetTransactionStatusList: Identifiable<BudgetTransactionsStatus>[] = [
  { uid: BudgetTransactionsStatus.Pending,         name: 'Pendiente' },
  { uid: BudgetTransactionsStatus.OnAuthorization, name: 'En autorización' },
  { uid: BudgetTransactionsStatus.Authorized,      name: 'Autorizada' },
  { uid: BudgetTransactionsStatus.Closed,          name: 'Cerrada' },
  { uid: BudgetTransactionsStatus.Rejected,        name: 'Rechazada' },
  { uid: BudgetTransactionsStatus.Canceled,        name: 'Cancelada' },
  { uid: BudgetTransactionsStatus.Deleted,         name: 'Eliminada' },
];


export enum BudgetTransactionQueryDateType {
  Requested    = 'Requested',
  Registered   = 'Registered',
  Authorizated = 'Authorizated',
  Completed    = 'Completed',
  None         = 'None',
}


export const BudgetTransactionQueryDateTypesList: Identifiable<BudgetTransactionQueryDateType>[] = [
  { uid: BudgetTransactionQueryDateType.Requested,    name: 'Fecha de solicitud' },
  { uid: BudgetTransactionQueryDateType.Registered,   name: 'Fecha de registro' },
  { uid: BudgetTransactionQueryDateType.Authorizated, name: 'Fecha de autorización' },
  { uid: BudgetTransactionQueryDateType.Completed,    name: 'Fecha de completación' },
];


export enum BudgetTransactionPartyType {
  RequestedBy  = 'RequestedBy',
  RegisteredBy = 'RegisteredBy',
  AuthorizedBy = 'AuthorizedBy',
  CompletedBy  = 'CompletedBy',
  None         = 'None',
}


export const BudgetTransactionPartyTypesList: Identifiable<BudgetTransactionPartyType>[] = [
  { uid: BudgetTransactionPartyType.RequestedBy,  name: 'Solicitado por' },
  { uid: BudgetTransactionPartyType.RegisteredBy, name: 'Registrado por' },
  { uid: BudgetTransactionPartyType.AuthorizedBy, name: 'Autorizado por' },
  { uid: BudgetTransactionPartyType.CompletedBy,  name: 'Completado por' },
];


export enum BudgetTransactionsStages {
  MyInbox     = 'BudgetTransactions.MyInbox',
  ControlDesk = 'BudgetTransactions.ControlDesk',
}



export const BudgetTransactionsStagesList: Identifiable<BudgetTransactionsStages>[] = [
  { uid: BudgetTransactionsStages.MyInbox,     name: 'Mis transacciones' },
  { uid: BudgetTransactionsStages.ControlDesk, name: 'Mesa de control' },
];


export interface BudgetTransactionsQuery {
  stage: BudgetTransactionsStages,
  status: BudgetTransactionsStatus;
  basePartyUID: string;
  keywords: string;
  budgetTypeUID: string;
  baseBudgetUID: string;
  transactionTypeUID: string;
  operationSourceUID: string;
  entriesKeywords: string;
  transactionsNo: string[];
  tags: string[];
  dateType: BudgetTransactionQueryDateType;
  fromDate: DateString;
  toDate: DateString;
  partyType: BudgetTransactionPartyType;
  partyUID: string;
}


export interface BudgetTransactionDescriptor {
  uid: string;
  transactionNo: string;
  basePartyName: string;
  budgetTypeName: string;
  budgetName: string;
  transactionTypeName: string;
  requestedDate: DateString;
  operationSourceName: string;
  applicationDate: DateString;
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


export interface BudgetTransactionHolder {
  transaction: BudgetTransaction,
  entries: BudgetTransactionEntryDescriptor[];
  groupedEntries: BudgetTransactionGroupedEntryData;
  documents: Document[];
  history: History[];
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
  requestedDate: DateString;
  applicationDate: DateString;
  total: number;
  status: Identifiable;
}


export interface BudgetTransactionEntryDescriptor {
  uid: string;
  budgetAccountCode: string;
  budgetAccountName: string;
  year: number;
  month: number;
  monthName: string;
  day: number;
  balanceColumn: string;
  deposit: number;
  withdrawal: number;
}


export interface BudgetTransactionGroupedEntryData extends DataTable {

}


export enum BudgetEntryTypes {
  Debit  = 'Debit',
  Credit = 'Credit',
}


export interface BudgetTransactionEntry {
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


export interface BudgetEntryByYear {
  uid: string;
  entryType: BudgetTransactionEntryType;
  transactionUID: string;
  balanceColumn: Identifiable;
  budgetAccount: Identifiable;
  product: Identifiable;
  description: string;
  productUnit: Identifiable;
  project: Identifiable;
  year: number;
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


export interface BudgetEntryFields {
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


export interface BudgetEntryByYearFields {
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
  canClone: boolean;
  canEditDocuments: boolean;
}


export const BudgetTransactionsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: ExplorerOperationType.print,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: ExplorerOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
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
  dateType: BudgetTransactionQueryDateType.Requested,
  fromDate: '',
  toDate: '',
  partyType: BudgetTransactionPartyType.RequestedBy,
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
    selectProduct: ThreeStateValue.Unknown,
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
  applicationDate: '',
  requestedDate: '',
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
    requestedDate: data.requestedDate,
    operationSourceName: data.operationSource.name,
    applicationDate: data.applicationDate,
    total: data.total,
    statusName: data.status.name,
  };
}
