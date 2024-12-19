/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { Document } from './documents';

import { History } from './history';

import { EntityStatus, ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { Priority } from './steps';

import { RequestsList } from './requests';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { ObjectTypes } from './object-types';


export interface OrderTypeConfig {
  orderType: ObjectTypes;
  orderNameSingular: string;
  orderNamePlural: string;
  orderPronounSingular: string;
  orderPronounPlural: string;
  selectionMessage: string;
  requestsList: RequestsList;
}


export const EmptyOrderTypeConfig: OrderTypeConfig = {
  orderType: null,
  orderNameSingular: 'Orden',
  orderNamePlural: 'Ordenes',
  orderPronounSingular: 'la',
  orderPronounPlural: 'las',
  selectionMessage: 'seleccionadas',
  requestsList: null,
}


export function getOrderTypeConfig(orderType: ObjectTypes): OrderTypeConfig {
  switch (orderType) {
    case ObjectTypes.PayableOrder:
      return {
        orderType: ObjectTypes.PayableOrder,
        orderNameSingular: 'entrega',
        orderNamePlural: 'entregas',
        orderPronounSingular: 'la',
        orderPronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
      };
    case ObjectTypes.MinorPurchase:
      return {
        orderType: ObjectTypes.MinorPurchase,
        orderNameSingular: 'compra menor',
        orderNamePlural: 'compras menores',
        orderPronounSingular: 'la',
        orderPronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        requestsList: RequestsList.contracts,
      };
    case ObjectTypes.Expense:
      return {
        orderType: ObjectTypes.Expense,
        orderNameSingular: 'gasto',
        orderNamePlural: 'gastos',
        orderPronounSingular: 'el',
        orderPronounPlural: 'los',
        selectionMessage: 'seleccionados',
        requestsList: RequestsList.payments,
      };
    default: return EmptyOrderTypeConfig;
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
  // budgetTypeUID: string;
  // budgetUID: string;
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


export interface OrderItemFields {

}


export interface OrderItem {
  uid: string;
  order: Identifiable;
  orderType: Identifiable;
  description: string;
  product: Identifiable;
  productUnit: Identifiable;
  quantity: number;
  status: Identifiable;
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
  description: '',
  product: Empty,
  productUnit: Empty,
  quantity: null,
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
