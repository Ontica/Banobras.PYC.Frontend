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

import { FixedAssetTransactionDescriptor } from './fixed-assets-transactions';


export interface FixedAssetsQuery {
  assetKeeperUID: string;
  assetKeeperOrgUnitUID: string;
  status: EntityStatus;
  keywords: string;
  fixedAssetTypeUID: string;
  inventoryNo: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
}


export interface FixedAssetDescriptor {
  uid: string;
  assetKeeperOrgUnitName: string;
  assetKeeperName: string;
  fixedAssetTypeName: string;
  inventoryNo: string;
  name: string;
  locationName: string;
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
  assetKeeperUID: string;
  assetKeeperOrgUnitUID: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
  startDate: DateString;
  endDate: DateString;
}


export interface FixedAssetHolder {
  fixedAsset: FixedAsset;
  transactions: FixedAssetTransactionDescriptor[];
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
  assetKeeperOrgUnit: Identifiable;
  assetKeeper: Identifiable;
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  locationName: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export enum FixedAssetsOperationType {
  excel                = 'excel',
  requestLoan          = 'requestLoan',
  requestMintenance    = 'requestMintenance',
  requestCustodyChange = 'requestCustodyChange ',
  delete               = 'delete',
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
  assetKeeperOrgUnit: Empty,
  assetKeeper: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  locationName: '',
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
    uid: FixedAssetsOperationType.requestLoan,
    name: 'Solicitar préstamo'
  },
  {
    uid: FixedAssetsOperationType.requestMintenance,
    name: 'Solicitar mantenimiento'
  },
  {
    uid: FixedAssetsOperationType.requestCustodyChange,
    name: 'Solicitar cambio de resguardo'
  },
  {
    uid: FixedAssetsOperationType.delete,
    name: 'Dar de baja',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'dará de baja',
    confirmQuestionMessage: 'Doy de baja'
  },
];


export const EmptyFixedAssetsQuery: FixedAssetsQuery = {
  assetKeeperUID: '',
  assetKeeperOrgUnitUID: '',
  status: null,
  keywords: '',
  inventoryNo: '',
  fixedAssetTypeUID: '',
  buildingUID: '',
  floorUID: '',
  placeUID: '',
};
