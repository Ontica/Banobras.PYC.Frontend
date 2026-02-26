/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './base/explorer-data';

import { BillsStructure, EmptyBillsStructure } from './bills';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { ObjectTypes } from './object-types';

import { EmptyPaymentMethod, PaymentAccount, PaymentMethod, PaymentInstructionDescriptor,
         EmptyPaymentAccount } from './payment-instructions';

import { Priority, getPriorityName } from './steps';


export interface PaymentOrdersQuery {
  status: PaymentOrderStatus;
  requesterOrgUnitUID: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
  paymentOrderTypeUID: string;
  budgetUID: string;
  // TODO: agregar campos al filter
  payToUID: string;
  paymentMethodUID: string;
}


export const EmptyPaymentOrdersQuery: PaymentOrdersQuery = {
  status: null,
  requesterOrgUnitUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
  paymentOrderTypeUID: '',
  budgetUID: '',
  payToUID: '',
  paymentMethodUID: '',
};


export enum PaymentOrderStatus {
  Pending    = 'Pending',
  Programmed = 'Programmed',
  InProgress = 'InProgress',
  Payed      = 'Payed',
  Failed     = 'Failed',
  Suspended  = 'Suspended',
  Canceled   = 'Canceled',
}


export const PaymentOrderStatusList: Identifiable<PaymentOrderStatus>[] = [
  { uid: PaymentOrderStatus.Pending,    name: 'Pendiente' },
  { uid: PaymentOrderStatus.Programmed, name: 'Programada' },
  { uid: PaymentOrderStatus.InProgress, name: 'En progreso' },
  { uid: PaymentOrderStatus.Payed,      name: 'Pagada' },
  { uid: PaymentOrderStatus.Failed,     name: 'Envío fallido' },
  { uid: PaymentOrderStatus.Suspended,  name: 'Suspendida' },
  { uid: PaymentOrderStatus.Canceled,   name: 'Cancelada' },
];


export const PaymentOrderPriorityList: Identifiable[] = [
  { uid: Priority.Normal, name: 'Normal' },
  { uid: Priority.Urgent, name: 'Urgente' },
];


export interface BasePaymentDescriptor {
  uid: string;
  paymentOrderNo: string;
  payTo: string;
  paymentMethod: string;
  paymentAccount: string;
  currencyCode: string;
  total: number;
  dueTime: DateString;
  requestedBy: string;
  requestedTime: DateString;
  statusName: string;
}


export interface PaymentOrderDescriptor extends BasePaymentDescriptor {
  uid: string;
  paymentOrderTypeName: string;
  paymentOrderNo: string;
  payTo: string;
  debtor: string;
  paymentDescription: string;
  paymentMethod: string;
  paymentAccount: string;
  currencyCode: string;
  total: number;
  dueTime: DateString;
  recordedBy: string;
  requestedBy: string;
  requestedTime: DateString;
  priorityName: string;
  statusName: string;
  payableNo: string;
  payableTypeName: string;
  payableName: string;
  budgetName: string;
}


export interface PaymentOrderRequestFields {
  paymentTypeUID: string;
  paymentMethodUID: string;
  debtorUID: string;
  dueTime: DateString;
  paymentAccountUID: string;
  referenceNumber: string;
  total: number;
  description: string;
}


export interface PaymentOrderFields {
  organizationalUnitUID: string;
  paymentOrderTypeUID: string;
  dueTime: DateString;
  referenceNumber: string;
  payableEntityUID: string;
  exchangeRate: number;
  paymentMethodUID: string;
  paymentAccountUID: string;
  debtorUID: string;
  description: string;
  priority: string;
  observations: string;
}


export interface PaymentOrderHolder {
  paymentOrder: PaymentOrder;
  payableEntity: PayableEntity;
  items: PaymentOrderItem[];
  bills: BillsStructure;
  budgetTransactions: BudgetTransactionDescriptor[];
  paymentInstructions: PaymentInstructionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: PaymentOrderActions;
}


export interface PaymentOrder {
  uid: string;
  paymentOrderType: Identifiable;
  paymentOrderNo: string;
  description: string;
  budgetType: Identifiable;
  budget: Identifiable;
  payTo: Identifiable;
  debtor: Identifiable;
  recordedBy: Identifiable;
  requestedBy: Identifiable;
  requestedDate: DateString;
  dueTime: DateString;
  paymentMethod: PaymentMethod;
  paymentAccount: PaymentAccount;
  currency: Identifiable;
  total: number;
  exchangeRate: number;
  referenceNumber: string;
  observations: string;
  priority: Priority;
  status: Identifiable;
}


export interface PayableEntity {
  uid: string;
  type: Identifiable<ObjectTypes>;
  entityNo: string;
  name: string;
  description: string;
  payTo: Identifiable;
  budget: Identifiable;
  currency: Identifiable;
  paymentAccounts: PaymentAccount[];
  total: number;
  items: PayableEntityItem[];
}


export interface PaymentOrderItem {
  uid: string;
  name: string;
  budgetAccount: Identifiable;
  billConcept: string;
  payableEntityItemUID: string;
  quantity: number;
  unit: string;
  total: number;
}


export interface PaymentOrderActions {
  canUpdate: boolean;
  canCancel: boolean;
  canSuspend: boolean;
  canReset: boolean;
  canEditDocuments: boolean;
  canGeneratePaymentInstruction: boolean;
  canApprovePayment: boolean;
  canExerciseBudget: boolean;
}


export interface PayableEntityItem {
  uid: string;
  quantity: number;
  unit: Identifiable;
  product: Identifiable;
  description: string;
  unitPrice: number;
  total: number;
  budgetAccount: Identifiable;
}


export const PaymentOrdersOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.export,
    name: 'Exportar a excel'
  },
];


export const EmptyPaymentOrderActions: PaymentOrderActions = {
  canUpdate: false,
  canCancel: false,
  canSuspend: false,
  canReset: false,
  canEditDocuments: false,
  canGeneratePaymentInstruction: false,
  canApprovePayment: false,
  canExerciseBudget: false,
}


export const EmptyPayableEntity: PayableEntity = {
  uid: '',
  type: Empty,
  entityNo: '',
  name: '',
  description: '',
  payTo: Empty,
  budget: Empty,
  currency: Empty,
  paymentAccounts: [],
  total: null,
  items: [],
}


export const EmptyPaymentOrder: PaymentOrder = {
  uid: '',
  paymentOrderNo: '',
  paymentOrderType: Empty,
  description: '',
  recordedBy: Empty,
  requestedBy: Empty,
  payTo: Empty,
  debtor: Empty,
  budgetType: Empty,
  budget: Empty,
  total: null,
  exchangeRate: null,
  currency: Empty,
  paymentMethod: EmptyPaymentMethod,
  paymentAccount: EmptyPaymentAccount,
  requestedDate: '',
  dueTime: '',
  referenceNumber: '',
  observations: '',
  priority: null,
  status: Empty,
}


export const EmptyPaymentOrderHolder: PaymentOrderHolder = {
  paymentOrder: EmptyPaymentOrder,
  payableEntity: EmptyPayableEntity,
  bills: EmptyBillsStructure,
  budgetTransactions: [],
  paymentInstructions: [],
  items: [],
  documents: [],
  history: [],
  actions: EmptyPaymentOrderActions,
}


export function mapPaymentOrderDescriptorFromPaymentOrder(data: PaymentOrderHolder): PaymentOrderDescriptor {
  return {
    uid: data.paymentOrder.uid,
    paymentOrderTypeName: data.paymentOrder.paymentOrderType.name,
    paymentOrderNo: data.paymentOrder.paymentOrderNo,
    payTo: data.paymentOrder.payTo.name,
    debtor: data.paymentOrder.debtor.name,
    paymentDescription: data.payableEntity.description,
    paymentMethod: data.paymentOrder.paymentMethod.name,
    paymentAccount: data.paymentOrder.paymentAccount.accountNo,
    currencyCode: data.paymentOrder.currency.name,
    total: data.paymentOrder.total,
    dueTime: data.paymentOrder.dueTime,
    recordedBy: data.paymentOrder.recordedBy.name,
    requestedBy: data.paymentOrder.requestedBy.name,
    requestedTime: data.paymentOrder.requestedDate,
    priorityName: getPriorityName(data.paymentOrder.priority),
    statusName: data.paymentOrder.status.name,
    payableNo: data.payableEntity.entityNo,
    payableName: data.payableEntity.name,
    payableTypeName: data.payableEntity.type.uid,
    budgetName: data.paymentOrder.budget.name,
  };
}
