/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderForEdition, OrderHolder, OrderItem,
         OrderItemFields, mapOrderDescriptorFromOrder } from './base-orders';

import { BudgetTransactionDescriptor } from '../budget-transactions';

import { Document } from '../documents';

import { HistoryEntry } from '../history';

import { TaxEntry } from '../taxes';


export interface PayableOrderDescriptor extends OrderDescriptor {

}


export interface PayableOrderFields extends OrderFields {
  requisitionUID: string;
  budgetUID: string;
  expenseTypeUID: string;
}


export interface PayableOrderHolder extends OrderHolder {
  order: PayableOrder;
  items: PayableOrderItem[];
  taxes: TaxEntry[];
  budgetTransactions: BudgetTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: OrderActions;
}


export interface PayableOrder extends Order {
  budgetType: Identifiable;
  budget: Identifiable;
  requisition: OrderForEdition;
  expenseType: Identifiable;
}


export interface PayableOrderItem extends OrderItem {
  budgetAccount: Identifiable;
  budgetControlNo: string;
  discount: number;
  penaltyDiscount: number;
  requisitionItem: OrderItem;
}


export interface PayableOrderItemFields extends OrderItemFields {
  budgetAccountUID: string;
  discount: number;
  penaltyDiscount: number;
  requisitionItemUID: string;
}


export function mapPayableOrderDescriptorFromPayableOrder(order: PayableOrder): PayableOrderDescriptor {
  return {
    ...mapOrderDescriptorFromOrder(order),
  };
}
