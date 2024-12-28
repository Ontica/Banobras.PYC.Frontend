/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTable, DataTableColumn, DataTableColumnType } from './_data-table';

import { EntityStatus } from './_explorer-data';


export interface SuppliersQuery {
  status: EntityStatus;
  keywords: string;
}


export interface SupplierDescriptor {
  uid: string;
  typeUID: string;
  supplierTypeName: string;
  name: string;
  commonName: string;
  taxCode: string;
  taxEntityName: string;
  taxZipCode: string;
  statusName: string;
}


export interface SuppliersDataTable extends DataTable {
  query: SuppliersQuery;
  entries: SupplierDescriptor[];
}


export const EmptySuppliersQuery: SuppliersQuery = {
  status: null,
  keywords: '',
};


export const DefaultSuppliersColumns: DataTableColumn[] = [
  {
    field: 'name',
    title: 'Proveedor',
    type: DataTableColumnType.text_highlight,
  },
  {
    field: 'commonName',
    title: 'Nombre común',
    type: DataTableColumnType.text,
  },
  {
    field: 'supplierTypeName',
    title: 'Tipo de proveedor',
    type: DataTableColumnType.text,
  },
  {
    field: 'taxCode',
    title: 'RFC',
    type: DataTableColumnType.text,
  },
  {
    field: 'taxEntityName',
    title: 'Razón social',
    type: DataTableColumnType.text,
  },
  {
    field: 'taxZipCode',
    title: 'Código postal',
    type: DataTableColumnType.text,
  },
  {
    field: 'statusName',
    title: 'Estado',
    type: DataTableColumnType.text_tag,
  },
];


export const EmptySuppliersDataTable: SuppliersDataTable = {
  query: EmptySuppliersQuery,
  columns: DefaultSuppliersColumns,
  entries: [],
};
