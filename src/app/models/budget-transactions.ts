/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';


export enum BudgetTransactionsStatus {
  Pending         = 'Pendiente',
  OnAuthorization = 'En autorización',
  Completed       = 'Completada',
  Deleted         = 'Eliminada',
}


export const BudgetTransactionStatusList: Identifiable<BudgetTransactionsStatus>[] = [
  { uid: BudgetTransactionsStatus.Pending,         name: 'Pendiente' },
  { uid: BudgetTransactionsStatus.OnAuthorization, name: 'En autorización' },
  { uid: BudgetTransactionsStatus.Completed,       name: 'Completada' },
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


export interface BudgetTransactionsQuery {
  basePartyUID: string;
  status: BudgetTransactionsStatus;
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
  description: string;
  statusName: string;
}


export interface BudgetTransaction {

}


export enum BudgetTransactionsOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export const BudgetTransactionsOperationsList: ExplorerOperation[] = [
  {
    uid: BudgetTransactionsOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: BudgetTransactionsOperationType.print,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: BudgetTransactionsOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export const EmptyBudgetTransactionsQuery: BudgetTransactionsQuery = {
  transactionTypeUID: '',
  status: null,
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
