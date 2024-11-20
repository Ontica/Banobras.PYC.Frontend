/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, EmptyBaseActions, EntityStatus, ExplorerOperation } from './_explorer-data';

import { Document } from './documents';

import { History } from './history';

import { FixedAssetTransaction } from './fixed-assets-transactions';


export interface FixedAssetsQuery {
  inventoryNo: string;
  fixedAssetTypeUID: string;
  custodianOrgUnitUID: string;
  keywords: string;
  status: EntityStatus;
}


export interface FixedAssetDescriptor {
  uid: string;
  custodianOrgUnitName: string;
  fixedAssetTypeName: string;
  inventoryNo: string;
  name: string;
  location: string;
  condition: string;
  label: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface FixedAssetFields {
  fixedAssetTypeUID: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  label: string;
  custodianOrgUnitUID: string;
  custodianPersonUID: string;
  location: string;
  startDate: DateString;
  endDate: DateString;
}


export interface FixedAssetHolder {
  fixedAsset: FixedAsset;
  transactions: FixedAssetTransaction[];
  documents: Document[];
  history: History[];
  actions: BaseActions;
}


export interface FixedAsset {
  uid: string;
  fixedAssetType: Identifiable;
  inventoryNo: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  label: string;
  custodianOrgUnit: Identifiable;
  custodianPerson: Identifiable;
  location: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export enum FixedAssetsOperationType {
  excel  = 'excel',
  delete = 'delete',
}


export const EmptyFixedAsset: FixedAsset = {
  uid: '',
  fixedAssetType: Empty,
  inventoryNo: '',
  name: '',
  description: '',
  brand: '',
  model: '',
  year: null,
  label: '',
  custodianOrgUnit: Empty,
  custodianPerson: Empty,
  location: '',
  startDate: '',
  endDate: '',
  status: Empty,
};


export const EmptyFixedAssetHolder: FixedAssetHolder = {
  fixedAsset: EmptyFixedAsset,
  transactions: [],
  documents: [],
  history: [],
  actions: EmptyBaseActions,
};


export const FixedAssetsOperationsList: ExplorerOperation[] = [
  {
    uid: FixedAssetsOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: FixedAssetsOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export const EmptyFixedAssetsQuery: FixedAssetsQuery = {
  inventoryNo: '',
  fixedAssetTypeUID: '',
  custodianOrgUnitUID: '',
  keywords: '',
  status: null,
};
