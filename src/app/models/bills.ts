/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType } from './_data-table';

import { BaseActions, EmptyBaseActions } from './_explorer-data';

import { Document } from './documents';

import { History } from './history';


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


export interface BillFields {

}


export interface BillData {
  bill: Bill;
  concepts: BillConcept[];
  documents: Document[];
  history: History[];
  actions: BaseActions;
}


export interface Bill {
  uid: string;
  billNo: string;
  managedBy: Identifiable;
  category: Identifiable;
  billType: Identifiable;
  issueDate: DateString;
  issuedBy: Identifiable;
  issuedTo: Identifiable;
  currencyCode: string;
  subtotal: number;
  discount: number;
  total: number;
  postedBy: Identifiable;
  postingTime: DateString;
  status: Identifiable;
}


export interface BillConcept {
  uid: string;
  product: Identifiable;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  postedBy: Identifiable;
  postingTime: DateString;
  taxEntries: BillTaxEntry[];
}


export interface BillTaxEntry {
  uid: string;
  taxMethod: Identifiable<BillTaxMethod>;
  taxFactorType: Identifiable<BillTaxFactorType>;
  factor: number;
  baseAmount: number;
  total: number;
  postedBy: Identifiable;
  postingTime: DateString;
  status: Identifiable;
}


export enum BillTaxMethod {
  Traslado = 'Traslado',
  Retencion = 'Retencion'
}


export enum BillTaxFactorType {
  Cuota = 'Cuota',
  Tasa = 'Tasa',
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
  managedBy: Empty,
  category: Empty,
  billType: Empty,
  issueDate: '',
  issuedBy: Empty,
  issuedTo: Empty,
  currencyCode: '',
  subtotal: 0,
  discount: 0,
  total: 0,
  postedBy: Empty,
  postingTime: '',
  status: Empty,
};


export const EmptyBillData: BillData = {
  bill: EmptyBill,
  concepts: [],
  documents: [],
  history: [],
  actions: EmptyBaseActions,
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
    title: 'Emisión',
    type: DataTableColumnType.date,
  },
  {
    field: 'statusName',
    title: 'Estado',
    type: DataTableColumnType.text_tag,
  },
];


export const EmptyBillsDataTable: BillsDataTable = {
  query: EmptyBillsQuery,
  columns: DefaultBillsColumns,
  entries: [],
};
