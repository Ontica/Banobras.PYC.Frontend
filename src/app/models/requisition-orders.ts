/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderHolder, OrderItem,
         OrderItemFields } from './orders';

import { PaymentOrderDescriptor } from './payments-orders';


export interface RequisitionOrderDescriptor extends OrderDescriptor {
  budgetTypeName: string;
  budgetsName: string;
  total: number;
}


export interface RequisitionOrderFields extends OrderFields {
  budgets: string[];
}


export interface RequisitionOrderHolder extends OrderHolder {
  order: RequisitionOrder;
  items: RequisitionOrderItem[];
  budgetTransactions: BudgetTransactionDescriptor[];
  payables: OrderDescriptor[];
  invoices: Document[];
  payments: PaymentOrderDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: RequisitionOrderActions;
}


export interface RequisitionOrder extends Order {
  budgetType: Identifiable;
  budgets: Identifiable[];
  total: number;
}


export interface RequisitionOrderItem extends OrderItem {
  budgetAccount: Identifiable;
  unitPrice: number;
  discount: number;
  currency: Identifiable;
  total: number;
}


export interface RequisitionOrderActions extends OrderActions {

}


export interface RequisitionOrderItemFields extends OrderItemFields {
  budgetAccountUID: string;
  unitPrice: number;
  discount: number;
}


export function mapRequisitionOrderDescriptorFromRequisitionOrder(order: RequisitionOrder): RequisitionOrderDescriptor {
  return {
    uid: order.uid,
    typeName: order.type.name,
    categoryName: order.category.name,
    orderNo: order.orderNo,
    description: order.description,
    justification: order.justification,
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
    budgetTypeName: order.budgetType?.name ?? '',
    budgetsName: order.budgets?.map(x => x.name).join() ?? '',
    total: order.total ?? null,
  };
}
