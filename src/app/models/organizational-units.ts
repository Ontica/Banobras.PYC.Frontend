/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableColumn, DataTableColumnType } from './_data-table';

import { EntityStatus } from './_explorer-data';

import { AccountabilityDescriptor } from './_accountability';

import { mapPartyDescriptorFromParty, PartiesQuery, Party, PartyDescriptor, PartyHolder,
         PartyActions } from './parties';


export interface OrgUnitsQuery extends PartiesQuery {

}


export interface OrgUnitDescriptor extends PartyDescriptor {
  uid: string;
  typeName: string;
  code: string;
  name: string;
  fullName: string;
  parentName: string;
  responsibleName: string;
  startDate: DateString;
  endDate: DateString;
  level: number;
  isLastLevel: boolean;
  obsolete: boolean;
  statusName: string;
}


export interface OrgUnit extends Party {
  uid: string;
  type: Identifiable;
  code: string;
  name: string;
  fullName: string;
  parent: Identifiable;
  responsible: Identifiable;
  startDate: DateString;
  endDate: DateString;
  level: number;
  isLastLevel: boolean;
  obsolete: boolean;
  status: Identifiable<EntityStatus>;
}


export interface OrgUnitActions extends PartyActions {
  canUpdate: boolean;
  canDelete: boolean;
}


export interface OrgUnitHolder extends PartyHolder {
  organizationalUnit: OrgUnit;
  accountabilities: AccountabilityDescriptor[];
  actions: OrgUnitActions;
}


export function mapOrgUnitDescriptorFromOrgUnit(data: OrgUnitHolder): OrgUnitDescriptor {
  return {
    ...mapPartyDescriptorFromParty(data.organizationalUnit),
    code: data.organizationalUnit.code,
    fullName: data.organizationalUnit.fullName,
    responsibleName: data.organizationalUnit.responsible.name,
    parentName: data.organizationalUnit.parent.name,
    level: data.organizationalUnit.level,
    isLastLevel: data.organizationalUnit.isLastLevel,
    startDate: data.organizationalUnit.startDate,
    endDate: data.organizationalUnit.endDate,
    obsolete: data.organizationalUnit.obsolete,
  };
}


export const EmptyOrgUnit: OrgUnit = {
  uid: '',
  type: Empty,
  name: '',
  status: Empty,
  code: '',
  parent: Empty,
  responsible: Empty,
  isLastLevel: false,
  startDate: '',
  endDate: '',
  fullName: '',
  level: null,
  obsolete: false,
}


export const EmptyOrgUnitActions: OrgUnitActions = {
  canUpdate: false,
  canDelete: false,
};


export const EmptyOrgUnitHolder: OrgUnitHolder = {
  organizationalUnit: EmptyOrgUnit,
  accountabilities: [],
  actions: EmptyOrgUnitActions,
}


export const DefaultOrgUnitsColumns: DataTableColumn[] = [
  {
    field: 'code',
    title: 'Código',
    type: DataTableColumnType.text_link,
    size: 'xs',
    showShadow: true,
  },
  {
    field: 'name',
    title: 'Área',
    type: DataTableColumnType.text,
    hasLevel: true,
  },
  {
    field: 'typeName',
    title: 'Tipo de área',
    type: DataTableColumnType.text,
  },
  {
    field: 'responsibleName',
    title: 'Responsable',
    type: DataTableColumnType.text,
  },
  {
    field: 'statusName',
    title: 'Estado',
    type: DataTableColumnType.text_tag,
  },
];
