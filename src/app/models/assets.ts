/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable, isEmpty } from '@app/core';

import { BaseActions, EmptyBaseActions, EntityStatus, ExplorerOperation } from './_explorer-data';

import { Document } from './documents';

import { History } from './history';

import { AssetTransactionDescriptor } from './assets-transactions';


export interface AssetsQuery {
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  status: EntityStatus;
  keywords: string;
  assetTypeUID: string;
  assetNo: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
}


export interface AssetDescriptor {
  uid: string;
  assetNo: string;
  assetTypeName: string;
  name: string;
  description: string;
  assignedToName: string;
  assignedToOrgUnitName: string;
  locationName: string;
  condition: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface AssetFields {
  assetTypeUID: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
  startDate: DateString;
  endDate: DateString;
}


export interface AssetHolder {
  asset: Asset;
  transactions: AssetTransactionDescriptor[];
  documents: Document[];
  history: History[];
  actions: BaseActions;
}


export interface Asset {
  uid: string;
  assetType: Identifiable;
  assetNo: string;
  name: string;
  description: string;
  identificators: string[];
  tags: string[];
  brand: string;
  model: string;
  year: number;
  assignedTo: Identifiable;
  assignedToOrgUnit: Identifiable;
  manager: Identifiable;
  managerOrgUnit: Identifiable;
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  locationName: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export enum AssetsOperationType {
  excel                = 'excel',
  requestLoan          = 'requestLoan',
  requestMintenance    = 'requestMintenance',
  requestCustodyChange = 'requestCustodyChange ',
  delete               = 'delete',
}


export interface LocationSelection {
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
}


export const EmptyLocationSelection: LocationSelection = {
  building: null,
  floor: null,
  place: null,
};


export function buildLocationSelection(building: Identifiable,
                                       floor: Identifiable,
                                       place: Identifiable): LocationSelection {
  const data: LocationSelection = {
    building: isEmpty(building) ? null : building,
    floor: isEmpty(floor) ? null : floor,
    place: isEmpty(place) ? null : place,
  };

  return data;
}


export const EmptyAsset: Asset = {
  uid: '',
  assetType: Empty,
  assetNo: '',
  name: '',
  description: '',
  identificators: [],
  tags: [],
  brand: '',
  model: '',
  year: null,
  assignedToOrgUnit: Empty,
  assignedTo: Empty,
  manager: Empty,
  managerOrgUnit: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  locationName: '',
  startDate: '',
  endDate: '',
  status: Empty,
};


export const EmptyAssetHolder: AssetHolder = {
  asset: EmptyAsset,
  transactions: [],
  documents: [],
  history: [],
  actions: EmptyBaseActions,
};


export const AssetsOperationsList: ExplorerOperation[] = [
  {
    uid: AssetsOperationType.requestLoan,
    name: 'Solicitar préstamo'
  },
  {
    uid: AssetsOperationType.requestMintenance,
    name: 'Solicitar mantenimiento'
  },
  {
    uid: AssetsOperationType.requestCustodyChange,
    name: 'Solicitar cambio de resguardo'
  },
  {
    uid: AssetsOperationType.delete,
    name: 'Dar de baja',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'dará de baja',
    confirmQuestionMessage: 'Doy de baja'
  },
];


export const EmptyAssetsQuery: AssetsQuery = {
  assignedToUID: '',
  assignedToOrgUnitUID: '',
  status: null,
  keywords: '',
  assetNo: '',
  assetTypeUID: '',
  buildingUID: '',
  floorUID: '',
  placeUID: '',
};
