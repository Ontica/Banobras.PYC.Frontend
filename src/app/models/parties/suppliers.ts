/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';

import { mapPartyDescriptorFromParty, PartiesQuery, Party, PartyActions, PartyDescriptor,
         PartyFields, PartyHolder } from './base-parties';

import { EntityStatus } from '../base/explorer-data';

import { DataTableColumn, DataTableColumnType } from '../base/data-table';

import { Bill } from '../bills';

import { Document } from '../documents';

import { HistoryEntry } from '../history';

import { PaymentAccount } from '../payment-instructions';


export interface SuppliersQuery extends PartiesQuery {

}


export interface SupplierDescriptor extends PartyDescriptor {
  uid: string;
  typeName: string;
  name: string;
  taxCode: string;
  subledgerAccount: string;
  statusName: string;
}


export interface SupplierFields extends PartyFields {
  typeUID: string;
  name: string;
  taxCode: string;
  subledgerAccount: string;
}


export interface MatchSubledgerAccountFields {
  uid: string;
  name: string;
  taxCode: string;
}


export interface SupplierHolder extends PartyHolder {
  supplier: Supplier;
  paymentAccounts: PaymentAccount[];
  bills: Bill[];
  documents: Document[]
  history: HistoryEntry[];
  actions: SupplierActions;
}


export interface Supplier extends Party {
  uid: string;
  type: Identifiable;
  name: string;
  taxCode: string;
  subledgerAccount: string;
  status: Identifiable<EntityStatus>;
}


export interface SupplierActions extends PartyActions {
  canUpdate: boolean;
  canDelete: boolean;
  canEditDocuments: boolean;
}


export const EmptySupplier: Supplier = {
  uid: '',
  type: Empty,
  name: '',
  taxCode: '',
  subledgerAccount: '',
  status: Empty,
}


export function mapSupplierDescriptorFromSupplier(data: SupplierHolder): SupplierDescriptor {
  return {
    ...mapPartyDescriptorFromParty(data.supplier),
    taxCode: data.supplier.taxCode,
    subledgerAccount: data.supplier.subledgerAccount,
  };
}


export const DefaultSuppliersColumns: DataTableColumn[] = [
  {
    field: 'name',
    title: 'Proveedor',
    type: DataTableColumnType.text,
    size: 'lg'
  },
  {
    field: 'taxCode',
    title: 'RFC',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'typeName',
    title: 'Tipo de proveedor',
    type: DataTableColumnType.text,
  },
  {
    field: 'subledgerAccount',
    title: 'Auxiliar',
    type: DataTableColumnType.text,
  },
  {
    field: 'statusName',
    title: 'Estado',
    type: DataTableColumnType.text_tag,
  },
];
