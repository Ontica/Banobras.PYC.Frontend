/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { EntityStatus, ExplorerOperation } from './_explorer-data';

import { Document } from './documents';

import { History } from './history';


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
  managedByOrgUnitUID: string;
  isForMultipleOrgUnits: boolean;
  fromDate: DateString;
  toDate: DateString;
  signDate: DateString;
  supplierUID: string;
  currencyUID: string;
  total: number;
}


export enum ContractsOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export const ContractsOperationsList: ExplorerOperation[] = [
  {
    uid: ContractsOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: ContractsOperationType.print,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: ContractsOperationType.delete,
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
  milestones: ContractMilestone[];
  documents: Document[];
  history: History[];
  actions: ContractActions;
}


export interface Contract {
  uid: string;
  managedByOrgUnit: Identifiable;
  budgetType: Identifiable;
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
  product: Identifiable;
  productUnit: Identifiable;
  budgetAccount: Identifiable;
  project: Identifiable;
  supplier: Identifiable;
  periodicityType: Identifiable;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  description: string;
  unit: Identifiable;
  fromQuantity: number;
  toQuantity: number;
  unitPrice: number;
  periodicity: Identifiable;
}


export interface ContractMilestone {
  uid: string;
  managedByOrgUnit: Identifiable;
  contract: Identifiable;
  supplier: Identifiable;
  milestoneNo: string;
  name: string;
  description: string;
  total: number;
  status: Identifiable;
  items: ContractMilestoneItem[];
}


export interface ContractMilestoneItem {
  uid: string;
  contractMilestone: Identifiable;
  contractItem: Identifiable;
  description: string;
  product: Identifiable;
  productUnit: Identifiable;
  quantity: number;
  unitPrice: number;
  total: number;
  budgetAccount: Identifiable;
  status: Identifiable;
}


export interface ContractActions {
  canUpdate: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canSuspend: boolean;
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
  contractType: Empty,
  isForMultipleOrgUnits: false,
  contractNo: '',
  name: '',
  description: '',
  supplier: Empty,
  suppliersGroup: [],
  managedByOrgUnit: Empty,
  fromDate: '',
  toDate: '',
  signDate: '',
  budgetType: Empty,
  currency: Empty,
  total: null,
  status: Empty,
};


export const EmptyContractActions: ContractActions = {
  canUpdate: false,
  canDelete: false,
  canActivate: false,
  canSuspend: false,
  canRequestBudget: false,
  canEditDocuments: false,
}


export const EmptyContractData: ContractData = {
  contract: EmptyContract,
  items: [],
  milestones: [],
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
