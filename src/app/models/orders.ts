/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { EntityStatus, ExplorerOperation, ExplorerOperationType, ExplorerTypeConfig } from './_explorer-data';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { ObjectTypes } from './object-types';

import { Priority } from './steps';

import { RequestsList } from './requests';


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
    case ObjectTypes.PURCHASE_ORDER:
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


export interface OrdersQuery {
  orderTypeUID: string;
  requestedByUID: string;
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
  description: string;
  justification: string;
  baseOrgUnitName: string;
  baseBudgetName: string;
  total: number;
  priorityUID: string;
  priorityName: string;
  providerName: string;
  projectName: string;
  closedByName: string;
  authorizedByName: string;
  authorizationTime: DateString;
  closingTime: DateString;
  statusName: string;
}


export interface OrderFields {
  orderTypeUID: string;
  categoryUID: string;
  startDate: DateString;
  endDate: DateString;
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
  justification: string;
}


export interface OrderHolder {
  order: Order;
  items: OrderItem[];
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
  description: string;
  justification: string;
  responsible: Identifiable;
  beneficiary: Identifiable;
  requestedBy: Identifiable;
  authorizedBy: Identifiable;
  provider: Identifiable;
  providersGroup: Identifiable[];
  project: Identifiable;
  priority: Identifiable<Priority>;
  startDate: DateString;
  endDate: DateString;
  identificators: string[];
  tags: string[];
  isForMultipleBeneficiaries: boolean;
  closedBy: Identifiable;
  authorizationTime: DateString;
  closingTime: DateString;
  baseOrgUnitName: string;
  baseBudgetName: string;
  total: number;
  status: Identifiable<EntityStatus>;
}


export interface OrderItem {
  uid: string;
  order: Identifiable;
  orderItemType: Identifiable;
  requestedBy: Identifiable;
  project: Identifiable;
  product: Identifiable;
  productCode: string; // deberia ir dentro de product
  productUnit: Identifiable;
  quantity: number;
  unitPrice: number;
  total: number;
  description: string;
  justification: string;
  startDate: DateString;
  endDate: DateString;
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
  canRequestBudgetModification: boolean;
  canValidateBudget: boolean;
}


export interface OrderItemFields {
  requestedByUID: string;
  productUID: string;
  productUnitUID: string;
  projectUID: string;
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
  total: null,
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
  requestedBy: Empty,
  quantity: null,
  unitPrice: null,
  total: null,
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
  canRequestBudget: false,
  canRequestBudgetModification: false,
  canValidateBudget: false,
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


export function mapOrderDescriptorFromOrder(order: Order): OrderDescriptor {
  return {
    uid: order.uid,
    typeName: order.type.name,
    categoryName: order.category.name,
    orderNo: order.orderNo,
    description: order.description,
    justification: order.justification,
    baseOrgUnitName: order.baseOrgUnitName,
    baseBudgetName: order.baseBudgetName,
    total: order.total ?? null,
    closedByName: order.closedBy.name,
    providerName: order.provider.name,
    projectName: order.project.name,
    priorityUID: order.priority.uid,
    priorityName: order.priority.name,
    authorizationTime: order.authorizationTime,
    authorizedByName: order.authorizedBy.name,
    closingTime: order.closingTime,
    statusName: order.status.name,
  };
}
