/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Entity, Identifiable } from '@app/core';

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderHolder, OrderItem, OrderItemFields,
         mapOrderDescriptorFromOrder } from './base-orders';

import { BudgetTransactionDescriptor } from '../budget-transactions';

import { Document } from '../documents';

import { HistoryEntry } from '../history';

import { PaymentOrderDescriptor } from '../payments-orders';


export interface RequisitionOrderDescriptor extends OrderDescriptor {

}


export interface RequisitionOrderFields extends OrderFields {
  budgets: string[];
  observations: string;
  guaranteeNotes: string;
  deliveryNotes: string;
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
  actions: OrderActions;
}


export interface RequisitionOrder extends Order {
  budgetType: Identifiable;
  budgets: Identifiable[];
  observations: string;
  guaranteeNotes: string;
  deliveryNotes: string;
}


export interface RequisitionOrderItem extends OrderItem {
  budget: Identifiable;
  budgetAccount: Identifiable;
  budgetControlNo: string;
}


export interface RequisitionOrderItemFields extends OrderItemFields {
  budgetUID: string;
  budgetAccountUID: string;
}


export function mapRequisitionOrderDescriptorFromRequisitionOrder(order: RequisitionOrder): RequisitionOrderDescriptor {
  return {
    ...mapOrderDescriptorFromOrder(order)
  };
}
