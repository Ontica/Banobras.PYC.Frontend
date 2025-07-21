/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Asset, EmptyAsset } from './assets';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { TransactionDateType, TransactionPartyType, TransactionStages,
         TransactionStatus } from './transactions';


export interface AssetsTransactionsQuery {
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  status: TransactionStatus;
  stage: TransactionStages;
  keywords: string;
  transactionTypeUID: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
  managerUID: string;
  managerOrgUnitUID: string;
  releasedByUID: string;
  releasedByOrgUnitUID: string;
  operationSourceUID: string;
  transactionsNo: string[];
  entriesKeywords: string;
  tags: string[];
  dateType: TransactionDateType;
  fromDate: DateString;
  toDate: DateString;
  partyType: TransactionPartyType;
  partyUID: string;
}


export interface AssetsTransactionDescriptor {
  uid: string;
  transactionTypeName: string;
  transactionNo: string;
  description: string;
  assignedToName: string;
  assignedToOrgUnitName: string;
  baseLocationName: string;
  managerName: string;
  managerOrgUnitName: string;
  operationSourceName: string;
  releasedByName: string;
  releasedByOrgUnitName: string;
  applicationDate: DateString;
  appliedByName: string;
  recordingTime: DateString;
  recordedByName: string;
  authorizationTime: DateString;
  authorizedByName: string;
  requestedTime: DateString;
  requestedByName: string;
  statusName: string;
}


export interface AssetsTransactionFields {
  transactionTypeUID: string;
  applicationDate: DateString;
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  managerUID: string;
  managerOrgUnitUID: string;
  releasedByUID: string;
  releasedByOrgUnitUID: string;
  locationUID: string;
  identificators: string[];
  tags: string[];
  description: string;
}


export interface AssetsTransactionHolder {
  transaction: AssetsTransaction,
  entries: AssetsTransactionEntry[];
  documents: Document[];
  history: HistoryEntry[];
  actions: AssetsTransactionActions;
}


export interface AssetsTransaction {
  uid: string;
  transactionType: Identifiable;
  transactionNo: string;
  description: string;
  identificators: string[];
  tags: string[];
  assignedToOrgUnit: Identifiable;
  assignedTo: Identifiable;
  manager: Identifiable;
  managerOrgUnit: Identifiable;
  releasedBy: Identifiable;
  releasedByOrgUnit: Identifiable;
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  baseLocationName: string;
  operationSource: Identifiable;
  applicationDate: DateString;
  appliedBy: Identifiable;
  recordingTime: DateString;
  recordedBy: Identifiable;
  authorizationTime: DateString;
  authorizedBy: Identifiable;
  requestedTime: DateString;
  requestedBy: Identifiable;
  status: Identifiable;
}


export interface AssetsTransactionActions {
  canUpdate: boolean;
  canDelete: boolean;
  canClose: boolean;
  canClone: boolean;
  canEditDocuments: boolean;
}


export interface AssetsTransactionEntryFields {
  uid: string;
  transactionUID: string;
  assetUID: string;
  entryTypeUID: string;
  description: string;
}


export interface AssetsTransactionEntry {
  uid: string;
  entryType: Identifiable;
  transaction: Identifiable;
  asset: Asset;
  description: string;
}


export const AssetsTransactionsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.pdf,
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


export const EmptyAssetsTransactionsQuery: AssetsTransactionsQuery = {
  assignedToUID: '',
  assignedToOrgUnitUID: '',
  stage: null,
  status: null,
  keywords: '',
  transactionTypeUID: '',
  buildingUID: '',
  floorUID: '',
  placeUID: '',
  managerUID: '',
  managerOrgUnitUID: '',
  releasedByUID: '',
  releasedByOrgUnitUID: '',
  operationSourceUID: '',
  transactionsNo: [],
  entriesKeywords: '',
  tags: [],
  dateType: TransactionDateType.Registered,
  fromDate: '',
  toDate: '',
  partyType: TransactionPartyType.RegisteredBy,
  partyUID: '',
};


export const EmptyAssetsTransaction: AssetsTransaction = {
  uid: '',
  transactionType: Empty,
  transactionNo: '',
  description: '',
  identificators: [],
  tags: [],
  manager: Empty,
  managerOrgUnit: Empty,
  releasedBy: Empty,
  releasedByOrgUnit: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  baseLocationName: '',
  assignedToOrgUnit: Empty,
  assignedTo: Empty,
  operationSource: Empty,
  applicationDate: '',
  appliedBy: Empty,
  recordingTime: '',
  recordedBy: Empty,
  authorizationTime: '',
  authorizedBy: Empty,
  requestedTime: '',
  requestedBy: Empty,
  status: Empty,
}


export const EmptyAssetsTransactionEntry: AssetsTransactionEntry = {
  uid: '',
  entryType: Empty,
  transaction: Empty,
  asset: EmptyAsset,
  description: '',
}


export const EmptyAssetsTransactionActions: AssetsTransactionActions = {
  canUpdate: false,
  canDelete: false,
  canClose: false,
  canClone: false,
  canEditDocuments: false,
}


export const EmptyAssetsTransactionHolder: AssetsTransactionHolder = {
  transaction: EmptyAssetsTransaction,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyAssetsTransactionActions,
};


export function mapAssetsTransactionDescriptorFromTransaction(data: AssetsTransaction): AssetsTransactionDescriptor {
  return {
    uid: data.uid,
    transactionNo: data.transactionNo,
    transactionTypeName: data.transactionType.name,
    description: data.description,
    assignedToOrgUnitName: data.assignedToOrgUnit.name,
    assignedToName: data.assignedTo.name,
    baseLocationName: data.baseLocationName,
    managerName: data.manager.name,
    managerOrgUnitName: data.managerOrgUnit.name,
    operationSourceName: data.operationSource.name,
    releasedByName: data.releasedBy.name,
    releasedByOrgUnitName: data.releasedByOrgUnit.name,
    applicationDate: data.applicationDate,
    appliedByName: data.appliedBy.name,
    recordingTime: data.recordingTime,
    recordedByName: data.recordedBy.name,
    authorizationTime: data.authorizationTime,
    authorizedByName: data.authorizedBy.name,
    requestedTime: data.requestedTime,
    requestedByName: data.requestedBy.name,
    statusName: data.status.name,
  };
}
