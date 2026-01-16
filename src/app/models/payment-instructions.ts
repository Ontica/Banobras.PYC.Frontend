/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './base/explorer-data';

import { BillsStructure, EmptyBillsStructure } from './bills';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { BasePaymentDescriptor } from './payment-orders';

import { Priority, getPriorityName } from './steps';


export interface PaymentAccount {
  uid: string;
  name: string;
  accountType: Identifiable;
  institution: Identifiable;
  accountNo: string;
  identificator: string;
  holderName: string;
  paymentMethod: PaymentMethod;
  currency: Identifiable;
  referenceNumber: string;
  askForReferenceNumber: boolean;
}


export interface PaymentAccountFields {
  accountTypeUID: string;
  institutionUID: string;
  accountNo: string;
  identificator: string;
  holderName: string;
  paymentMethodUID: string;
  currencyUID: string;
  referenceNumber: string;
  askForReferenceNumber: boolean;
}


export interface PaymentMethod {
  uid: string;
  name: string;
  accountRelated: boolean;
}


export enum PaymentInstructionsStatus {
  Programmed = 'Programmed',
  InProgress = 'InProgress',
  Payed      = 'Payed',
  Failed     = 'Failed',
  Canceled   = 'Canceled',
}


export const PaymentInstructionStatusList: Identifiable<PaymentInstructionsStatus>[] = [
  { uid: PaymentInstructionsStatus.Programmed, name: 'Programada'},
  { uid: PaymentInstructionsStatus.InProgress, name: 'En proceso'},
  { uid: PaymentInstructionsStatus.Payed,      name: 'Pagada'},
  { uid: PaymentInstructionsStatus.Failed,     name: 'Envio fallido'},
  { uid: PaymentInstructionsStatus.Canceled,   name: 'Cancelada'},
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
  paymentInstructionNo: string;
  paymentOrderNo: string;
  paymentOrderType: string;
  description: string;
  payTo: string;
  paymentMethod: string;
  paymentAccount: string;
  currencyCode: string;
  total: number;
  dueTime: DateString;
  operationNo: string;
  payableNo: string;
  payableTypeName: string;
  payableName: string;
  recordedBy: string;
  requestedBy: string;
  requestedTime: DateString;
  programmedDate: DateString;
  lastUpdateTime: DateString;
  priorityName: string;
  statusName: string;
}


export interface PaymentInstructionFields {

}


export interface PaymentInstructionRejectFields {
  message: string;
}


export interface PaymentInstructionHolder {
  paymentInstruction: PaymentInstruction;
  log: PaymentInstructionLog[];
  bills: BillsStructure;
  documents: Document[];
  history: HistoryEntry[];
  actions: PaymentInstructionActions;
}


export interface PaymentInstruction {
  uid: string;
  paymentInstructionNo: string;
  paymentOrderNo: string;
  paymentOrderType: Identifiable;
  description: string;
  payTo: Identifiable;
  paymentMethod: PaymentMethod;
  paymentAccount: PaymentAccount;
  referenceNumber: string;
  total: number;
  currency: Identifiable;
  recordedBy: Identifiable;
  requestedBy: Identifiable;
  dueTime: DateString;
  operationNo: string;
  payableNo: string;
  payableType: Identifiable;
  payable: Identifiable;
  requestedTime: DateString;
  programmedDate: DateString;
  lastUpdateTime: DateString;
  priority: Priority;
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
  canClosePayment: boolean;
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
  accountType: Empty,
  askForReferenceNumber: false,
  currency: Empty,
  holderName: '',
  identificator: '',
  institution: Empty,
  paymentMethod: EmptyPaymentMethod,
  referenceNumber: '',
}


export const EmptyPaymentInstruction: PaymentInstruction = {
  uid: '',
  paymentInstructionNo: '',
  paymentOrderNo: '',
  paymentOrderType: Empty,
  description: '',
  payTo: Empty,
  paymentAccount: EmptyPaymentAccount,
  referenceNumber: '',
  total: null,
  currency: Empty,
  paymentMethod: EmptyPaymentMethod,
  dueTime: '',
  operationNo: '',
  payableNo: '',
  payableType: Empty,
  payable: Empty,
  recordedBy: Empty,
  requestedBy: Empty,
  requestedTime: '',
  programmedDate: '',
  lastUpdateTime: '',
  priority: null,
  status: Empty,
};


export const EmptyPaymentInstructionActions: PaymentInstructionActions = {
  canUpdate: false,
  canCancel: false,
  canSuspend: false,
  canReset: false,
  canClosePayment: false,
  canRequestPayment: false,
  canCancelPaymentRequest: false,
  canEditDocuments: false,
}


export const EmptyPaymentInstructionHolder: PaymentInstructionHolder = {
  paymentInstruction: EmptyPaymentInstruction,
  log: [],
  bills: EmptyBillsStructure,
  documents: [],
  history: [],
  actions: EmptyPaymentInstructionActions,
};


export function mapPaymentInstructionDescriptorFromPaymentInstruction(data: PaymentInstruction): PaymentInstructionDescriptor {
  return {
    uid: data.uid,
    paymentInstructionNo: data.paymentInstructionNo,
    paymentOrderNo: data.paymentOrderNo,
    paymentOrderType: data.paymentOrderType.name,
    description: data.description,
    payTo: data.payTo.name,
    total: data.total,
    recordedBy: data.recordedBy?.name,
    requestedBy: data.requestedBy.name,
    requestedTime: data.requestedTime,
    paymentAccount: data.paymentAccount.accountNo,
    currencyCode: data.currency.name,
    paymentMethod: data.paymentMethod.name,
    dueTime: data.dueTime,
    operationNo: data.operationNo,
    payableNo: data.payableNo,
    payableTypeName: data.payableType.name,
    payableName: data.payable.name,
    programmedDate: data.programmedDate,
    lastUpdateTime: data.lastUpdateTime,
    priorityName: getPriorityName(data.priority),
    statusName: data.status.name,
  };
}
