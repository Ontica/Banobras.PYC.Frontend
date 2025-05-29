/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export enum TransactionStages {
  MyInbox     = 'Transactions.MyInbox',
  ControlDesk = 'Transactions.ControlDesk',
}


export enum TransactionStatus {
  Pending         = 'Pending',
  OnAuthorization = 'OnAuthorization',
  Authorized      = 'Authorized',
  Closed          = 'Closed',
  Rejected        = 'Rejected',
  Canceled        = 'Canceled',
  Deleted         = 'Deleted',
}


export enum TransactionDateType {
  Requested    = 'Requested',
  Registered   = 'Registered',
  Authorizated = 'Authorizated',
  Completed    = 'Completed',
  None         = 'None',
}


export enum TransactionPartyType {
  RequestedBy  = 'RequestedBy',
  RegisteredBy = 'RegisteredBy',
  AuthorizedBy = 'AuthorizedBy',
  CompletedBy  = 'CompletedBy',
  None         = 'None',
}


export enum TransactionEntryType {
  Annually = 'Annually',
  Monthly  = 'Monthly',
}


export type TransactionEntryItemType = 'Entry' | 'Total';


export const TransactionStagesList: Identifiable<TransactionStages>[] = [
  { uid: TransactionStages.MyInbox,     name: 'Mis transacciones' },
  { uid: TransactionStages.ControlDesk, name: 'Mesa de control' },
];


export const TransactionStatusList: Identifiable<TransactionStatus>[] = [
  { uid: TransactionStatus.Pending,         name: 'Pendiente' },
  { uid: TransactionStatus.OnAuthorization, name: 'En autorización' },
  { uid: TransactionStatus.Authorized,      name: 'Autorizada' },
  { uid: TransactionStatus.Closed,          name: 'Cerrada' },
  { uid: TransactionStatus.Rejected,        name: 'Rechazada' },
  { uid: TransactionStatus.Canceled,        name: 'Cancelada' },
  { uid: TransactionStatus.Deleted,         name: 'Eliminada' },
];


export const TransactionDateTypesList: Identifiable<TransactionDateType>[] = [
  { uid: TransactionDateType.Requested,    name: 'Fecha de solicitud' },
  { uid: TransactionDateType.Registered,   name: 'Fecha de registro' },
  { uid: TransactionDateType.Authorizated, name: 'Fecha de autorización' },
  { uid: TransactionDateType.Completed,    name: 'Fecha de completación' },
];


export const TransactionPartyTypesList: Identifiable<TransactionPartyType>[] = [
  { uid: TransactionPartyType.RequestedBy,  name: 'Solicitado por' },
  { uid: TransactionPartyType.RegisteredBy, name: 'Registrado por' },
  { uid: TransactionPartyType.AuthorizedBy, name: 'Autorizado por' },
  { uid: TransactionPartyType.CompletedBy,  name: 'Completado por' },
];
