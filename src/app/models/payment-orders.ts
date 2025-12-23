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

import { EmptyPaymentMethod, PaymentAccount, PaymentMethod, PaymentInstructionDescriptor,
         EmptyPaymentAccount } from './payment-instructions';

import { Priority, getPriorityName } from './steps';


export interface PaymentOrdersQuery {
  status: PaymentOrderStatus;
  requesterOrgUnitUID: string;
  paymentOrderTypeUID: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
  // TODO: agregar campos al filter
  payToUID: string;
  paymentMethodUID: string;
  budgetTypeUID: string;
  budgetUID: string;
}


export const EmptyPaymentOrdersQuery: PaymentOrdersQuery = {
  status: null,
  requesterOrgUnitUID: '',
  paymentOrderTypeUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
  payToUID: '',
  paymentMethodUID: '',
  budgetTypeUID: '',
  budgetUID: '',
};


export enum PaymentOrderStatus {
  Capture   = 'Capture',
  OnPayment = 'OnPayment',
  Payed     = 'Payed',
  Deleted   = 'Deleted',
}


export const PaymentOrderStatusList: Identifiable<PaymentOrderStatus>[] = [
  { uid: PaymentOrderStatus.Capture,   name: 'Capturado' },
  { uid: PaymentOrderStatus.OnPayment, name: 'En proceso' },
  { uid: PaymentOrderStatus.Payed,     name: 'Pagado' },
  { uid: PaymentOrderStatus.Deleted,   name: 'Eliminado' },
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
  paymentMethod: string;
  paymentAccount: string;
  currencyCode: string;
  total: number;
  dueTime: DateString;
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
  dueTime: DateString;
  paymentMethodUID: string;
  paymentAccountUID: string;
  referenceNumber: string;
  description: string;
}


export interface PaymentOrderFields {
  organizationalUnitUID: string;
  paymentOrderTypeUID: string;
  dueTime: DateString;
  referenceNumber: string;
  payableEntityUID: string;
  paymentMethodUID: string;
  paymentAccountUID: string;
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
  requestedBy: Identifiable;
  requestedDate: DateString;
  dueTime: DateString;
  paymentMethod: PaymentMethod;
  paymentAccount: PaymentAccount;
  currency: Identifiable;
  total: number;
  referenceNumber: string;
  observations: string;
  priority: Priority;
  status: Identifiable;
}


export interface PayableEntity {
  uid: string;
  type: string;
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
  type: '',
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
  requestedBy: Empty,
  payTo: Empty,
  budgetType: Empty,
  budget: Empty,
  total: null,
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
    paymentMethod: data.paymentOrder.paymentMethod.name,
    paymentAccount: data.paymentOrder.paymentAccount.accountNo,
    currencyCode: data.paymentOrder.currency.name,
    total: data.paymentOrder.total,
    dueTime: data.paymentOrder.dueTime,
    requestedBy: data.paymentOrder.requestedBy.name,
    requestedTime: data.paymentOrder.requestedDate,
    priorityName: getPriorityName(data.paymentOrder.priority),
    statusName: data.paymentOrder.status.name,
    payableNo: data.payableEntity.entityNo,
    payableName: data.payableEntity.name,
    payableTypeName: data.payableEntity.type,
    budgetName: data.paymentOrder.budget.name,
  };
}
