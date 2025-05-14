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


export enum AssetTransactionsStatus {
  Pending         = 'Pendiente',
  OnAuthorization = 'En autorización',
  Completed       = 'Completada',
  Deleted         = 'Eliminada',
}


export const AssetTransactionStatusList: Identifiable<AssetTransactionsStatus>[] = [
  { uid: AssetTransactionsStatus.Pending,         name: 'Pendiente' },
  { uid: AssetTransactionsStatus.OnAuthorization, name: 'En autorización' },
  { uid: AssetTransactionsStatus.Completed,       name: 'Completada' },
  { uid: AssetTransactionsStatus.Deleted,         name: 'Eliminada' },
];


export enum AssetTransactionQueryDateType {
  Requested    = 'Requested',
  Registered   = 'Registered',
  Authorizated = 'Authorizated',
  Completed    = 'Completed',
  None         = 'None',
}


export const AssetTransactionQueryDateTypesList: Identifiable<AssetTransactionQueryDateType>[] = [
  { uid: AssetTransactionQueryDateType.Requested,    name: 'Fecha de solicitud' },
  { uid: AssetTransactionQueryDateType.Registered,   name: 'Fecha de registro' },
  { uid: AssetTransactionQueryDateType.Authorizated, name: 'Fecha de autorización' },
  { uid: AssetTransactionQueryDateType.Completed,    name: 'Fecha de completación' },
];


export enum AssetTransactionPartyType {
  RequestedBy  = 'RequestedBy',
  RegisteredBy = 'RegisteredBy',
  AuthorizedBy = 'AuthorizedBy',
  CompletedBy  = 'CompletedBy',
  None         = 'None',
}


export const AssetTransactionPartyTypesList: Identifiable<AssetTransactionPartyType>[] = [
  { uid: AssetTransactionPartyType.RequestedBy,  name: 'Solicitado por' },
  { uid: AssetTransactionPartyType.RegisteredBy, name: 'Registrado por' },
  { uid: AssetTransactionPartyType.AuthorizedBy, name: 'Autorizado por' },
  { uid: AssetTransactionPartyType.CompletedBy,  name: 'Completado por' },
];


export interface AssetTransactionsQuery {
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  status: AssetTransactionsStatus;
  keywords: string;
  transactionTypeUID: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
  transactionsNo: string[];
  entriesKeywords: string;
  tags: string[];
  dateType: AssetTransactionQueryDateType;
  fromDate: DateString;
  toDate: DateString;
  partyType: AssetTransactionPartyType;
  partyUID: string;
}


export interface AssetTransactionDescriptor {
  uid: string;
  transactionTypeName: string;
  transactionNo: string;
  description: string;
  assignedToName: string;
  assignedToOrgUnitName: string;
  locationName: string;
  managerName: string;
  managerOrgUnitName: string;
  operationSourceName: string;
  requestedTime: DateString;
  applicationTime: DateString;
  recordingTime: DateString;
  statusName: string;
}


export interface AssetTransactionFields {
  transactionTypeUID: string;
  requestedTime: DateString;
  applicationTime: DateString;
  managerUID: string;
  managerOrgUnitUID: string;
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  locationUID: string;
  identificators: string[];
  tags: string[];
  description: string;
}


export interface AssetTransactionHolder {
  transaction: AssetTransaction,
  entries: AssetTransactionEntry[];
  documents: Document[];
  history: HistoryEntry[];
  actions: AssetTransactionActions;
}


export interface AssetTransaction {
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
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  locationName: string;
  operationSource: Identifiable;
  requestedTime: DateString;
  applicationTime: DateString;
  recordingTime: DateString;
  status: Identifiable;
}


export interface AssetTransactionActions {
  canUpdate: boolean;
  canDelete: boolean;
  canClose: boolean;
  canClone: boolean;
  canEditDocuments: boolean;
}


export interface AssetTransactionEntryFields {
  uid: string;
  transactionUID: string;
  assetUID: string;
  entryTypeUID: string;
  description: string;
}


export interface AssetTransactionEntry {
  uid: string;
  entryType: Identifiable;
  transaction: Identifiable;
  asset: Asset;
  description: string;
}


export enum AssetTransactionTypes {
  AssetsCustody   = 'ObjectTypeInfo.AssetTransaction.FixedAssetsCustody',
  AssetsInventory = 'ObjectTypeInfo.AssetTransaction.FixedAssetsInventory',
}



export const AssetTransactionsOperationsList: ExplorerOperation[] = [
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


export const EmptyAssetTransactionsQuery: AssetTransactionsQuery = {
  assignedToUID: '',
  assignedToOrgUnitUID: '',
  status: null,
  keywords: '',
  transactionTypeUID: '',
  buildingUID: '',
  floorUID: '',
  placeUID: '',
  transactionsNo: [],
  entriesKeywords: '',
  tags: [],
  dateType: AssetTransactionQueryDateType.Registered,
  fromDate: '',
  toDate: '',
  partyType: AssetTransactionPartyType.RegisteredBy,
  partyUID: '',
};


export const EmptyAssetTransaction: AssetTransaction = {
  uid: '',
  transactionType: Empty,
  transactionNo: '',
  description: '',
  identificators: [],
  tags: [],
  manager: Empty,
  managerOrgUnit: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  locationName: '',
  assignedToOrgUnit: Empty,
  assignedTo: Empty,
  operationSource: Empty,
  requestedTime: '',
  applicationTime: '',
  recordingTime: '',
  status: Empty,
}


export const EmptyAssetTransactionEntry: AssetTransactionEntry = {
  uid: '',
  entryType: Empty,
  transaction: Empty,
  asset: EmptyAsset,
  description: '',
}


export const EmptyAssetTransactionActions: AssetTransactionActions = {
  canUpdate: false,
  canDelete: false,
  canClose: false,
  canClone: false,
  canEditDocuments: false,
}


export const EmptyAssetTransactionHolder: AssetTransactionHolder = {
  transaction: EmptyAssetTransaction,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyAssetTransactionActions,
};


export function mapAssetTransactionDescriptorFromTransaction(data: AssetTransaction): AssetTransactionDescriptor {
  return {
    uid: data.uid,
    transactionNo: data.transactionNo,
    transactionTypeName: data.transactionType.name,
    description: data.description,
    assignedToOrgUnitName: data.assignedToOrgUnit.name,
    assignedToName: data.assignedTo.name,
    locationName: data.locationName,
    managerName: data.manager.name,
    managerOrgUnitName: data.managerOrgUnit.name,
    operationSourceName: data.operationSource.name,
    requestedTime: data.requestedTime,
    applicationTime: data.applicationTime,
    recordingTime: data.recordingTime,
    statusName: data.status.name,
  };
}
