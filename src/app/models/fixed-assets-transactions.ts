/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Document } from './documents';

import { FixedAssetDescriptor } from './fixed-assets';

import { EmptyTransactionActions, TransactionActions } from './budget-transactions';


export enum FixedAssetTransactionsStatus {
  Pending         = 'Pendiente',
  OnAuthorization = 'En autorización',
  Completed       = 'Completada',
  Deleted         = 'Eliminada',
}


export const FixedAssetTransactionStatusList: Identifiable<FixedAssetTransactionsStatus>[] = [
  { uid: FixedAssetTransactionsStatus.Pending,         name: 'Pendiente' },
  { uid: FixedAssetTransactionsStatus.OnAuthorization, name: 'En autorización' },
  { uid: FixedAssetTransactionsStatus.Completed,       name: 'Completada' },
  { uid: FixedAssetTransactionsStatus.Deleted,         name: 'Eliminada' },
];


export enum FixedAssetTransactionQueryDateType {
  Requested    = 'Requested',
  Registered   = 'Registered',
  Authorizated = 'Authorizated',
  Completed    = 'Completed',
  None         = 'None',
}


export const FixedAssetTransactionQueryDateTypesList: Identifiable<FixedAssetTransactionQueryDateType>[] = [
  { uid: FixedAssetTransactionQueryDateType.Requested,    name: 'Fecha de solicitud' },
  { uid: FixedAssetTransactionQueryDateType.Registered,   name: 'Fecha de registro' },
  { uid: FixedAssetTransactionQueryDateType.Authorizated, name: 'Fecha de autorización' },
  { uid: FixedAssetTransactionQueryDateType.Completed,    name: 'Fecha de completación' },
];


export enum FixedAssetTransactionPartyType {
  RequestedBy  = 'RequestedBy',
  RegisteredBy = 'RegisteredBy',
  AuthorizedBy = 'AuthorizedBy',
  CompletedBy  = 'CompletedBy',
  None         = 'None',
}


export const FixedAssetTransactionPartyTypesList: Identifiable<FixedAssetTransactionPartyType>[] = [
  { uid: FixedAssetTransactionPartyType.RequestedBy,  name: 'Solicitado por' },
  { uid: FixedAssetTransactionPartyType.RegisteredBy, name: 'Registrado por' },
  { uid: FixedAssetTransactionPartyType.AuthorizedBy, name: 'Autorizado por' },
  { uid: FixedAssetTransactionPartyType.CompletedBy,  name: 'Completado por' },
];


export interface FixedAssetTransactionsQuery {
  assetKeeperUID: string;
  assetKeeperOrgUnitUID: string;
  status: FixedAssetTransactionsStatus;
  keywords: string;
  transactionTypeUID: string;
  operationSourceUID: string;
  transactionsNo: string[];
  entriesKeywords: string;
  tags: string[];
  dateType: FixedAssetTransactionQueryDateType;
  fromDate: DateString;
  toDate: DateString;
  partyType: FixedAssetTransactionPartyType;
  partyUID: string;
}


export interface FixedAssetTransactionDescriptor {
  uid: string;
  transactionTypeName: string;
  transactionNo: string;
  assetKeeperOrgUnitName: string;
  assetKeeperName: string;
  operationSourceName: string;
  description: string;
  requestedDate: DateString;
  applicationDate: DateString;
  statusName: string;
}


export interface FixedAssetTransactionFields {

}


export interface FixedAssetTransactionData {
  transaction: FixedAssetTransaction,
  entries: FixedAssetDescriptor[];
  documents: Document[];
  history: History[];
  actions: TransactionActions;
}


export interface FixedAssetTransaction {
  uid: string;
  transactionType: Identifiable;
  transactionNo: string;
  assetKeeperOrgUnit: Identifiable;
  assetKeeper: Identifiable;
  operationSource: Identifiable;
  description: string;
  requestedDate: DateString;
  applicationDate: DateString;
  status: Identifiable;
}


export const FixedAssetTransactionsOperationsList: ExplorerOperation[] = [
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


export const EmptyFixedAssetTransactionsQuery: FixedAssetTransactionsQuery = {
  assetKeeperUID: '',
  assetKeeperOrgUnitUID: '',
  status: null,
  keywords: '',
  transactionTypeUID: '',
  operationSourceUID: '',
  transactionsNo: [],
  entriesKeywords: '',
  tags: [],
  dateType: FixedAssetTransactionQueryDateType.Registered,
  fromDate: '',
  toDate: '',
  partyType: FixedAssetTransactionPartyType.RegisteredBy,
  partyUID: '',
};


export const EmptyFixedAssetTransaction: FixedAssetTransaction = {
  uid: '',
  transactionType: Empty,
  transactionNo: '',
  assetKeeperOrgUnit: Empty,
  assetKeeper: Empty,
  operationSource: Empty,
  description: '',
  requestedDate: '',
  applicationDate: '',
  status: Empty,
}


export const EmptyFixedAssetTransactionData: FixedAssetTransactionData = {
  transaction: EmptyFixedAssetTransaction,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyTransactionActions,
};


export function mapFixedAssetTransactionDescriptorFromTransaction(data: FixedAssetTransactionData): FixedAssetTransactionDescriptor {
  return {
    uid: data.transaction.uid,
    transactionNo: data.transaction.transactionNo,
    transactionTypeName: data.transaction.transactionType.name,
    assetKeeperOrgUnitName: data.transaction.assetKeeperOrgUnit.name,
    assetKeeperName: data.transaction.assetKeeper.name,
    operationSourceName: data.transaction.operationSource.name,
    description: data.transaction.description,
    requestedDate: data.transaction.requestedDate,
    applicationDate: data.transaction.applicationDate,
    statusName: data.transaction.status.name,
  };
}
