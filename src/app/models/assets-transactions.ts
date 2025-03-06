/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Document } from './documents';

import { AssetDescriptor } from './assets';

import { EmptyTransactionActions, TransactionActions } from './budget-transactions';


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

}


export interface AssetTransactionHolder {
  transaction: AssetTransaction,
  entries: AssetDescriptor[];
  documents: Document[];
  history: History[];
  actions: TransactionActions;
}


export interface AssetTransaction {
  uid: string;
  transactionType: Identifiable;
  transactionNo: string;
  description: string;
  assignedToOrgUnit: Identifiable;
  assignedTo: Identifiable;
  manager: Identifiable;
  managerOrgUnit: Identifiable;
  locationName: string;
  operationSource: Identifiable;
  requestedTime: DateString;
  applicationTime: DateString;
  recordingTime: DateString;
  status: Identifiable;
}


export const AssetTransactionsOperationsList: ExplorerOperation[] = [
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
  manager: Empty,
  managerOrgUnit: Empty,
  locationName: '',
  assignedToOrgUnit: Empty,
  assignedTo: Empty,
  operationSource: Empty,
  requestedTime: '',
  applicationTime: '',
  recordingTime: '',
  status: Empty,
}


export const EmptyAssetTransactionHolder: AssetTransactionHolder = {
  transaction: EmptyAssetTransaction,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyTransactionActions,
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
