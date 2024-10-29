/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';


export enum ContractsStatus {
  Pending      = 'Pending',
  Active       = 'Active',
  OnReview     = 'OnReview',
  Suspended    = 'Suspended',
  Discontinued = 'Discontinued',
  Deleted      = 'Deleted',
}


export const ContractStatusList: Identifiable<ContractsStatus>[] = [
  { uid: ContractsStatus.Pending,      name: 'Pendiente' },
  { uid: ContractsStatus.Active,       name: 'Activo' },
  { uid: ContractsStatus.OnReview,     name: 'En revisión' },
  { uid: ContractsStatus.Suspended,    name: 'Suspendido' },
  { uid: ContractsStatus.Discontinued, name: 'Descontinuado' },
  { uid: ContractsStatus.Deleted,      name: 'Eliminado' },
];



export interface ContractsQuery {
  status: ContractsStatus;
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


export const EmptyContractsQuery: ContractsQuery = {
  status: null,
  keywords: '',
  contractTypeUID: '',
  managedByOrgUnitUID: '',
  budgetTypeUID: '',
  supplierUID: '',
  contractNo: '',
};
