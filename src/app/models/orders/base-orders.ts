/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Entity, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { EntityStatus, ExplorerOperation, ExplorerOperationType,
         ExplorerTypeConfig } from '../base/explorer-data';

import { BillsStructure, EmptyBillsStructure } from '../bills';

import { BudgetTransactionDescriptor } from '../budget-transactions';

import { Document } from '../documents';

import { HistoryEntry } from '../history';

import { ObjectTypes } from '../object-types';

import { Priority } from '../steps';

import { RequestsList } from '../requests';

import { PaymentInstructionDescriptor } from '../payment-instructions';


export interface OrderExplorerTypeConfig<T> extends ExplorerTypeConfig<T> {
  requestsList: RequestsList;
}


export const EmptyOrderExplorerTypeConfig: OrderExplorerTypeConfig<ObjectTypes> = {
  type: null,
  nameSingular: 'Orden',
  namePlural: 'Ordenes',
  pronounSingular: 'la',
  pronounPlural: 'las',
  selectionMessage: 'seleccionadas',
  requestsList: null,
  permissionToCreate: null,
}


export function getOrderExplorerTypeConfig(type: ObjectTypes): OrderExplorerTypeConfig<ObjectTypes> {
  switch (type) {
    case ObjectTypes.CONTRACT:
      return {
        type,
        nameSingular: 'contrato',
        namePlural: 'contratos',
        pronounSingular: 'el',
        pronounPlural: 'los',
        selectionMessage: 'seleccionados',
        requestsList: RequestsList.contracts,
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    case ObjectTypes.CONTRACT_ORDER:
      return {
        type,
        nameSingular: 'entrega',
        namePlural: 'entregas',
        pronounSingular: 'la',
        pronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    case ObjectTypes.EXPENSE:
      return {
        type,
        nameSingular: 'gasto',
        namePlural: 'gastos',
        pronounSingular: 'el',
        pronounPlural: 'los',
        selectionMessage: 'seleccionados',
        requestsList: RequestsList.payments,
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    case ObjectTypes.PURCHASE:
      return {
        type,
        nameSingular: 'compra menor',
        namePlural: 'compras menores',
        pronounSingular: 'la',
        pronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    case ObjectTypes.REQUISITION:
      return {
        type,
        nameSingular: 'requisición',
        namePlural: 'requisiciones',
        pronounSingular: 'la',
        pronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    default: return EmptyOrderExplorerTypeConfig;
  }
}


export interface OrderForEdition extends Entity {
  uid: string;
  orderNo: string;
  name: string;
  description: string;
  budgets: Identifiable[];
}


export interface OrdersQuery {
  orderTypeUID: string;
  requestedByUID: string;
  status: EntityStatus;
  keywords: string;
  categoryUID: string;
  providerUID: string;
  budgetTypeUID: string;
  budgetUID: string;
  projectUID: string;
  orderNo: string;
  priority: Priority;
}


export interface OrdersAvailableQuery {
  orderTypeUID: string;
  forUseInOrderTypeUID: string;
  requestedByUID: string;
}


export interface OrderDescriptor {
  uid: string;
  typeName: string;
  categoryName: string;
  orderNo: string;
  name: string;
  description: string;
  justification: string;
  baseOrgUnitName: string;
  baseBudgetName: string;
  currencyName: string;
  total: number;
  providerName: string;
  projectName: string;
  priorityUID: string;
  priorityName: string;
  startDate: DateString;
  endDate: DateString;
  authorizedByName: string;
  authorizationTime: DateString;
  closedByName: string;
  closingTime: DateString;
  statusName: string;
}


export interface OrderFields {
  orderTypeUID: string;
  categoryUID: string;
  name: string;
  startDate: DateString;
  endDate: DateString;
  priority: Priority;
  responsibleUID: string;
  beneficiaryUID: string;
  requestedByUID: string;
  providerUID: string;
  currencyUID: string;
  isForMultipleBeneficiaries: boolean;
  projectUID: string;
  identificators: string[];
  tags: string[];
  description: string;
  justification: string;
}


export interface OrderHolder {
  order: Order;
  items: OrderItem[];
  orders: OrderDescriptor[];
  bills: BillsStructure;
  paymentOrders: PaymentInstructionDescriptor[];
  budgetTransactions: BudgetTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: OrderActions;
}


export interface Order {
  uid: string;
  type: Identifiable;
  category: Identifiable;
  orderNo: string;
  name: string;
  description: string;
  justification: string;
  responsible: Identifiable;
  beneficiary: Identifiable;
  requestedBy: Identifiable;
  authorizedBy: Identifiable;
  closedBy: Identifiable;
  provider: Identifiable;
  providersGroup: Identifiable[];
  project: Identifiable;
  priority: Identifiable<Priority>;
  startDate: DateString;
  endDate: DateString;
  identificators: string[];
  tags: string[];
  isForMultipleBeneficiaries: boolean;
  authorizationTime: DateString;
  closingTime: DateString;
  baseOrgUnitName: string;
  baseBudgetName: string;
  subtotal: number;
  taxes: number;
  total: number;
  currency: Identifiable;
  status: Identifiable<EntityStatus>;
}


export interface OrderItem {
  uid: string;
  order: Identifiable;
  orderItemType: Identifiable;
  beneficiary: Identifiable;
  project: Identifiable;
  product: Identifiable;
  productCode: string;
  productUnit: Identifiable;
  quantity: number;
  unitPrice: number;
  total: number;
  currency: Identifiable;
  description: string;
  justification: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export interface OrderActions {
  canUpdate: boolean;
  canEditDocuments: boolean;
  canEditBills: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canSuspend: boolean;
  canEditItems: boolean;
  canCommitBudget: boolean;
  canRequestBudget: boolean;
  canRequestBudgetModification: boolean;
  canValidateBudget: boolean;
  canRequestPayment: boolean;
}


export interface OrderItemFields {
  beneficiaryUID: string;
  projectUID: string;
  productUID: string;
  productUnitUID: string;
  quantity: number;
  unitPrice: number;
  total: number;
  description: string;
  justification: string;
  startDate: DateString;
  endDate: DateString;
}


export const EmptyOrdersQuery: OrdersQuery = {
  orderTypeUID: '',
  orderNo: '',
  categoryUID: '',
  keywords: '',
  requestedByUID: '',
  providerUID: '',
  budgetTypeUID: '',
  budgetUID: '',
  projectUID: '',
  priority: null,
  status: null,
}


export const EmptyOrder: Order = {
  uid: '',
  type: Empty,
  category: Empty,
  orderNo: '',
  name: '',
  description: '',
  justification: '',
  responsible: Empty,
  beneficiary: Empty,
  requestedBy: Empty,
  authorizedBy: Empty,
  provider: Empty,
  providersGroup: [],
  project: Empty,
  priority: Empty,
  startDate: null,
  endDate: null,
  identificators: [],
  tags: [],
  isForMultipleBeneficiaries: false,
  authorizationTime: '',
  closingTime: '',
  closedBy: Empty,
  baseOrgUnitName: '',
  baseBudgetName: '',
  subtotal: null,
  taxes: null,
  total: null,
  currency: Empty,
  status: Empty,
}


export const EmptyOrderItem: OrderItem = {
  uid: '',
  order: Empty,
  orderItemType: Empty,
  product: Empty,
  productCode: '',
  productUnit: Empty,
  project: Empty,
  beneficiary: Empty,
  quantity: null,
  unitPrice: null,
  total: null,
  currency: Empty,
  description: '',
  justification: '',
  startDate: null,
  endDate: null,
  status: Empty,
}


export const EmptyOrderActions: OrderActions = {
  canUpdate: false,
  canDelete: false,
  canEditItems: false,
  canCommitBudget: false,
  canRequestBudget: false,
  canRequestBudgetModification: false,
  canValidateBudget: false,
  canRequestPayment: false,
  canEditBills: false,
  canEditDocuments: false,
  canActivate: false,
  canSuspend: false,
};


export const EmptyOrderHolder: OrderHolder = {
  order: EmptyOrder,
  items: [],
  budgetTransactions: [],
  orders: [],
  bills: EmptyBillsStructure,
  paymentOrders: [],
  documents: [],
  history: [],
  actions: EmptyOrderActions,
}


export function mapOrderDescriptorFromOrder(order: Order): OrderDescriptor {
  return {
    uid: order.uid,
    typeName: order.type.name,
    categoryName: order.category.name,
    orderNo: order.orderNo,
    name: order.name,
    description: order.description,
    justification: order.justification,
    baseOrgUnitName: order.baseOrgUnitName,
    baseBudgetName: order.baseBudgetName,
    total: order.total ?? null,
    currencyName: order.currency.name,
    closedByName: order.closedBy.name,
    providerName: order.provider.name,
    projectName: order.project.name,
    priorityUID: order.priority.uid,
    priorityName: order.priority.name,
    startDate: order.startDate,
    endDate: order.endDate,
    authorizationTime: order.authorizationTime,
    authorizedByName: order.authorizedBy.name,
    closingTime: order.closingTime,
    statusName: order.status.name,
  };
}


export const OrdersOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.export,
    name: 'Exportar'
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
