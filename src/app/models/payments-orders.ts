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

import { History } from './history';


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

}


 export interface PaymentOrderData {
  paymentOrder: PaymentOrder;
  items: any[];
  log: PaymentInstructionLog[];
  bills: Bill[];
  documents: Document[];
  history: History[];
  actions: PaymentOrderActions;
}


export interface PaymentOrder {
  uid: string;
  orderNo: string;
  status: Identifiable;
  payTo: Identifiable;
  requestedBy: Identifiable;
  requestedDate: DateString;
  notes: string;
  total: number;
  paymentOrderType: Identifiable;
  currency: Identifiable;
  paymentMethod: Identifiable;
  dueTime: DateString;
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
  canSendToPay: boolean;
  canEditDocuments: boolean;
}


export const PaymentsOrdersOperationsList: ExplorerOperation[] = [
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


export const EmptyPaymentsOrdersQuery: PaymentsOrdersQuery = {
  status: null,
  requesterOrgUnitUID: '',
  paymentOrderTypeUID: '',
  paymentMethodUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
};


export const EmptyPaymentOrder: PaymentOrder = {
  uid: '',
  orderNo: '',
  payTo: Empty,
  requestedBy: Empty,
  requestedDate: '',
  notes: '',
  total: null,
  paymentOrderType: Empty,
  currency: Empty,
  paymentMethod: Empty,
  dueTime: '',
  status: Empty,
};


export const EmptyPaymentOrderActions: PaymentOrderActions = {
  canSendToPay: false,
  canEditDocuments: false,
}


export const EmptyPaymentOrderData: PaymentOrderData = {
  paymentOrder: EmptyPaymentOrder,
  items: [],
  log: [],
  bills: [],
  documents: [],
  history: [],
  actions: EmptyPaymentOrderActions,
};


export const EmptyPaymentMethod: PaymentMethod = {
  uid: '',
  name: '',
  linkedToAccount: false,
}


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


export function mapPaymentOrderDescriptorFromPaymentOrder(data: PaymentOrderData): PaymentOrderDescriptor {
  return {
    uid: data.paymentOrder.uid,
    paymentOrderNo: data.paymentOrder.orderNo,
    payTo: data.paymentOrder.payTo.name,
    total: data.paymentOrder.total,
    requestedDate: data.paymentOrder.requestedDate,
    requestedBy: data.paymentOrder.requestedBy.name,
    statusName: data.paymentOrder.status.name,
    paymentOrderTypeName: data.paymentOrder.paymentOrderType.name,
    currency: data.paymentOrder.currency.name,
    paymentMethod: data.paymentOrder.paymentMethod.name,
    dueTime: data.paymentOrder.dueTime,
  };
}
