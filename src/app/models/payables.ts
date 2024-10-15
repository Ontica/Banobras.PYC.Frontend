/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { ExplorerOperation } from './_explorer-data';


export interface PayablesQuery {
  status: PayableStatus;
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


export interface PayableStatus extends Identifiable {
  uid: PayablesStatus;
  name: string;
}


export const PayableStatusList: PayableStatus[] = [
  { uid: PayablesStatus.Capture,   name: 'Capturado' },
  { uid: PayablesStatus.OnPayment, name: 'En proceso' },
  { uid: PayablesStatus.Payed,     name: 'Pagado' },
  { uid: PayablesStatus.Deleted,   name: 'Eliminado' },
];


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


export enum PayablesOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export const PayablesOperationsList: ExplorerOperation[] = [
  { uid: PayablesOperationType.excel,  name: 'Exportar' },
  { uid: PayablesOperationType.print,  name: 'Imprimir' },
  { uid: PayablesOperationType.delete, name: 'Eliminar' },
];
