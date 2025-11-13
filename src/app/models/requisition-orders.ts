/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Entity, Identifiable } from '@app/core';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderHolder, OrderItem, OrderItemFields,
         mapOrderDescriptorFromOrder } from './orders';

import { PaymentOrderDescriptor } from './payments-orders';


export interface RequisitionOrderForEdition extends Entity {
  uid:string;
  orderNo: string;
  description: string;
  budgets: Identifiable[];
}

export interface RequisitionOrderDescriptor extends OrderDescriptor {
  budgetTypeName: string;
  budgetsName: string;
}


export interface RequisitionOrderFields extends OrderFields {
  budgets: string[];
}


export interface RequisitionOrderHolder extends OrderHolder {
  order: RequisitionOrder;
  items: RequisitionOrderItem[];
  budgetTransactions: BudgetTransactionDescriptor[];
  payables: OrderDescriptor[];
  bills: Document[];
  paymentOrders: PaymentOrderDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: RequisitionOrderActions;
}


export interface RequisitionOrder extends Order {
  budgetType: Identifiable;
  budgets: Identifiable[];
}


export interface RequisitionOrderItem extends OrderItem {
  budget: Identifiable;
  budgetAccount: Identifiable;
  budgetControlNo: string;
}


export interface RequisitionOrderActions extends OrderActions {

}


export interface RequisitionOrderItemFields extends OrderItemFields {
  budgetUID: string;
  budgetAccountUID: string;
}


export function mapRequisitionOrderDescriptorFromRequisitionOrder(order: RequisitionOrder): RequisitionOrderDescriptor {
  return {
    ...mapOrderDescriptorFromOrder(order),
    ...
    {
      budgetTypeName: order.budgetType?.name ?? '',
      budgetsName: order.budgets?.map(x => x.name).join() ?? '',
    }
  };
}
