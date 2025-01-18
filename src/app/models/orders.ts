/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { Document } from './documents';

import { History } from './history';

import { EntityStatus, ExplorerOperation, ExplorerOperationType, ExplorerTypeConfig } from './_explorer-data';

import { Priority } from './steps';

import { RequestsList } from './requests';

import { BudgetTransactionDescriptor } from './budget-transactions';


export enum ObjectTypes {
  CONTRACT       = 'ObjectTypeInfo.Contract.Procurement',
  CONTRACT_ORDER = 'ObjectTypeInfo.Order.PayableOrder.ContractOrder',
  PURCHASE_ORDER = 'ObjectTypeInfo.Order.PayableOrder.PurchaseOrder',
  EXPENSE        = 'ObjectTypeInfo.Order.PayableOrder.Expenses',
}


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
}


export function getOrderExplorerTypeConfig(type: ObjectTypes): OrderExplorerTypeConfig<ObjectTypes> {
  switch (type) {
    case ObjectTypes.CONTRACT_ORDER:
      return {
        type,
        nameSingular: 'entrega',
        namePlural: 'entregas',
        pronounSingular: 'la',
        pronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
      };
    case ObjectTypes.PURCHASE_ORDER:
      return {
        type,
        nameSingular: 'compra menor',
        namePlural: 'compras menores',
        pronounSingular: 'la',
        pronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
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
      };
    default: return EmptyOrderExplorerTypeConfig;
  }
}


export interface OrdersQuery {
  orderTypeUID: string;
  responsibleUID: string;
  status: EntityStatus;
  keywords: string;
  categoryUID: string;
  providerUID: string;
  projectUID: string;
  orderNo: string;
  priority: Priority;
}


export interface OrderDescriptor {
  uid: string;
  typeName: string;
  categoryName: string;
  orderNo: string;
  priorityUID: string;
  priorityName: string;
  responsibleName: string;
  beneficiaryName: string;
  providerName: string;
  projectName: string;
  description: string;
  requestedByName: string;
  authorizedByName: string;
  authorizationTime: DateString;
  closingTime: DateString;
  closedByName: string;
  statusName: string;
}


export interface OrderFields {
  orderTypeUID: string;
  categoryUID: string;
  priority: Priority;
  responsibleUID: string;
  beneficiaryUID: string;
  requestedByUID: string;
  providerUID: string;
  isForMultipleBeneficiaries: boolean;
  projectUID: string;
  identificators: string[];
  tags: string[];
  description: string;
}


export interface OrderHolder {
  order: Order;
  items: OrderItem[];
  budgetTransactions: BudgetTransactionDescriptor[];
  documents: Document[];
  history: History[];
  actions: OrderActions;
}


export interface Order {
  uid: string;
  type: Identifiable;
  category: Identifiable;
  orderNo: string;
  description: string;
  identificators: string[];
  tags: string[];
  responsible: Identifiable;
  beneficiary: Identifiable;
  isForMultipleBeneficiaries: boolean;
  provider: Identifiable;
  providersGroup: Identifiable[];
  requestedBy: Identifiable;
  project: Identifiable;
  priority: Identifiable<Priority>;
  authorizationTime: DateString;
  authorizedBy: Identifiable;
  closingTime: DateString;
  closedBy: Identifiable;
  status: Identifiable<EntityStatus>;
}


export interface OrderItem {
  uid: string;
  order: Identifiable;
  orderType: Identifiable<ObjectTypes>;
  product: Identifiable;
  productUnit: Identifiable;
  quantity: number;
  description: string;
  status: Identifiable;
  requestedBy: Identifiable;
  project: Identifiable;
}


export interface OrderActions {
  canUpdate: boolean;
  canEditDocuments: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canSuspend: boolean;
  canEditItems: boolean;
  canRequestBudget: boolean;
}


export interface OrderItemFields {
  productUID: string;
  productUnitUID: string;
  requestedByUID: string;
  projectUID: string;
  quantity: number;
  description: string;
}


export const EmptyOrdersQuery: OrdersQuery = {
  orderTypeUID: '',
  orderNo: '',
  categoryUID: '',
  keywords: '',
  responsibleUID: '',
  providerUID: '',
  projectUID: '',
  priority: null,
  status: null,
}


export const EmptyOrder: Order = {
  uid: '',
  type: Empty,
  category: Empty,
  orderNo: '',
  description: '',
  identificators: [],
  tags: [],
  responsible: Empty,
  beneficiary: Empty,
  isForMultipleBeneficiaries: false,
  provider: Empty,
  providersGroup: [],
  requestedBy: Empty,
  project: Empty,
  priority: Empty,
  authorizationTime: '',
  authorizedBy: Empty,
  closingTime: '',
  closedBy: Empty,
  status: Empty,
}


export const EmptyOrderItem: OrderItem = {
  uid: '',
  order: Empty,
  orderType: Empty,
  product: Empty,
  productUnit: Empty,
  project: Empty,
  requestedBy: Empty,
  quantity: null,
  description: '',
  status: Empty,
}


export const EmptyOrderActions: OrderActions = {
  canUpdate: false,
  canDelete: false,
  canEditItems: false,
  canRequestBudget: false,
  canEditDocuments: false,
  canActivate: false,
  canSuspend: false,
};


export const EmptyOrderHolder: OrderHolder = {
  order: EmptyOrder,
  items: [],
  budgetTransactions: [],
  documents: [],
  history: [],
  actions: EmptyOrderActions,
}


export const OrdersOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
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


export function mapOrderDescriptorFromOrder(order: Order): OrderDescriptor {
  return {
    uid: order.uid,
    typeName: order.type.name,
    categoryName: order.category.name,
    orderNo: order.orderNo,
    description: order.description,
    responsibleName: order.responsible.name,
    beneficiaryName: order.beneficiary.name,
    providerName: order.provider.name,
    requestedByName: order.requestedBy.name,
    projectName: order.project.name,
    priorityUID: order.priority.uid,
    priorityName: order.priority.name,
    authorizationTime: order.authorizationTime,
    authorizedByName: order.authorizedBy.name,
    closingTime: order.closingTime,
    closedByName: order.closedBy.name,
    statusName: order.status.name,
  };
}
