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

import { ContractItem } from './contracts';

import { Document } from '../documents';

import { HistoryEntry } from '../history';


export interface ContractOrderDescriptor extends OrderDescriptor {
  contractNo: string;
  contractName: string;
}

export interface ContractOrderFields extends OrderFields {
  contractUID: string;
  budgetUID: string;
}


export interface ContractOrderHolder extends OrderHolder {
  order: ContractOrder;
  items: ContractOrderItem[];
  budgetTransactions: BudgetTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: OrderActions;
}


export interface ContractOrder extends Order {
  budgetType: Identifiable;
  budget: Identifiable;
  contract: OrderForEdition;
}


export interface ContractOrderItem extends OrderItem {
  contractItem: ContractItem;
  budgetAccount: Identifiable;
  budgetControlNo: string;
  discount: number;
}


export interface ContractOrderItemFields extends OrderItemFields {
  contractItemUID: string;
  budgetAccountUID: string;
  discount: number;
}


export function mapContractOrderDescriptorFromContractOrder(order: ContractOrder): ContractOrderDescriptor {
  return {
    ...mapOrderDescriptorFromOrder(order),
    ...
    {
      contractNo: order.contract.orderNo,
      contractName: order.contract.name,
    }
  };
}
