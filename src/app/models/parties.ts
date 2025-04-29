/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { EntityStatus, ExplorerOperation, ExplorerOperationType, ExplorerTypeConfig } from './_explorer-data';

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
  code: string;
  typeUID: string;
  typeName: string;
  name: string;
  commonName: string;
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
  party: Party;
  actions: PartyActions;
}


export interface Party {
  uid: string;
  type: Identifiable;
  code: string;
  name: string;
  commonName: string;
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
    field: 'code',
    title: 'Clave',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'name',
    title: 'Nombre',
    type: DataTableColumnType.text,
  },
  {
    field: 'commonName',
    title: 'Nombre común',
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
  code: '',
  name: '',
  commonName: '',
  status: Empty,
}


export const EmptyPartyActions: PartyActions = {
  canUpdate: false,
  canDelete: false,
};


export const EmptyPartyHolder: PartyHolder = {
  party: EmptyParty,
  actions: EmptyPartyActions,
}


export const PartiesOperationsList: ExplorerOperation[] = [
  {
    uid: ExplorerOperationType.excel,
    name: 'Exportar'
  },
  {
    uid: ExplorerOperationType.delete,
    name: 'Eliminar',
    showConfirm: true,
    isConfirmWarning: true,
    confirmOperationMessage: 'eliminará',
    confirmQuestionMessage: 'Elimino'
  },
];


export function mapPartyDescriptorFromParty(party: Party): PartyDescriptor {
  return {
    uid: party.uid,
    typeUID: party.type.uid,
    code: party.code,
    typeName: party.type.name,
    name: party.name,
    commonName: party.commonName,
    statusName: party.status.name,
  };
}
