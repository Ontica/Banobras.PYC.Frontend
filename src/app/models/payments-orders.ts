/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from "@app/core";


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


export interface PaymentOrderStatus extends Identifiable {
  uid: PaymentsOrdersStatus;
  name: string;
}


export const PaymentOrderStatusList: PaymentOrderStatus[] = [
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


export const EmptyPaymentsOrdersQuery: PaymentsOrdersQuery = {
  status: null,
  requesterOrgUnitUID: '',
  paymentOrderTypeUID: '',
  paymentMethodUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
};


export interface PaymentOrderDescriptor {
  uid: string;
  paymentOrderNo: string;
  paymentOrderTypeName: string;
  payTo: string;
  payable: string;
  paymentMethod: string;
  total: number;
  currency: string;
  requestedDate: DateString;
  dueTime: DateString;
  requestedBy: string;
  statusName: string;
}


export interface PaymentOrder {
  uid: string;
}


export interface PaymentsOrdersOperation extends Identifiable {
  uid: PaymentsOrdersOperationType;
  name: string;
}


export enum PaymentsOrdersOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export interface PaymentsOrdersOperationCommand {
  operation: PaymentsOrdersOperationType;
  paymentsOrders: string[];
}


export const PaymentsOrdersOperationsList: PaymentsOrdersOperation[] = [
  { uid: PaymentsOrdersOperationType.excel,  name: 'Exportar' },
  { uid: PaymentsOrdersOperationType.print,  name: 'Imprimir' },
  { uid: PaymentsOrdersOperationType.delete, name: 'Eliminar' },
];


export const EmptyPaymentOrder: PaymentOrder = {
  uid: '',
};
