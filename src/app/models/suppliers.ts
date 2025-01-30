/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTableColumn, DataTableColumnType } from './_data-table';

import { mapPartyDescriptorFromParty, PartiesQuery, Party, PartyDescriptor } from './parties';


export interface SuppliersQuery extends PartiesQuery {

}


export interface SupplierDescriptor extends PartyDescriptor {
  taxCode: string;
  taxEntityName: string;
  taxZipCode: string;
}


export interface Supplier extends Party {
  taxCode: string;
  taxEntityName: string;
  taxZipCode: string;
}


export function mapSupplierDescriptorFromSupplier(supplier: Supplier): SupplierDescriptor {
  return {
    ...mapPartyDescriptorFromParty(supplier),
    taxCode: supplier.taxCode,
    taxZipCode: supplier.taxZipCode,
    taxEntityName: supplier.taxEntityName,
  };
}


export const DefaultSuppliersColumns: DataTableColumn[] = [
  {
    field: 'name',
    title: 'Proveedor',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'commonName',
    title: 'Nombre común',
    type: DataTableColumnType.text,
  },
  {
    field: 'typeName',
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
