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

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderHolder, OrderItem, OrderItemFields,
         mapOrderDescriptorFromOrder } from './orders';


export interface PayableOrderDescriptor extends OrderDescriptor {
  budgetTypeName: string;
  budgetName: string;
  currencyName: string;
}


export interface PayableOrderFields extends OrderFields {
  budgetUID: string;
  currencyUID: string;
}


export interface PayableOrderHolder extends OrderHolder {
  order: PayableOrder;
  items: PayableOrderItem[];
  budgetTransactions: BudgetTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: PayableOrderActions;
}


export interface PayableOrder extends Order {
  budgetType: Identifiable;
  budget: Identifiable;
  currency: Identifiable;
}


export interface PayableOrderItem extends OrderItem {
  budgetAccount: Identifiable;
  discount: number;
  currency: Identifiable;
}


export interface PayableOrderActions extends OrderActions {

}


export interface PayableOrderItemFields extends OrderItemFields {
  budgetAccountUID: string;
  discount: number;
}


export function mapPayableOrderDescriptorFromPayableOrder(order: PayableOrder): PayableOrderDescriptor {
  return {
    ...mapOrderDescriptorFromOrder(order),
    ...
    {
      budgetTypeName: order.budgetType?.name ?? '',
      budgetName: order.budget?.name ?? '',
      currencyName: order.currency?.name ?? '',
    }
  };
}
