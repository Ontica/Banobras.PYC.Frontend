/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType } from './_data-table';

import { Document } from './documents';

import { WorkflowHistory } from './workflows';


export enum BillsStatus {
  Pending   = 'Pending',
  Validated = 'Validated',
  Issued    = 'Issued',
  Payed     = 'Payed',
  Canceled  = 'Canceled',
  Deleted   = 'Deleted',
}


export const BillsStatusList: Identifiable<BillsStatus>[] = [
  { uid: BillsStatus.Pending,   name: 'Pendiente' },
  { uid: BillsStatus.Validated, name: 'Validada' },
  { uid: BillsStatus.Issued,    name: 'Emitida' },
  { uid: BillsStatus.Payed,     name: 'Pagada' },
  { uid: BillsStatus.Canceled,  name: 'Cancelada' },
  { uid: BillsStatus.Deleted,   name: 'Eliminada' },
];


export enum BillQueryDateType {
  Emission     = 'Emission',
  Payment      = 'Payment',
  Recording    = 'Recording',
  Verification = 'Verification',
  Cancelation  = 'Cancelation',
}


export const BillQueryDateTypesList: Identifiable<BillQueryDateType>[] = [
  { uid: BillQueryDateType.Emission,     name: 'Fecha de emisión' },
  { uid: BillQueryDateType.Payment,      name: 'Fecha de pago' },
  { uid: BillQueryDateType.Recording,    name: 'Fecha de registro' },
  { uid: BillQueryDateType.Verification, name: 'Fecha de verificación' },
  { uid: BillQueryDateType.Cancelation,  name: 'Fecha de cancelación' },
];


export interface BillsQuery {
  managedByUID: string;
  status: BillsStatus;
  billTypeUID: string;
  billCategoryUID: string;
  keywords: string;
  conceptsKeywords: string;
  tags: string[];
  billDateType: BillQueryDateType;
  fromDate: DateString;
  toDate: DateString;
}


export interface BillsDataTable extends DataTable {
  query: BillsQuery;
  entries: BillDescriptor[];
}


export interface BillDescriptor {
  uid: string;
  billNo: string;
  issuedByName: string;
  issuedToName: string;
  categoryName: string;
  billTypeName: string;
  total: number;
  issueDate: DateString;
  statusName: string;
}


export interface BillData {
  bill: Bill;
  concepts: BillConcept[];
  documents: Document[];
  history: WorkflowHistory[];
}


export interface Bill {
  uid: string;
  billNo: string;
  issuedBy: Identifiable;
  issuedTo: Identifiable;
  category: Identifiable;
  billType: Identifiable;
  total: number;
  issueDate: DateString;
  status: Identifiable;
}


export interface BillConcept {

}


export const EmptyBillsQuery: BillsQuery = {
  billTypeUID: '',
  billCategoryUID: '',
  managedByUID: '',
  keywords: '',
  conceptsKeywords: '',
  tags: [],
  billDateType: null,
  fromDate: '',
  toDate: '',
  status: null,
};


export const EmptyBill: Bill = {
  uid: '',
  billNo: '',
  billType: Empty,
  issuedBy: Empty,
  issuedTo: Empty,
  category: Empty,
  total: null,
  issueDate: '',
  status: null,
};


export const EmptyBillData: BillData = {
  bill: EmptyBill,
  concepts: [],
  documents: [],
  history: [],
};


export const DefaultBillsColumns: DataTableColumn[] = [
  {
    field: 'billNo',
    title: 'No. factura',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'categoryName',
    title: 'Categoría',
    type: DataTableColumnType.text,
  },
  {
    field: 'billTypeName',
    title: 'Tipo de factura',
    type: DataTableColumnType.text,
  },
  {
    field: 'issuedByName',
    title: 'Emisor',
    type: DataTableColumnType.text,
  },
  {
    field: 'issuedToName',
    title: 'Receptor',
    type: DataTableColumnType.text,
  },
  {
    field: 'total',
    title: 'Total',
    type: DataTableColumnType.decimal,
  },
  {
    field: 'issueDate',
    title: 'Fecha de emisión',
    type: DataTableColumnType.date,
  },
  {
    field: 'statusName',
    title: 'Estatus',
    type: DataTableColumnType.text_tag,
  },
];


export const EmptyBillsDataTable: BillsDataTable = {
  query: EmptyBillsQuery,
  columns: DefaultBillsColumns,
  entries: [],
};
