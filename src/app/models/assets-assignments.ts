/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, EmptyBaseActions, EntityStatus, ExplorerOperation,
         ExplorerOperationType } from './_explorer-data';

import { DataTable, DataTableColumn, DataTableColumnType } from './_data-table';

import { AssetDescriptor } from './assets';

import { AssetTransactionDescriptor } from './assets-transactions';

import { Document } from './documents';

import { HistoryEntry } from './history';


export interface AssetsAssignmentsQuery {
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  assetTypeUID: string;
  assetNo: string;
  buildingUID: string;
  floorUID: string;
  placeUID: string;
  tags: string[];
  keywords: string;
  status: EntityStatus;
}


export interface AssetsAssignmentDescriptor {
  uid: string;
  assignedToName: string;
  assignedToOrgUnitName: string;
  locationName: string;
  statusName: string;
}


export interface AssetsAssignmentFields {
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  locationUID: string;
}


export interface AssetsAssignmentHolder {
  assignment: AssetsAssignment;
  assets: AssetDescriptor[];
  transactions: AssetTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: BaseActions;
}


export interface AssetsAssignment {
  uid: string;
  assignedTo: Identifiable;
  assignedToOrgUnit: Identifiable;
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  locationName: string;
  status: Identifiable;
}


export const EmptyAssetsAssignment: AssetsAssignment = {
  uid: '',
  assignedTo: Empty,
  assignedToOrgUnit: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  locationName: '',
  status: Empty,
};


export const EmptyAssetsAssignmentHolder: AssetsAssignmentHolder = {
  assignment: EmptyAssetsAssignment,
  assets: [],
  transactions: [],
  documents: [],
  history: [],
  actions: EmptyBaseActions,
};


export const AssetsAssignmentsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.pdf,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: ExplorerOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export const EmptyAssetsAssignmentsQuery: AssetsAssignmentsQuery = {
  assignedToUID: '',
  assignedToOrgUnitUID: '',
  assetTypeUID: '',
  assetNo: '',
  buildingUID: '',
  floorUID: '',
  placeUID: '',
  tags: [],
  status: null,
  keywords: '',
};
