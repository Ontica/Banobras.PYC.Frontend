/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from './base/explorer-data';

import { Bill } from './bills';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { EmptyPaymentMethod, PaymentAccount, PaymentMethod, PaymentOrderDescriptor } from './payments-orders';


export interface PayablesQuery {
  status: PayablesStatus;
  requesterOrgUnitUID: string;
  payableTypeUID: string;
  budgetTypeUID: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
}


export const EmptyPayablesQuery: PayablesQuery = {
  status: null,
  requesterOrgUnitUID: '',
  payableTypeUID: '',
  budgetTypeUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
};


export enum PayablesStatus {
  Capture   = 'Capture',
  OnPayment = 'OnPayment',
  Payed     = 'Payed',
  Deleted   = 'Deleted',
}


export const PayableStatusList: Identifiable<PayablesStatus>[] = [
  { uid: PayablesStatus.Capture,   name: 'Capturado' },
  { uid: PayablesStatus.OnPayment, name: 'En proceso' },
  { uid: PayablesStatus.Payed,     name: 'Pagado' },
  { uid: PayablesStatus.Deleted,   name: 'Eliminado' },
];


export interface PayableDescriptor {
  uid: string;
  payableTypeName: string;
  payableNo: string;
  contractNo: string;
  payTo: string;
  budgetTypeName: string;
  currencyCode: string;
  total: number;
  requestedBy: string;
  requestedTime: DateString;
  dueTime: DateString;
  statusName: string;
}


export interface PayableFields {
  organizationalUnitUID: string;
  payableTypeUID: string;
  dueTime: DateString;
  payableEntityUID: string;
  paymentMethodUID: string;
  paymentAccountUID: string;
  description: string;
}


export interface PayableHolder {
  payable: Payable;
  payableEntity: PayableEntity;
  items: PayableItem[];
  bills: Bill[];
  budgetTransactions: BudgetTransactionDescriptor[];
  paymentInstructions: PaymentOrderDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: PayableActions;
}


export interface Payable {
  uid: string;
  payableNo: string;
  payableType: Identifiable;
  description: string;
  requestedBy: Identifiable;
  payTo: Identifiable;
  budgetType: Identifiable;
  budget: Identifiable;
  total: number;
  currency: Identifiable;
  exchangeRateType: Identifiable;
  exchangeRate: number;
  paymentMethod: PaymentMethod;
  paymentAccount: Identifiable;
  requestedTime: DateString;
  dueTime: DateString;
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


export interface PayableItem {
  uid: string;
  name: string;
  budgetAccount: Identifiable;
  billConcept: string;
  payableEntityItemUID: string;
  quantity: number;
  unit: string;
  total: number;
}


export interface PayableActions {
  canUpdate: boolean;
  canDelete: boolean;
  canEditDocuments: boolean;
  canGeneratePaymentOrder: boolean;
  canSendToPay: boolean;
  canRequestBudget: boolean;
  canExerciseBudget: boolean;
}


export interface PayableEntityItem {

}


export const PayablesOperationsList: ExplorerOperation[] = [
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


export const EmptyPayableActions: PayableActions = {
  canUpdate: false,
  canDelete: false,
  canEditDocuments: false,
  canGeneratePaymentOrder: false,
  canSendToPay: false,
  canRequestBudget: false,
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


export const EmptyPayable: Payable = {
  uid: '',
  payableNo: '',
  payableType: Empty,
  description: '',
  requestedBy: Empty,
  payTo: Empty,
  budgetType: Empty,
  budget: Empty,
  total: null,
  currency: Empty,
  exchangeRateType: Empty,
  exchangeRate: null,
  paymentMethod: EmptyPaymentMethod,
  paymentAccount: Empty,
  requestedTime: '',
  dueTime: '',
  status: Empty,
}


export const EmptyPayableHolder: PayableHolder = {
  payable: EmptyPayable,
  payableEntity: EmptyPayableEntity,
  bills: [],
  budgetTransactions: [],
  paymentInstructions: [],
  items: [],
  documents: [],
  history: [],
  actions: EmptyPayableActions,
}


export function mapPayableDescriptorFromPayable(data: PayableHolder): PayableDescriptor {
  return {
    uid: data.payable.uid,
    payableTypeName: data.payable.payableType.name,
    payableNo: data.payable.payableNo,
    contractNo: data.payableEntity.entityNo,
    payTo: data.payable.payTo.name,
    budgetTypeName: data.payable.budgetType.name,
    currencyCode: data.payable.currency.name,
    total: data.payable.total,
    requestedBy: data.payable.requestedBy.name,
    requestedTime: data.payable.requestedTime,
    dueTime: data.payable.dueTime,
    statusName: data.payable.status.name,
  };
}
