/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable, isEmpty } from '@app/core';

import { BaseActions, EmptyBaseActions, EntityStatus } from './_explorer-data';

import { AssetsTransactionDescriptor } from './assets-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';


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
  managerUID: string;
  managerOrgUnitUID: string;
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
  currentCondition: string;
  inUseName: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface AssetFields {
  assetTypeUID: string;
  assetNo: string;
  currentCondition: string;
  inUse: string;
  startDate: DateString;
  endDate: DateString;
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  name: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
  brand: string;
  model: string;
  serialNo: string;
  acquisitionDate: DateString;
  invoiceNo: string;
  accountingTag: string;
  historicalValue: number;
  supplierName: string;
  identificators: string[];
  tags: string[];
  description: string;
}


export interface AssetHolder {
  asset: Asset;
  transactions: AssetsTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
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
  assignedTo: Identifiable;
  assignedToOrgUnit: Identifiable;
  manager: Identifiable;
  managerOrgUnit: Identifiable;
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  locationName: string;
  currentCondition: string;
  brand: string;
  model: string;
  serialNo: string;
  acquisitionDate: DateString;
  invoiceNo: string;
  accountingTag: string;
  supplierName: string;
  historicalValue: number;
  inUse: Identifiable;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
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
  assignedToOrgUnit: Empty,
  assignedTo: Empty,
  manager: Empty,
  managerOrgUnit: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  locationName: '',
  currentCondition: '',
  brand: '',
  model: '',
  serialNo: '',
  acquisitionDate: '',
  invoiceNo: '',
  accountingTag: '',
  supplierName: '',
  historicalValue: null,
  inUse: Empty,
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
  managerUID: '',
  managerOrgUnitUID: '',
};
