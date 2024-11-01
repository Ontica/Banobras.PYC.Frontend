/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';

import { Document } from './documents';

import { WorkflowHistory } from './workflows';


export interface PayablesQuery {
  status: PayablesStatus;
  requesterOrgUnitUID: string;
  payableTypeUID: string;
  budgetTypeUID: string;
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
}


export const EmptyPayablesQuery: PayablesQuery = {
  status: null,
  requesterOrgUnitUID: '',
  payableTypeUID: '',
  budgetTypeUID: '',
  keywords: '',
  fromDate: '',
  toDate: '',
};


export enum PayablesStatus {
  Capture   = 'Capture',
  OnPayment = 'OnPayment',
  Payed     = 'Payed',
  Deleted   = 'Deleted',
}


export const PayableStatusList: Identifiable<PayablesStatus>[] = [
  { uid: PayablesStatus.Capture,   name: 'Capturado' },
  { uid: PayablesStatus.OnPayment, name: 'En proceso' },
  { uid: PayablesStatus.Payed,     name: 'Pagado' },
  { uid: PayablesStatus.Deleted,   name: 'Eliminado' },
];


export enum PayablesOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export interface PayableDescriptor {
  uid: string;
  payableTypeName: string;
  payableNo: string;
  contractNo: string;
  payTo: string;
  budgetTypeName: string;
  currencyCode: string;
  total: number;
  requestedBy: string;
  requestedTime: DateString;
  dueTime: DateString;
  statusName: string;
}


export interface PayableFields {
  payableTypeUID: string;
  payableEntityUID: string;
  description: string;
  organizationalUnitUID: string;
  payToUID: string;
  currencyUID: string;
  budgetTypeUID: string;
  dueTime: DateString;
}


export interface PayableData {
  payable: Payable;
  payableEntity: PayableEntity;
  items: PayableItem[];
  bills: Bill[];
  documents: Document[];
  history: WorkflowHistory[];
  actions: PayableActions;
}


export interface Payable {
  uid: string;
  payableNo: string;
  payableType: Identifiable;
  description: string;
  requestedBy: Identifiable;
  payTo: Identifiable;
  budgetType: Identifiable;
  total: number;
  currency: Identifiable;
  requestedTime: DateString;
  dueTime: DateString;
  status: Identifiable;
}


export interface PayableEntity {
  uid: string;
  type: string;
  entityNo: string;
  name: string;
  description: string;
  attributes: any[];
  ítems: PayableEntityItem[];
}


export interface PayableItem {
  uid: string;
  name: string;
  budgetAccount: Identifiable;
  billConcept: string;
  payableEntityItemUID: string;
  quantity: number;
  unit: string;
  total: number;
}


export interface Bill {

}


export interface BillItem {

}


export interface PayableActions {
  can: {
    update: boolean;
    delete: boolean;
    upploadBill: boolean;
    matchItems: boolean;
  };
  show: {
    documents: boolean;
    history: boolean;
  };
}


export interface PayableEntityItem {

}


export const PayablesOperationsList: ExplorerOperation[] = [
  {
    uid: PayablesOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: PayablesOperationType.print,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: PayablesOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export const EmptyPayableActions: PayableActions = {
  can: {
    update: false,
    delete: false,
    upploadBill: false,
    matchItems: false,
  },
  show: {
    documents: false,
    history: false,
  }
}


export const EmptyPayableEntity: PayableEntity = {
  uid: '',
  type: '',
  entityNo: '',
  name: '',
  description: '',
  attributes: [],
  ítems: [],
}


export const EmptyPayable: Payable = {
  uid: '',
  payableNo: '',
  payableType: Empty,
  description: '',
  requestedBy: Empty,
  payTo: Empty,
  budgetType: Empty,
  total: 0,
  currency: Empty,
  requestedTime: '',
  dueTime: '',
  status: Empty,
}


export const EmptyPayableData: PayableData = {
  payable: EmptyPayable,
  payableEntity: EmptyPayableEntity,
  items: [],
  bills: [],
  documents: [],
  history: [],
  actions: EmptyPayableActions,
}


export function mapPayableDescriptorFromPayable(data: PayableData): PayableDescriptor {
  return {
    uid: data.payable.uid,
    payableTypeName: data.payable.payableType.name,
    payableNo: data.payable.payableNo,
    contractNo: data.payableEntity.entityNo,
    payTo: data.payable.payTo.name,
    budgetTypeName: data.payable.budgetType.name,
    currencyCode: data.payable.currency.name,
    total: data.payable.total,
    requestedBy: data.payable.requestedBy.name,
    requestedTime: data.payable.requestedTime,
    dueTime: data.payable.dueTime,
    statusName: data.payable.status.name,
  };
}
