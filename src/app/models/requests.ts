/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataField, InputData } from './_dynamic-form-fields';


export enum RequestsList {
  budgeting = 'budgeting',
  payments  = 'payments',
};


export interface RequestQuery {
  requestsList: RequestsList;
  requesterOrgUnitUID: string;
  keywords: string;
  requestTypeUID: string;
  requestStatus: string;
  fromDate: DateString;
  toDate: DateString;
  requestTypeFields: DataField[];
}


export interface RequestDescriptor {
  uid: string;
  uniqueID: string;
  requestTypeName: string;
  requesterName: string;
  controlID: string;
  requesterOrgUnitName: string;
  responsibleOrgUnitName: string;
  description: string;
  filedByName: string;
  filingTime: DateString;
  status: string;
  notes: string;
}


export interface RequestType extends Identifiable {
  uid: string;
  name: string;
  inputData: InputData[];
};


export enum RequestsOperationType {
  excel = 'excel',
  print = 'print',
  delete = 'delete',
}


export interface RequestsOperation extends Identifiable {
  uid: string;
  name: string;
}


export const RequestsOperationList: RequestsOperation[] = [
  { uid: RequestsOperationType.excel, name: 'Exportar' },
  { uid: RequestsOperationType.print, name: 'Imprimir' },
  { uid: RequestsOperationType.delete, name: 'Eliminar' },
];


export interface RequestsOperationCommand {
  requests: string[];
}


export interface RequestData {
  request: Request;
  tasks: RequestTask[];
  files: RequestFile[];
  workflowHistory: RequestWorkflowHistory[];
  actions: RequestActions;
}


export interface Request {
  uid: string;
  requestType: RequestType;
  uniqueID: string;
  controlID: string;
  requesterName: string;
  description: string;
  notes: string;
  requesterOrgUnit: Identifiable;
  responsibleOrgUnit: Identifiable;
  filedBy: Identifiable;
  filingTime: DateString;
  closedBy: Identifiable;
  closingTime: DateString;
  postedBy: Identifiable;
  postingTime: DateString;
  status: string;
  requestTypeFields: DataField[];
}


export interface RequestTask {
  uid: string;
}


export interface RequestFile {
  uid: string;
}


export interface RequestWorkflowHistory {
  uid: string;
}


export interface RequestActions {
  canUpdate: boolean;
  canStart: boolean;
  canCancel: boolean;
  canSuspend: boolean;
  canActivate: boolean;
  canClose: boolean;
  canDelete: boolean;
}


export interface RequestFields {
  requestTypeUID: string;
  requesterOrgUnitUID: string;
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
  requestTypeName: '',
  uniqueID: '',
  controlID: '',
  requesterName: '',
  description: '',
  notes: '',
  requesterOrgUnitName: '',
  responsibleOrgUnitName: '',
  filedByName: '',
  filingTime: '',
  status: '',
};


export const EmptyRequest: Request = {
  uid: '',
  requestType: EmptyRequestType,
  uniqueID: '',
  controlID: '',
  requesterName: '',
  description: '',
  notes: '',
  requesterOrgUnit: Empty,
  responsibleOrgUnit: Empty,
  filedBy: Empty,
  filingTime: '',
  closedBy: Empty,
  closingTime: '',
  postedBy: Empty,
  postingTime: '',
  status: '',
  requestTypeFields: [],
};


export const EmptyRequestActions: RequestActions = {
  canUpdate: false,
  canStart: false,
  canCancel: false,
  canDelete: false,
  canSuspend: false,
  canActivate: false,
  canClose: false,
};


export const EmptyRequestData: RequestData = {
  request: EmptyRequest,
  tasks: [],
  files: [],
  workflowHistory: [],
  actions: EmptyRequestActions,
};


export function mapRequestDescriptorFromRequest(request: Request): RequestDescriptor {
  return {
    uid: request.uid,
    uniqueID: request.uniqueID,
    requestTypeName: request.requestType.name,
    requesterName: request.requesterName,
    controlID: request.controlID,
    requesterOrgUnitName: request.requesterOrgUnit.name,
    responsibleOrgUnitName: request.responsibleOrgUnit.name,
    description: request.description,
    filedByName: request.filedBy.name,
    filingTime: request.filingTime,
    status: request.status,
    notes: request.notes,
  };
}
