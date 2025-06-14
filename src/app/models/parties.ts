/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { EntityStatus, ExplorerTypeConfig } from './_explorer-data';

import { DataTable, DataTableColumn, DataTableColumnType } from './_data-table';


export const EmptyPartyExplorerTypeConfig: ExplorerTypeConfig<PartyObjectTypes> = {
  type: null,
  nameSingular: 'parte',
  namePlural: 'partes',
  pronounSingular: 'la',
  pronounPlural: 'Las',
  selectionMessage: 'seleccionadas',
  permissionToCreate: null,
}


export enum PartyObjectTypes {
  SUPPLIER             = 'ObjectType.Party.Supplier',
  ORGANIZATIONAL_UNITS = 'ObjectType.Party.OrganizationalUnits',
}


export function getPartyExplorerTypeConfig(type: PartyObjectTypes): ExplorerTypeConfig<PartyObjectTypes> {
  switch (type) {
    case PartyObjectTypes.SUPPLIER:
      return {
        type,
        nameSingular: 'proveedor',
        namePlural: 'proveedores',
        pronounSingular: 'el',
        pronounPlural: 'los',
        selectionMessage: 'seleccionados',
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    case PartyObjectTypes.ORGANIZATIONAL_UNITS:
      return {
        type,
        nameSingular: 'Área',
        namePlural: 'Áreas',
        pronounSingular: 'la',
        pronounPlural: 'las',
        selectionMessage: 'seleccionadas',
        permissionToCreate: PERMISSIONS.NOT_REQUIRED,
      };
    default: return EmptyPartyExplorerTypeConfig;
  }
}


export interface PartiesQuery {
  typeUID: PartyObjectTypes;
  status: EntityStatus;
  keywords: string;
}


export interface PartyDescriptor {
  uid: string;
  typeUID: string;
  typeName: string;
  name: string;
  statusName: string;
}


export interface PartiesDataTable extends DataTable {
  query: PartiesQuery;
  entries: PartyDescriptor[];
}


export interface PartyFields {
  typeUID: string;
}


export interface PartyHolder {
  party?: Party;
  actions: PartyActions;
}


export interface Party {
  uid: string;
  type: Identifiable;
  name: string;
  status: Identifiable<EntityStatus>;
}


export interface PartyActions {
  canUpdate: boolean;
  canDelete: boolean;
}


export const EmptyPartiesQuery: PartiesQuery = {
  typeUID: null,
  keywords: '',
  status: null,
}


export const DefaultPartiesColumns: DataTableColumn[] = [
  {
    field: 'name',
    title: 'Nombre',
    type: DataTableColumnType.text,
  },
  {
    field: 'typeName',
    title: 'Tipo',
    type: DataTableColumnType.text,
  },
  {
    field: 'statusName',
    title: 'Estado',
    type: DataTableColumnType.text_tag,
  },
];


export const EmptyPartiesDataTable: PartiesDataTable = {
  query: EmptyPartiesQuery,
  columns: DefaultPartiesColumns,
  entries: [],
};


export const EmptyParty: Party = {
  uid: '',
  type: Empty,
  name: '',
  status: Empty,
}


export const EmptyPartyActions: PartyActions = {
  canUpdate: false,
  canDelete: false,
};


export const EmptyPartyHolder: PartyHolder = {
  actions: EmptyPartyActions,
}


export function mapPartyDescriptorFromParty(party: Party): PartyDescriptor {
  return {
    uid: party.uid,
    typeUID: party.type.uid,
    typeName: party.type.name,
    name: party.name,
    statusName: party.status.name,
  };
}
