/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTableColumn, DataTableColumnType } from './_data-table';

import { mapPartyDescriptorFromParty, PartiesQuery, Party, PartyDescriptor } from './parties';


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
  fullName: string;
  responsible: Identifiable;
  level: number;
  isLastLevel: boolean;
  startDate: DateString;
  endDate: DateString;
  obsolete: boolean;
}


export function mapOrgUnitDescriptorFromOrgUnit(data: OrgUnit): OrgUnitDescriptor {
  return {
    ...mapPartyDescriptorFromParty(data),
    fullName: data.fullName,
    responsibleName: data.responsible.name,
    level: data.level,
    isLastLevel: data.isLastLevel,
    startDate: data.startDate,
    endDate: data.endDate,
    obsolete: data.obsolete,
  };
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
