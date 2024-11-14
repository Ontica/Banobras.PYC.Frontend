/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';


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
}


export interface FixedAssetTransactionHolder {
  transaction: any;
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
