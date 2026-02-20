/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { ExplorerOperation, ExplorerOperationType } from '../base/explorer-data';

import { Order, OrderActions, OrderDescriptor, OrderFields, OrderForEdition, OrderHolder, OrderItem,
         OrderItemFields, mapOrderDescriptorFromOrder } from './base-orders';

import { BudgetTransactionDescriptor } from '../budget-transactions';

import { ContractOrderDescriptor } from './contract-orders';

import { Document } from '../documents';

import { HistoryEntry } from '../history';

import { TaxEntry } from '../taxes';


export interface ContractDescriptor extends OrderDescriptor {
  contractNo: string;
  signDate: DateString;
  minTotal: number;
  maxTotal: number;
}


export interface ContractFields extends OrderFields {
  requisitionUID: string;
  contractNo: string;
  budgets: string[];
  signDate: DateString;
}


export interface ContractData extends OrderHolder {
  order: Contract;
  items: ContractItem[];
  taxes: TaxEntry[];
  budgetTransactions: BudgetTransactionDescriptor[];
  orders: ContractOrderDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: OrderActions;
}


export interface Contract extends Order {
  requisition: OrderForEdition;
  contractNo: string;
  budgetType: Identifiable;
  budgets: Identifiable[];
  signDate: DateString;
  minTotal: number;
  maxTotal: number;
}


export interface ContractItem extends OrderItem {
  requisitionItem: OrderItem;
  name: string;
  provider: Identifiable;
  budget: Identifiable;
  budgetAccount: Identifiable;
  budgetControlNo: string;
  periodicityType: Identifiable;
  minQuantity: number;
  maxQuantity: number;
}


export interface ContractItemFields extends OrderItemFields {
  requisitionItemUID: string;
  budgetUID: string;
  budgetAccountUID: string;
  minQuantity: number;
  maxQuantity: number;
}


export function mapContractDescriptorFromContract(order: Contract): ContractDescriptor {
  return {
    ...mapOrderDescriptorFromOrder(order),
    ...
    {
      contractNo: order.contractNo,
      signDate: order.signDate,
      minTotal: order.minTotal,
      maxTotal: order.maxTotal,
    }
  };
}


export const ContractsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.export,
    name: 'Exportar'
  },
  {
    uid: ExplorerOperationType.pdf,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
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
