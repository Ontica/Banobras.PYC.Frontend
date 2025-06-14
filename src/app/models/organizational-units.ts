/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableColumn, DataTableColumnType } from './_data-table';

import { PartiesQuery, Party, EmptyPartyActions, PartyDescriptor, PartyHolder, PartyActions } from './parties';


export interface OrgUnitsQuery extends PartiesQuery {

}


export interface OrgUnitDescriptor extends PartyDescriptor {

  fullName: string;
  responsibleName: string;
  level: number;
  isLastLevel: boolean;
  startDate: DateString;
  endDate: DateString;
  obsolete: boolean;
}


export interface OrgUnit extends Party {
  code: string;
  responsible: Identifiable;
  isLastLevel: boolean;
  startDate: DateString;
  endDate: DateString;
}


export interface OrgUnitHolder extends PartyHolder {
  organizationalUnit: OrgUnit;
  accountabilities: AccountabilityDescriptor[];
  actions: PartyActions;
}


export interface AccountabilityDescriptor {
  uid: string;
  responsibleName: string;
  roleName: string;
  commissionerName: string;
  startDate: DateString;
  endDate: DateString;
}


export const EmptyOrgUnit: OrgUnit = {
  uid: '',
  type: Empty,
  name: '',
  status: Empty,
  code: '',
  responsible: Empty,
  isLastLevel: false,
  startDate: '',
  endDate: '',
}


export const EmptyOrgUnitHolder: OrgUnitHolder = {
  organizationalUnit: EmptyOrgUnit,
  accountabilities: [],
  actions: EmptyPartyActions,
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
