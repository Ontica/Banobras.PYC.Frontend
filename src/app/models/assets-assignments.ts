/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { EntityStatus, ExplorerOperation } from './_explorer-data';

import { AssetsOperationsList } from './assets';

import { AssetsTransaction, AssetsTransactionDescriptor, AssetsTransactionEntry,
         EmptyAssetsTransaction } from './assets-transactions';

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
  managerUID: string;
  managerOrgUnitUID: string;
  tags: string[];
  keywords: string;
  status: EntityStatus;
}


export interface AssetsAssignmentDescriptor {
  uid: string;
  assignedToName: string;
  assignedToOrgUnitName: string;
  releasedByName: string;
  releasedByOrgUnitName: string;
  locationName: string;
  lastAssignmentTransactionUID: string;
  lastAssignmentTransactionNo: string;
  lastAssignmentApplicationDate: DateString;
  statusName: string;
}


export interface AssetsAssignmentFields {
  assignedToUID: string;
  assignedToOrgUnitUID: string;
  locationUID: string;
}


export interface AssetsAssignmentHolder {
  assignment: AssetsAssignment;
  entries: AssetsTransactionEntry[];
  transactions: AssetsTransactionDescriptor[];
  documents: Document[];
  history: HistoryEntry[];
  actions: AssetsAssignmentActions;
}


export interface AssetsAssignment {
  uid: string;
  assignedTo: Identifiable;
  assignedToOrgUnit: Identifiable;
  releasedBy: Identifiable;
  releasedByOrgUnit: Identifiable;
  building: Identifiable;
  floor: Identifiable;
  place: Identifiable;
  locationName: string;
  lastAssignmentTransaction: AssetsTransaction;
  status: Identifiable;
}


export interface AssetsAssignmentActions {
  canUpdate: boolean;
  canDelete: boolean;
  canClone: boolean;
  canEditDocuments: boolean;
}


export const EmptyAssetsAssignment: AssetsAssignment = {
  uid: '',
  assignedTo: Empty,
  assignedToOrgUnit: Empty,
  releasedBy: Empty,
  releasedByOrgUnit: Empty,
  building: Empty,
  floor: Empty,
  place: Empty,
  locationName: '',
  lastAssignmentTransaction: EmptyAssetsTransaction,
  status: Empty,
};


export const EmptyAssetsAssignmentActions: AssetsAssignmentActions = {
  canUpdate: false,
  canDelete: false,
  canClone: false,
  canEditDocuments: false,
}


export const EmptyAssetsAssignmentHolder: AssetsAssignmentHolder = {
  assignment: EmptyAssetsAssignment,
  entries: [],
  transactions: [],
  documents: [],
  history: [],
  actions: EmptyAssetsAssignmentActions,
};


export const AssetsAssignmentsOperationsList: ExplorerOperation[] = [...AssetsOperationsList];


export const EmptyAssetsAssignmentsQuery: AssetsAssignmentsQuery = {
  assignedToUID: '',
  assignedToOrgUnitUID: '',
  assetTypeUID: '',
  assetNo: '',
  buildingUID: '',
  floorUID: '',
  placeUID: '',
  managerUID: '',
  managerOrgUnitUID: '',
  tags: [],
  status: null,
  keywords: '',
};
