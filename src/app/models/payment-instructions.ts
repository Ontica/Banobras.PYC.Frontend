/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './base/explorer-data';

import { Bill } from './bills';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { BasePaymentDescriptor } from './payment-orders';


export interface PaymentAccount {
  uid: string;
  name: string;
  accountNo: string;
  holderName: string;
  referenceNumber: string;
  accountType: Identifiable;
  institution: Identifiable;
  paymentMethod: PaymentMethod;
  currency: Identifiable;
  askForReferenceNumber: boolean;
}


export interface PaymentMethod {
  uid: string;
  name: string;
  accountRelated: boolean;
}


export enum PaymentInstructionsStatus {
  Pending    = 'Pending',
  Received   = 'Received',
  Suspended  = 'Suspended',
  Returned   = 'Returned',
  Rejected   = 'Rejected',
  Committed  = 'Committed',
  Programmed = 'Programmed',
  Payed      = 'Payed',
  Deleted    = 'Deleted',
}


export const PaymentInstructionStatusList: Identifiable<PaymentInstructionsStatus>[] = [
  { uid: PaymentInstructionsStatus.Pending,    name: 'Pendiente'},
  { uid: PaymentInstructionsStatus.Received,   name: 'Recibida'},
  { uid: PaymentInstructionsStatus.Suspended,  name: 'Suspendida'},
  { uid: PaymentInstructionsStatus.Returned,   name: 'Regresada'},
  { uid: PaymentInstructionsStatus.Rejected,   name: 'Rechazada'},
  { uid: PaymentInstructionsStatus.Committed,  name: 'Comprometida'},
  { uid: PaymentInstructionsStatus.Programmed, name: 'Programada'},
  { uid: PaymentInstructionsStatus.Payed,      name: 'Pagada'},
  { uid: PaymentInstructionsStatus.Deleted,    name: 'Eliminada'},
];


export interface PaymentInstructionsQuery {
  status: PaymentInstructionsStatus;
  requesterOrgUnitUID: string;
  paymentOrderTypeUID: string;
  paymentMethodUID: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
}


export interface PaymentInstructionDescriptor extends BasePaymentDescriptor {
  uid: string;
  paymentInstructionTypeName: string;
  paymentInstructionNo: string;
  description: string;
  payTo: string;
  paymentOrderNo: string;
  paymentMethod: string;
  paymentAccount: string;
  currencyCode: string;
  total: number;
  dueTime: DateString;
  requestedBy: string;
  requestedTime: DateString;
  programmedDate: DateString;
  lastUpdateTime: DateString;
  statusName: string;
}


export interface PaymentInstructionFields {

}


export interface PaymentInstructionHolder {
  paymentInstruction: PaymentInstruction;
  log: PaymentInstructionLog[];
  bills: Bill[];
  documents: Document[];
  history: HistoryEntry[];
  actions: PaymentInstructionActions;
}


export interface PaymentInstruction {
  uid: string;
  paymentOrderNo: string;
  paymentInstructionType: Identifiable;
  paymentInstructionNo: string;
  description: string;
  payTo: Identifiable;
  paymentMethod: PaymentMethod;
  paymentAccount: PaymentAccount;
  referenceNumber: string;
  total: number;
  currency: Identifiable;
  requestedBy: Identifiable;
  dueTime: DateString;
  requestedTime: DateString;
  programmedDate: DateString;
  lastUpdateTime: DateString;
  status: Identifiable;
}


export interface PaymentInstructionLog {
  uid: string;
  paymentOrdeNo: string;
  paymentMethod: string;
  total: number;
  currency: string;
  requestTime: DateString;
  requestCode: string;
  description: string;
  statusName: string;
}


export interface PaymentInstructionActions {
  canUpdate: boolean;
  canCancel: boolean;
  canSuspend: boolean;
  canReset: boolean;
  canRequestPayment: boolean;
  canCancelPaymentRequest: boolean;
  canEditDocuments: boolean;
}


export const PaymentInstructionsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.export,
    name: 'Exportar'
  },
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


export const EmptyPaymentInstructionsQuery: PaymentInstructionsQuery = {
  status: null,
  requesterOrgUnitUID: '',
  paymentOrderTypeUID: '',
  paymentMethodUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
};


export const EmptyPaymentMethod: PaymentMethod = {
  uid: '',
  name: '',
  accountRelated: false,
};


export const EmptyPaymentAccount: PaymentAccount = {
  uid: '',
  name: '',
  accountNo: '',
  referenceNumber: '',
  holderName: '',
  accountType: Empty,
  paymentMethod: EmptyPaymentMethod,
  currency: Empty,
  institution: Empty,
  askForReferenceNumber: false,
}


export const EmptyPaymentInstruction: PaymentInstruction = {
  uid: '',
  paymentOrderNo: '',
  paymentInstructionType: Empty,
  paymentInstructionNo: '',
  payTo: Empty,
  paymentAccount: EmptyPaymentAccount,
  referenceNumber: '',
  description: '',
  total: null,
  currency: Empty,
  paymentMethod: EmptyPaymentMethod,
  dueTime: '',
  requestedBy: Empty,
  requestedTime: '',
  programmedDate: '',
  lastUpdateTime: '',
  status: Empty,
};


export const EmptyPaymentInstructionActions: PaymentInstructionActions = {
  canUpdate: false,
  canCancel: false,
  canSuspend: false,
  canReset: false,
  canRequestPayment: false,
  canCancelPaymentRequest: false,
  canEditDocuments: false,
}


export const EmptyPaymentInstructionHolder: PaymentInstructionHolder = {
  paymentInstruction: EmptyPaymentInstruction,
  log: [],
  bills: [],
  documents: [],
  history: [],
  actions: EmptyPaymentInstructionActions,
};


export function mapPaymentInstructionDescriptorFromPaymentInstruction(data: PaymentInstruction): PaymentInstructionDescriptor {
  return {
    uid: data.uid,
    paymentOrderNo: data.paymentOrderNo,
    paymentInstructionTypeName: data.paymentInstructionType.name,
    paymentInstructionNo: data.paymentInstructionNo,
    description: data.description,
    payTo: data.payTo.name,
    total: data.total,
    requestedTime: data.requestedTime,
    requestedBy: data.requestedBy.name,
    statusName: data.status.name,
    paymentAccount: data.paymentAccount.accountNo,
    currencyCode: data.currency.name,
    paymentMethod: data.paymentMethod.name,
    dueTime: data.dueTime,
    programmedDate: data.programmedDate,
    lastUpdateTime: data.lastUpdateTime,
  };
}
