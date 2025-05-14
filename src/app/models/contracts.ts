/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { EntityStatus, ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { EmptyBudgetType } from './budgets';

import { BudgetTransactionDescriptor } from './budget-transactions';

import { ContractOrderDescriptor } from './contract-orders';

import { Document } from './documents';

import { HistoryEntry } from './history';


export interface ContractsQuery {
  status: EntityStatus;
  keywords: string;
  contractNo: string;
  contractTypeUID: string;
  managedByOrgUnitUID: string;
  budgetTypeUID: string;
  supplierUID: string;
}


export interface ContractDescriptor {
  uid: string;
  contractNo: string;
  contractType: string;
  name: string;
  description: string;
  signDate: DateString;
  managedByOrgUnit: string;
  budgetType: string;
  supplier: string;
  total: number;
  currency: string;
  fromDate: DateString;
  toDate: DateString;
  statusName: string;
}


export interface ContractFields {
  contractTypeUID: string;
  contractNo: string;
  name: string;
  description: string;
  budgetTypeUID: string;
  budgetsUIDs: string[];
  managedByOrgUnitUID: string;
  isForMultipleOrgUnits: boolean;
  fromDate: DateString;
  toDate: DateString;
  signDate: DateString;
  supplierUID: string;
  currencyUID: string;
}


export const ContractsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
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


export interface ContractData {
  contract: Contract;
  items: ContractItem[];
  budgetTransactions: BudgetTransactionDescriptor[];
  orders: ContractOrderDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: ContractActions;
}


export interface Contract {
  uid: string;
  managedByOrgUnit: Identifiable;
  budgetType: Identifiable;
  budgets: Identifiable[];
  contractType: Identifiable;
  isForMultipleOrgUnits: boolean;
  supplier: Identifiable;
  suppliersGroup: Identifiable[];
  contractNo: string;
  name: string;
  total: number;
  currency: Identifiable;
  fromDate: DateString;
  toDate: DateString;
  description: string;
  signDate: DateString;
  status: Identifiable;
}


export interface ContractItem {
  uid: string;
  contractItemType: Identifiable;
  contract: Identifiable;
  requesterOrgUnit: Identifiable;
  supplier: Identifiable;
  budget: Identifiable;
  product: Identifiable;
  productUnit: Identifiable;
  budgetAccount: Identifiable;
  project: Identifiable;
  periodicityType: Identifiable;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  description: string;
  name: string;
}


export interface ContractItemFields {
  contractItemTypeUID: string;
  requisitionItemUID: string;
  requesterOrgUnitUID: string;
  supplierUID: string;
  budgetUID: string;
  productUID: string;
  productUnitUID: string;
  budgetAccountUID: string;
  projectUID: string;
  periodicityTypeUID: string;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  description: string;
}


export interface ContractActions {
  canUpdate: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canSuspend: boolean;
  canEditItems: boolean;
  canRequestBudget: boolean;
  canEditDocuments: boolean;
}


export const EmptyContractsQuery: ContractsQuery = {
  status: null,
  keywords: '',
  contractTypeUID: '',
  managedByOrgUnitUID: '',
  budgetTypeUID: '',
  supplierUID: '',
  contractNo: '',
};


export const EmptyContract: Contract = {
  uid: '',
  managedByOrgUnit: Empty,
  budgetType: EmptyBudgetType,
  budgets: [],
  contractType: Empty,
  isForMultipleOrgUnits: false,
  supplier: Empty,
  suppliersGroup: [],
  contractNo: '',
  name: '',
  total: null,
  currency: Empty,
  fromDate: '',
  toDate: '',
  description: '',
  signDate: '',
  status: Empty,
};


export const EmptyContractItem: ContractItem = {
  uid: '',
  contractItemType: Empty,
  contract: Empty,
  requesterOrgUnit: Empty,
  supplier: Empty,
  budget: Empty,
  budgetAccount: Empty,
  product: Empty,
  productUnit: Empty,
  project: Empty,
  periodicityType: Empty,
  description: null,
  minQuantity: null,
  maxQuantity: null,
  unitPrice: null,
  name: null,
}


export const EmptyContractActions: ContractActions = {
  canUpdate: false,
  canDelete: false,
  canActivate: false,
  canSuspend: false,
  canEditItems: false,
  canRequestBudget: false,
  canEditDocuments: false,
}


export const EmptyContractData: ContractData = {
  contract: EmptyContract,
  items: [],
  budgetTransactions: [],
  orders: [],
  documents: [],
  history: [],
  actions: EmptyContractActions,
};


export function mapContractDescriptorFromContract(contract: Contract): ContractDescriptor {
  return {
    uid: contract.uid,
    contractNo: contract.contractNo,
    contractType: contract.contractType.name,
    name: contract.name,
    description: contract.description,
    signDate: contract.signDate,
    managedByOrgUnit: contract.managedByOrgUnit.name,
    budgetType: contract.budgetType.name,
    supplier: contract.supplier.name,
    total: contract.total,
    currency: contract.currency.name,
    fromDate: contract.fromDate,
    toDate: contract.toDate,
    statusName: contract.status.name,
  };
}
