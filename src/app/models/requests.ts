/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './_data-table';

import { FormFieldDataType } from './_form-fields';


export enum RequestsList {
  budgeting = 'budgeting',
  payments  = 'payments',
};


export interface RequestQuery {
  requestsList: RequestsList;

  organizationalUnitUID: string;
  requestTypeUID: string;
  requestStatus: string;
  responsibleUID: string;
  fromDate: DateString;
  toDate: DateString;

  requestFields: RequestTypeField[];
}


export interface RequestEntry extends DataTableEntry {
  uid: string;
}


export interface RequestData extends DataTable {
  query: RequestQuery;
  columns: DataTableColumn[];
  entries: RequestEntry[];
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


export interface Request {
  uid: string;
  organizationalUnit: Identifiable;
  requestType: RequestType;
  requestTypeFields: RequestTypeField[];
  files: RequestFile[];
}


export interface RequestFile {

}


export interface RequestFields {
  organizationalUnitUID: string;
  requestTypeUID: string;
  requestTypeFields: RequestTypeField[];
}


export interface RequestTypeField {
  field: string;
  value: string;
}


export const EmptyRequestQuery: RequestQuery = {
  requestsList: null,
  organizationalUnitUID: '',
  requestTypeUID: '',
  requestStatus: '',
  responsibleUID: '',
  fromDate: '',
  toDate: '',
  requestFields: [],
};


export const EmptyRequestData: RequestData = {
  query: EmptyRequestQuery,
  columns: [],
  entries: [],
};


export const EmptyRequestType: RequestType = {
  uid: '',
  name: '',
  inputData: [],
};


export const EmptyRequest: Request = {
  uid: '',
  organizationalUnit: Empty,
  requestType: EmptyRequestType,
  requestTypeFields: [],
  files: [],
}
