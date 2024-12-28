/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { Document } from './documents';

import { History } from './history';

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderHolder, OrderItem,
         OrderItemFields } from './orders';


export interface PayableOrderDescriptor extends OrderDescriptor {
  budgetTypeName: string;
  budgetName: string;
  currencyName: string;
  total: number;
}


export interface PayableOrderFields extends OrderFields {
  budgetUID: string;
  currencyUID: string;
}


export interface PayableOrderHolder extends OrderHolder {
  order: PayableOrder;
  items: PayableOrderItem[];
  documents: Document[];
  history: History[];
  budgetTransactions: BudgetTransactionDescriptor[];
  actions: PayableOrderActions;
}


export interface PayableOrder extends Order {
  budgetType: Identifiable;
  budget: Identifiable;
  currency: Identifiable;
  total: number;
}


export interface PayableOrderItem extends OrderItem {
  budgetAccount: Identifiable;
  unitPrice: number;
  discount: number;
  currency: Identifiable;
  total: number;
}


export interface PayableOrderActions extends OrderActions {

}


export interface PayableOrderItemFields extends OrderItemFields {
  budgetAccountUID: string;
  unitPrice: number;
  discount: number;
}


export function mapPayableOrderDescriptorFromPayableOrder(order: PayableOrder): PayableOrderDescriptor {
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
    budgetTypeName: order.budgetType?.name ?? '',
    budgetName: order.budget?.name ?? '',
    currencyName: order.currency?.name ?? '',
    total: order.total ?? null,
  };
}
