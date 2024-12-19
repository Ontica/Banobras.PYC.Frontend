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

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderHolder, OrderItem } from './orders';

import { Priority } from './steps';


export interface PayableOrderDescriptor extends OrderDescriptor {
  budgetTypeName: string;
  budgetName: string;
  currencyName: string;
  total: number;
}


export interface PayableOrderFields extends OrderFields {
  orderTypeUID: string;
  categoryUID: string;
  description: string;
  identificators: string[];
  tags: string[];
  responsibleUID: string;
  beneficiaryUID: string;
  isForMultipleBeneficiaries: boolean;
  providerUID: string;
  requestedByUID: string;
  projectUID: string;
  priority: Priority;
  budgetUID: string;
  currencyUID: string;
  // contractUID: string; // ????
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
  uid: string;
  order: Identifiable;
  orderType: Identifiable;
  product: Identifiable;
  budgetAccount: Identifiable;
  productUnit: Identifiable;
  quantity: number;
  unitPrice: number;
  total: number;
  description: string;
  status: Identifiable;
}


export interface PayableOrderActions extends OrderActions {

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
