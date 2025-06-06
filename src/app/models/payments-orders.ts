/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Bill } from './bills';

import { Document } from './documents';

import { HistoryEntry } from './history';


export enum PaymentsOrdersStatus {
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


export const PaymentOrderStatusList: Identifiable<PaymentsOrdersStatus>[] = [
  { uid: PaymentsOrdersStatus.Pending,    name: 'Pendiente'},
  { uid: PaymentsOrdersStatus.Received,   name: 'Recibida'},
  { uid: PaymentsOrdersStatus.Suspended,  name: 'Suspendida'},
  { uid: PaymentsOrdersStatus.Returned,   name: 'Regresada'},
  { uid: PaymentsOrdersStatus.Rejected,   name: 'Rechazada'},
  { uid: PaymentsOrdersStatus.Committed,  name: 'Comprometida'},
  { uid: PaymentsOrdersStatus.Programmed, name: 'Programada'},
  { uid: PaymentsOrdersStatus.Payed,      name: 'Pagada'},
  { uid: PaymentsOrdersStatus.Deleted,    name: 'Eliminada'},
];


export interface PaymentsOrdersQuery {
  status: PaymentsOrdersStatus;
  requesterOrgUnitUID: string;
  paymentOrderTypeUID: string;
  paymentMethodUID: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
}


export interface PaymentAccount {
  uid: string;
  name: string;
  paymentMethod: PaymentMethod;
  currency: Identifiable;
  institution: Identifiable;
  accountNo: string;
  holderName: string;
  clabe: string;
}


export interface PaymentMethod {
  uid: string;
  name: string;
  linkedToAccount: boolean;
}


export interface PaymentOrderDescriptor {
  uid: string;
  paymentOrderTypeName: string;
  paymentOrderNo: string;
  payTo: string;
  paymentMethod: string;
  total: number;
  currency: string;
  requestedDate: DateString;
  dueTime: DateString;
  requestedBy: string;
  statusName: string;
}


export interface PaymentOrderFields {
  payToUID: string;
  paymentAccountUID: string;
  controlNo: string;
  referenceNumber: string;
  total: number;
  currencyUID: string;
  paymentMethodUID: string;
  requestedByUID: string;
  dueTime: DateString;
  notes: string;
}


 export interface PaymentOrderHolder {
  paymentOrder: PaymentOrder;
  items: any[];
  log: PaymentInstructionLog[];
  bills: Bill[];
  documents: Document[];
  history: HistoryEntry[];
  actions: PaymentOrderActions;
}


export interface PaymentOrder {
  uid: string;
  paymentOrderType: Identifiable;
  orderNo: string;
  payTo: Identifiable;
  paymentAccount: PaymentAccount;
  controlNo: string;
  referenceNumber: string;
  total: number;
  currency: Identifiable;
  paymentMethod: PaymentMethod;
  requestedBy: Identifiable;
  dueTime: DateString;
  requestedDate: DateString;
  notes: string;
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


export interface PaymentOrderActions {
  canUpdate: boolean;
  canDelete: boolean;
  canSendToPay: boolean;
  canEditDocuments: boolean;
}


export const PaymentsOrdersOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
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


export const EmptyPaymentsOrdersQuery: PaymentsOrdersQuery = {
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
  linkedToAccount: false,
};


export const EmptyPaymentAccount: PaymentAccount = {
  uid: '',
  name: '',
  paymentMethod: EmptyPaymentMethod,
  currency: Empty,
  institution: Empty,
  accountNo: '',
  holderName: '',
  clabe: '',
}


export const EmptyPaymentOrder: PaymentOrder = {
  uid: '',
  paymentOrderType: Empty,
  orderNo: '',
  payTo: Empty,
  paymentAccount: EmptyPaymentAccount,
  controlNo: '',
  referenceNumber: '',
  total: null,
  currency: Empty,
  paymentMethod: EmptyPaymentMethod,
  dueTime: '',
  requestedBy: Empty,
  requestedDate: '',
  notes: '',
  status: Empty,
};


export const EmptyPaymentOrderActions: PaymentOrderActions = {
  canUpdate: false,
  canDelete: false,
  canSendToPay: false,
  canEditDocuments: false,
}


export const EmptyPaymentOrderHolder: PaymentOrderHolder = {
  paymentOrder: EmptyPaymentOrder,
  items: [],
  log: [],
  bills: [],
  documents: [],
  history: [],
  actions: EmptyPaymentOrderActions,
};


export function mapPaymentOrderDescriptorFromPaymentOrder(data: PaymentOrder): PaymentOrderDescriptor {
  return {
    uid: data.uid,
    paymentOrderNo: data.orderNo,
    payTo: data.payTo.name,
    total: data.total,
    requestedDate: data.requestedDate,
    requestedBy: data.requestedBy.name,
    statusName: data.status.name,
    paymentOrderTypeName: data.paymentOrderType.name,
    currency: data.currency.name,
    paymentMethod: data.paymentMethod.name,
    dueTime: data.dueTime,
  };
}
