/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { DataTable } from './_data-table';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { TransactionDateType, TransactionEntryItemType, TransactionEntryType, TransactionPartyType,
         TransactionStages, TransactionStatus } from './transactions';


export const CashFlowProjectionsStagesList: Identifiable<TransactionStages>[] = [
  { uid: TransactionStages.MyInbox,     name: 'Mis proyecciones' },
  { uid: TransactionStages.ControlDesk, name: 'Mesa de control' },
];


export const CashFlowProjectionsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excelEntries,
    name: 'Exportar movimientos'
  },
];


export interface CashFlowProjectionsQuery {
  stage: TransactionStages;
  status: TransactionStatus;
  partyUID: string;
  keywords: string;
  planUID: string;
  projectionTypeUID: string;
  projectTypeUID: string;
  sourceUID: string;
  projectUID: string;
  accountUID: string;
  projectionsNo: string[];
  entriesKeywords: string;
  tags: string[];
  dateType: TransactionDateType;
  fromDate: DateString;
  toDate: DateString;
  searchPartyRole: TransactionPartyType;
  searchPartyUID: string;
}


export interface CashFlowProjectionDescriptor {
  uid: string;
  partyName: string;
  planName: string;
  projectionTypeName: string;
  projectionNo: string;
  projectTypeName: string;
  projectName: string;
  accountName: string;
  sourceName: string;
  recordedByName: string;
  recordingTime: DateString;
  authorizedByName: string;
  authorizationTime: DateString;
  statusName: string;
  total: number;
}


export interface CashFlowProjectionFields {
  partyUID: string;
  planUID: string;
  projectionTypeUID: string;
  projectTypeUID: string;
  sourceUID: string;
  projectUID: string;
  accountUID: string;
  description: string;
  justification: string;
  tags: string[];
}


export interface CashFlowProjectionRejectFields {
  message: string;
}


export interface CashFlowProjectionOrgUnitsForEdition {
  uid: string;
  name: string;
  plans: Identifiable[];
  projectionTypes: CashFlowProjectionTypeForEdition[];
}


export interface CashFlowProjectionTypeForEdition {
  uid: string;
  name: string;
  projectTypes: CashFlowProjectTypeForEdition[];
  sources: Identifiable[];
}


export interface CashFlowProjectTypeForEdition {
  uid: string;
  name: string;
  projects: CashFlowProjectForEdition[];
}


export interface CashFlowProjectForEdition {
  uid: string;
  name: string;
  accounts: Identifiable[];
}


export interface CashFlowProjectAccount {
  uid: string;
  name: string;
  currencies: Identifiable[];
}


export interface CashFlowProjection {
  uid: string;
  projectionNo: string;
  party: Identifiable;
  plan: CashFlowProjectionPlan;
  projectionType: Identifiable;
  projectType: Identifiable;
  project: Identifiable;
  account: Identifiable;
  source: Identifiable;
  description: string;
  justification: string;
  tags: string[];
  applicationDate: DateString;
  appliedBy: Identifiable;
  recordingTime: DateString;
  recordedBy: Identifiable;
  authorizationTime: DateString;
  authorizedBy: Identifiable;
  requestedTime: DateString;
  requestedBy: Identifiable;
  adjustmentOf: Identifiable;
  status: Identifiable<TransactionStatus>;
  total: number;
}


export interface CashFlowProjectionPlan {
  uid: string;
  name: string;
  baseCurrency: Identifiable;
  categories: Identifiable[];
  projectionsColumns: Identifiable[];
  years: number[];
  editionAllowed: boolean;
}


export interface CashFlowProjectionActions extends BaseActions {
  canAuthorize: boolean;
  canClose: boolean;
  canReject: boolean;
  canSendToAuthorization: boolean;
}


export interface CashFlowProjectionHolder {
  projection: CashFlowProjection,
  entries: CashFlowProjectionEntryDescriptor[];
  groupedEntries: CashFlowProjectionGroupedEntryData;
  documents: Document[];
  history: HistoryEntry[];
  actions: CashFlowProjectionActions;
}


export interface CashFlowProjectionEntryBaseDescriptor {
  uid: string;
  projectionColumn: string;
  itemType: TransactionEntryItemType;
  inflowAmount: number;
  outflowAmount: number;
}


export interface CashFlowProjectionEntryDescriptor extends CashFlowProjectionEntryBaseDescriptor {
  cashFlowAccountCode: string;
  cashFlowAccountName: string;
  year: number;
  month: number;
  monthName: string;
}


export interface CashFlowProjectionEntryByYearDescriptor extends CashFlowProjectionEntryBaseDescriptor {
  cashFlowAccount: string;
}


export interface CashFlowProjectionGroupedEntryData extends DataTable {
  entries: CashFlowProjectionEntryByYearDescriptor[];
}


export interface CashFlowProjectionEntryBase {
  uid: string;
  entryType: TransactionEntryType;
  projectionUID: string;
  projectionColumn: Identifiable;
  cashFlowAccount: Identifiable;
  product: Identifiable;
  productUnit: Identifiable;
  description: string;
  justification: string;
  year: number;
  currency: Identifiable;
  exchangeRate: number;
}


export interface CashFlowProjectionEntry extends CashFlowProjectionEntryBase {
  productQty: number;
  month: Identifiable;
  originalAmount: number;
  amount: number;
  status: Identifiable;
}


export interface CashFlowProjectionEntryByYear extends CashFlowProjectionEntryBase {
  amounts: MonthEntry[];
}


export interface MonthEntry {
  entryUID: string;
  month: number;
  productQty: number;
  amount: number;
}


export interface CashFlowProjectionEntryFields {
  projectionColumnUID: string;
  cashFlowAccountUID: string;
  year: number;
  month: number;
  currencyUID: string;
  exchangeRate: number;
  amount: number;
  productUID: string;
  productUnitUID: string;
  productQty: number;
  description: string;
  justification: string;
}


export interface CashFlowProjectionEntryByYearFields {
  projectionColumnUID: string;
  cashFlowAccountUID: string;
  year: number
  currencyUID: string;
  exchangeRate: number;
  productUID: string;
  productUnitUID: string;
  description: string;
  justification: string;
  amounts: MonthEntryFields[];
}


export interface MonthEntryFields {
  entryUID: string;
  month: number;
  amount: number;
  productQty: number;
  label?: string;
}


export function mapCashFlowProjectionDescriptorFromProjection(data: CashFlowProjection): CashFlowProjectionDescriptor {
  return {
    uid: data.uid,
    partyName: data.party.name,
    planName: data.plan.name,
    projectionTypeName: data.projectionType.name,
    projectionNo: data.projectionNo,
    projectTypeName: data.projectType.name,
    projectName: data.project.name,
    accountName: data.account.name,
    sourceName: data.source.name,
    recordedByName: data.recordedBy.name,
    recordingTime: data.recordingTime,
    authorizedByName: data.authorizedBy.name,
    authorizationTime: data.authorizationTime,
    statusName: data.status.name,
    total: data.total,
  };
}


export const EmptyCashFlowProjectionsQuery: CashFlowProjectionsQuery = {
  stage: null,
  status: null,
  partyUID: '',
  keywords: '',
  projectionTypeUID: '',
  planUID: '',
  projectTypeUID: '',
  sourceUID: '',
  projectUID: '',
  accountUID: '',
  projectionsNo: [],
  entriesKeywords: '',
  tags: [],
  dateType: TransactionDateType.Requested,
  fromDate: '',
  toDate: '',
  searchPartyRole: TransactionPartyType.RequestedBy,
  searchPartyUID: '',
};


export const EmptyCashFlowProjectionPlan: CashFlowProjectionPlan = {
  uid: '',
  name: '',
  baseCurrency: Empty,
  categories: [],
  projectionsColumns: [],
  years: [],
  editionAllowed: false,
}


export const EmptyCashFlowProjection: CashFlowProjection = {
  uid: '',
  projectionNo: '',
  plan: EmptyCashFlowProjectionPlan,
  projectionType: Empty,
  projectType: Empty,
  source: Empty,
  party: Empty,
  project: Empty,
  account: Empty,
  description: '',
  justification: '',
  tags: [],
  applicationDate: '',
  appliedBy: Empty,
  recordingTime: '',
  recordedBy: Empty,
  authorizationTime: '',
  authorizedBy: Empty,
  requestedTime: '',
  requestedBy: Empty,
  adjustmentOf: Empty,
  total: null,
  status: Empty,
}


export const EmptyCashFlowProjectionGroupedEntryData: CashFlowProjectionGroupedEntryData = {
  query: {},
  columns: [],
  entries: [],
}


export const EmptyCashFlowProjectionActions: CashFlowProjectionActions = {
  canUpdate: false,
  canDelete: false,
  canSendToAuthorization: false,
  canAuthorize: false,
  canReject: false,
  canClose: false,
  canEditDocuments: false,
}


export const EmptyCashFlowProjectionHolder: CashFlowProjectionHolder = {
  projection: EmptyCashFlowProjection,
  entries: [],
  groupedEntries: EmptyCashFlowProjectionGroupedEntryData,
  documents: [],
  history: [],
  actions: EmptyCashFlowProjectionActions,
};


export const EmptyCashFlowProjectionEntryBase: CashFlowProjectionEntryBase = {
  uid: '',
  entryType: null,
  projectionUID: '',
  projectionColumn: Empty,
  cashFlowAccount: Empty,
  product: Empty,
  productUnit: Empty,
  year: null,
  currency: Empty,
  exchangeRate: null,
  description: '',
  justification: '',
};


export const EmptyCashFlowProjectionEntryByYear: CashFlowProjectionEntryByYear = {
  uid: '',
  entryType: null,
  projectionUID: '',
  projectionColumn: Empty,
  cashFlowAccount: Empty,
  product: Empty,
  productUnit: Empty,
  year: null,
  currency: Empty,
  exchangeRate: null,
  description: '',
  justification: '',
  amounts: [],
};


export const EmptyCashFlowProjectionEntry: CashFlowProjectionEntry = {
  uid: '',
  entryType: null,
  projectionUID: '',
  projectionColumn: Empty,
  cashFlowAccount: Empty,
  product: Empty,
  productUnit: Empty,
  productQty: null,
  year: null,
  month: Empty,
  currency: Empty,
  exchangeRate: null,
  originalAmount: null,
  amount: null,
  description: '',
  justification: '',
  status: Empty,
};
