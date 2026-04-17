/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { EmptyOrderExplorerTypeConfig, EmptyOrderHolder, OrderDescriptor, OrderExplorerTypeConfig,
         OrderHolder } from './orders/base-orders';

import { ExplorerOperation } from './base/explorer-data';

import { ObjectTypes } from './object-types';


export enum ProvisionQueryTypes {
  Procurement = 'Procurement',
  Budget      = 'Budget',
  All         = 'All',
}


export enum ProvisionStatus {
  Pending     = 'Pending',
  Programed   = 'Programed',
  Provisioned = 'Provisioned',
}



export const ProvisionStatusList: Identifiable<ProvisionStatus>[] = [
  { uid: ProvisionStatus.Pending,     name: 'Pendiente' },
  { uid: ProvisionStatus.Programed,   name: 'Programada' },
  { uid: ProvisionStatus.Provisioned, name: 'Provisionada' },
];


export interface ProvisionsQuery {
  requestedByUID: string;
  status: ProvisionStatus;
  fromDate: DateString;
  toDate: DateString;
  keywords: string;
  orderTypeUID: string;
  budgetUID: string;
}


export interface ProvisionHolder {
  order: OrderHolder;
  config: OrderExplorerTypeConfig<ObjectTypes>;
}


export const EmptyProvisionHolder: ProvisionHolder = {
  order: EmptyOrderHolder,
  config: EmptyOrderExplorerTypeConfig,
}


export interface ProvisionDescriptor extends OrderDescriptor {

}


export enum ProvisionsOperationType {
  provision   = 'provision',
  deprovision = 'deprovision',
}



export const ProvisionsOperationsList: ExplorerOperation[] = [
  {
    uid: ProvisionsOperationType.provision,
    name: 'Provisionar',
    showConfirm: true,
    isConfirmWarning: false,
    confirmOperationMessage: 'provisionará para el siguiente mes',
    confirmQuestionMessage: 'Provisiono'
  },
  {
    uid: ProvisionsOperationType.deprovision,
    name: 'Desprovisionar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'desprovisionará del siguiente mes',
    confirmQuestionMessage: 'Desprovisiono'
  },
];


export const EmptyProvisionsQuery: ProvisionsQuery = {
  requestedByUID: '',
  status: null,
  fromDate: '',
  toDate: '',
  keywords: '',
  orderTypeUID: '',
  budgetUID: '',
}
