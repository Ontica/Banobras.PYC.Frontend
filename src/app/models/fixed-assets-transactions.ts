/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, EmptyBaseActions, ExplorerOperation } from './_explorer-data';


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
  custodianOrgUnitUID: string;
  status: FixedAssetTransactionsStatus;
  keywords: string;
  transactionTypeUID: string;
  transactionsNo: string[];
  tags: string[];
  dateType: FixedAssetTransactionQueryDateType;
  fromDate: DateString;
  toDate: DateString;
  partyType: FixedAssetTransactionPartyType;
  partyUID: string;
}


export interface FixedAssetTransactionDescriptor {
  uid: string;
  transactionNo: string;
}


export interface FixedAssetTransactionFields {

}


export interface FixedAssetTransactionData {
  transaction: FixedAssetTransaction,
  entries: any[];
  documents: Document[];
  history: History[];
  actions: BaseActions;
}


export interface FixedAssetTransaction {
  uid: string;
  transactionNo: string;
  name: string;
  requestedDate: DateString;
  resposable: Identifiable;
  involved: Identifiable;
  notes: string;
}

export enum FixedAssetTransactionsOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export const FixedAssetTransactionsOperationsList: ExplorerOperation[] = [
  {
    uid: FixedAssetTransactionsOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: FixedAssetTransactionsOperationType.print,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: FixedAssetTransactionsOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export const EmptyFixedAssetTransactionsQuery: FixedAssetTransactionsQuery = {
  custodianOrgUnitUID: '',
  status: null,
  keywords: '',
  transactionTypeUID: '',
  transactionsNo: [],
  tags: [],
  dateType: FixedAssetTransactionQueryDateType.Registered,
  fromDate: '',
  toDate: '',
  partyType: FixedAssetTransactionPartyType.RegisteredBy,
  partyUID: '',
};


export const EmptyFixedAssetTransaction: FixedAssetTransaction = {
  uid: '',
  transactionNo: '',
  name: '',
  requestedDate: '',
  resposable: Empty,
  involved: Empty,
  notes: '',
}


export const EmptyFixedAssetTransactionData: FixedAssetTransactionData = {
  transaction: EmptyFixedAssetTransaction,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyBaseActions,
};


export function mapFixedAssetTransactionDescriptorFromTransaction(data: FixedAssetTransactionData): FixedAssetTransactionDescriptor {
  return {
    uid: data.transaction.uid,
    transactionNo: data.transaction.transactionNo,
  };
}
