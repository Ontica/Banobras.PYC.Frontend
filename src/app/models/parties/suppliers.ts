/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTableColumn, DataTableColumnType } from '../base/data-table';

import { mapPartyDescriptorFromParty, PartiesQuery, Party, PartyActions, PartyDescriptor,
         PartyHolder } from './base-parties';

import { Document } from '../documents';

import { HistoryEntry } from '../history';

import { PaymentAccount } from '../payments-orders';


export interface SuppliersQuery extends PartiesQuery {

}


export interface SupplierDescriptor extends PartyDescriptor {
  commonName: string;
  taxCode: string;
  taxEntityName: string;
  taxZipCode: string;
}


export interface Supplier extends Party {
  commonName: string;
  taxCode: string;
  taxEntityName: string;
  taxZipCode: string;
}


export interface SupplierHolder extends PartyHolder {
  supplier: Supplier;
  paymentAccounts: PaymentAccount[];
  documents: Document[]
  history: HistoryEntry[];
  actions: PartyActions;
}


export function mapSupplierDescriptorFromSupplier(data: SupplierHolder): SupplierDescriptor {
  return {
    ...mapPartyDescriptorFromParty(data.supplier),
    commonName: data.supplier.commonName,
    taxCode: data.supplier.taxCode,
    taxZipCode: data.supplier.taxZipCode,
    taxEntityName: data.supplier.taxEntityName,
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
