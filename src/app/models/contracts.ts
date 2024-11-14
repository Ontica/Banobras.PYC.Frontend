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


export const ContractStatusList: Identifiable<EntityStatus>[] = [
  { uid: EntityStatus.Pending,      name: 'Pendiente' },
  { uid: EntityStatus.Active,       name: 'Activo' },
  { uid: EntityStatus.OnReview,     name: 'En revisión' },
  { uid: EntityStatus.Suspended,    name: 'Suspendido' },
  { uid: EntityStatus.Discontinued, name: 'Descontinuado' },
  { uid: EntityStatus.Deleted,      name: 'Eliminado' },
];


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
  currency: string;
  fromDate: DateString;
  toDate: DateString;
  statusName: string;
}


export interface ContractFields {

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
  supplier: Identifiable;
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
  contract: Identifiable;
  supplier: Identifiable;
  budgetAccount: Identifiable;
  product: Identifiable;
  project: Identifiable;
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
  contractNo: '',
  name: '',
  description: '',
  supplier: Empty,
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
