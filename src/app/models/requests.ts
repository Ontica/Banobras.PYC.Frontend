/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { FormFieldDataType } from './_form-fields';


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
  requestTypeFields: RequestTypeField[];
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
  inputData: RequestInputData[];
};


export interface RequestInputData {
  label: string;
  field: string;
  dataType: FormFieldDataType;
  values: Identifiable[];
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

  requestTypeFields: RequestTypeField[];
  files: RequestFile[];
}


export interface RequestFile {

}


export interface RequestFields {
  requestTypeUID: string;
  requesterOrgUnitUID: string;
  requestTypeFields: RequestTypeField[];
}


export interface RequestTypeField {
  field: string;
  value: string;
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
}


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
  files: [],
}
