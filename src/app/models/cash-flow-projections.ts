/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { BaseActions, ExplorerOperation, ExplorerOperationType } from './_explorer-data';

import { HistoryEntry } from './history';

import { TransactionDateType, TransactionPartyType, TransactionStages,
         TransactionStatus } from './transactions';


export const CashFlowProjectionsStagesList: Identifiable<TransactionStages>[] = [
  { uid: TransactionStages.MyInbox,     name: 'Mis proyecciones' },
  { uid: TransactionStages.ControlDesk, name: 'Mesa de control' },
];


export const CashFlowProjectionsOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excelEntries,
    name: 'Exportar movimientos'
  },
];


export interface CashFlowProjectionsQuery {
  stage: TransactionStages;
  status: TransactionStatus;
  keywords: string;
  planUID: string;
  categoryUID: string;
  classificationUID: string;
  sourceUID: string;
  basePartyUID: string;
  baseAccountUID: string;
  baseProjectUID: string;
  projectionsNo: string[];
  entriesKeywords: string;
  tags: string[];
  dateType: TransactionDateType;
  fromDate: DateString;
  toDate: DateString;
  partyType: TransactionPartyType;
  partyUID: string;
}


export interface CashFlowProjectionDescriptor {
  uid: string;
  basePartyName: string;
  planName: string;
  categoryName: string;
  classificationName: string;
  projectionNo: string;
  operationSourceName: string;
  recordedByName: string;
  recordingTime: DateString;
  authorizedByName: string;
  authorizationTime: DateString;
  statusName: string;
  total: number;
}


export interface CashFlowProjection {
  uid: string;
  projectionNo: string;
  plan: Identifiable;
  category: Identifiable;
  classification: Identifiable;
  operationSource: Identifiable;
  baseParty: Identifiable;
  baseProject: Identifiable;
  baseAccount: Identifiable;
  description: string;
  justification: string;
  tags: string[];
  applicationDate: DateString;
  appliedBy: Identifiable;
  recordingTime: DateString;
  recordedBy: Identifiable;
  authorizationTime: DateString;
  authorizedBy: Identifiable;
  requestedTime: DateString;
  requestedBy: Identifiable;
  adjustmentOf: Identifiable;
  status: Identifiable<TransactionStatus>;
  total: number;
}


export interface CashFlowProjectionEntry {
  uid: string;
}


export interface CashFlowProjectionActions extends BaseActions {
  canAuthorize: boolean;
  canClose: boolean;
  canReject: boolean;
  canSendToAuthorization: boolean;
}


export interface CashFlowProjectionHolder {
  projection: CashFlowProjection,
  entries: CashFlowProjectionEntry[];
  documents: Document[];
  history: HistoryEntry[];
  actions: CashFlowProjectionActions;
}


export function mapCashFlowProjectionDescriptorFromProjection(data: CashFlowProjection): CashFlowProjectionDescriptor {
  return {
      uid: data.uid,
      basePartyName: data.baseParty.name,
      planName: data.plan.name,
      categoryName: data.category.name,
      classificationName: data.classification.name,
      projectionNo: data.projectionNo,
      operationSourceName: data.operationSource.name,
      recordedByName: data.recordedBy.name,
      recordingTime: data.recordingTime,
      authorizedByName: data.authorizedBy.name,
      authorizationTime: data.authorizationTime,
      statusName: data.status.name,
      total: data.total,
  };
}


export const EmptyCashFlowProjectionsQuery: CashFlowProjectionsQuery = {
  stage: null,
  status: null,
  keywords: '',
  categoryUID: '',
  planUID: '',
  classificationUID: '',
  sourceUID: '',
  basePartyUID: '',
  baseAccountUID: '',
  baseProjectUID: '',
  projectionsNo: [],
  entriesKeywords: '',
  tags: [],
  dateType: TransactionDateType.Requested,
  fromDate: '',
  toDate: '',
  partyType: TransactionPartyType.RequestedBy,
  partyUID: '',
};


export const EmptyCashFlowProjection: CashFlowProjection = {
  uid: '',
  projectionNo: '',
  plan: Empty,
  category: Empty,
  classification: Empty,
  operationSource: Empty,
  baseParty: Empty,
  baseProject: Empty,
  baseAccount: Empty,
  description: '',
  justification: '',
  tags: [],
  applicationDate: '',
  appliedBy: Empty,
  recordingTime: '',
  recordedBy: Empty,
  authorizationTime: '',
  authorizedBy: Empty,
  requestedTime: '',
  requestedBy: Empty,
  adjustmentOf: Empty,
  total: null,
  status: Empty,
}


export const EmptyCashFlowProjectionActions: CashFlowProjectionActions = {
  canUpdate: false,
  canDelete: false,
  canSendToAuthorization: false,
  canAuthorize: false,
  canReject: false,
  canClose: false,
  canEditDocuments: false,
}


export const EmptyCashFlowProjectionHolder: CashFlowProjectionHolder = {
  projection: EmptyCashFlowProjection,
  entries: [],
  documents: [],
  history: [],
  actions: EmptyCashFlowProjectionActions,
};
