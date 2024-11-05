/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataField, InputData } from './_dynamic-form-fields';

import { ExplorerOperation } from './_explorer-data';

import { EmptyWorkflowActions, WorkflowActions, WorkflowHistory, WorkflowInstance } from './workflows';

import { Document } from './documents';

import { Step } from './steps';


export enum RequestsList {
  budgeting = 'budgeting',
  payments  = 'payments',
  contracts = 'contracts',
};


export interface RequestQuery {
  requestsList: RequestsList;
  requesterOrgUnitUID: string;
  requestTypeUID: string;
  keywords: string;
  requestStatus: string;
  fromDate: DateString;
  toDate: DateString;
  requestTypeFields: DataField[];
}


export interface RequestDescriptor {
  uid: string;
  requestNo: string;
  name: string;
  internalControlNo: string;
  description: string;
  requestedBy: string;
  requestedByOrgUnit: string;
  responsibleOrgUnit: string;
  priority: string;
  dueTime: DateString;
  startedBy: string;
  startTime: DateString;
  endTime: DateString;
  status: string;
}


export interface RequestType extends Identifiable {
  uid: string;
  name: string;
  inputData: InputData[];
};


export enum RequestsOperationType {
  excel  = 'excel',
  print  = 'print',
  delete = 'delete',
}


export const RequestsOperationList: ExplorerOperation[] = [
  {
    uid: RequestsOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: RequestsOperationType.print,
    name: 'Imprimir',
    showConfirm: true,
    confirmOperationMessage: 'imprimirá',
    confirmQuestionMessage: 'Imprimo'
  },
  {
    uid: RequestsOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export interface RequestData {
  request: Request;
  steps: Step[];
  documents: Document[];
  history: WorkflowHistory[];
  workflowInstances: WorkflowInstance[];
}


export interface Request {
  uid: string;
  requestNo: string;
  internalControlNo: string;
  name: string;
  description: string;
  requestedBy: Identifiable;
  requestedByOrgUnit: Identifiable;
  responsibleOrgUnit: Identifiable;
  priority: Identifiable;
  dueTime: DateString;
  startedBy: Identifiable;
  startTime: DateString;
  endTime: DateString;
  status: string;
  fields: DataField[];
  actions: WorkflowActions;
  requestType: RequestType;
}


export interface RequestFields {
  requestTypeUID: string;
  requesterOrgUnitUID: string;
  description: string;
  requestTypeFields: DataField[];
}


export const EmptyRequestQuery: RequestQuery = {
  requestsList: null,
  requesterOrgUnitUID: '',
  keywords: '',
  requestTypeUID: '',
  requestStatus: '',
  fromDate: '',
  toDate: '',
  requestTypeFields: [],
};


export const EmptyRequestType: RequestType = {
  uid: '',
  name: '',
  inputData: [],
};


export const EmptyRequestDescriptor: RequestDescriptor = {
  uid: '',
  requestNo: '',
  name: '',
  internalControlNo: '',
  description: '',
  requestedBy: '',
  requestedByOrgUnit: '',
  responsibleOrgUnit: '',
  priority: '',
  dueTime: '',
  startedBy: '',
  startTime: '',
  endTime: '',
  status: '',
};


export const EmptyRequest: Request = {
  uid: '',
  requestNo: '',
  internalControlNo: '',
  name: '',
  description: '',
  requestedBy: Empty,
  requestedByOrgUnit: Empty,
  responsibleOrgUnit: Empty,
  priority: Empty,
  dueTime: '',
  startedBy: Empty,
  startTime: '',
  endTime: '',
  status: '',
  fields: [],
  actions: EmptyWorkflowActions,
  requestType: EmptyRequestType,
};


export const EmptyRequestData: RequestData = {
  request: EmptyRequest,
  steps: [],
  documents: [],
  history: [],
  workflowInstances: [],
};


export function mapRequestDescriptorFromRequest(request: Request): RequestDescriptor {
  return {
    uid: request.uid,
    requestNo: request.requestNo,
    name: request.requestType.name,
    internalControlNo: request.internalControlNo,
    description: request.description,
    requestedBy: request.requestedBy.name,
    requestedByOrgUnit: request.requestedByOrgUnit.name,
    responsibleOrgUnit: request.responsibleOrgUnit.name,
    priority: request.priority.name,
    dueTime: request.dueTime,
    startedBy: request.startedBy.name,
    startTime: request.startTime,
    endTime: request.endTime,
    status: request.status,
  };
}
