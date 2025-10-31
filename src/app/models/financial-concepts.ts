/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType } from './_data-table';

import { BaseActions, EmptyBaseActions } from './_explorer-data';

import { StandardAccountDescriptor } from './chart-of-accounts';


export enum FinancialConceptType {
  CASH_FLOW = 'CASH_FLOW',
}


export interface FinancialConceptGroupDescriptor {
  uid: string;
  name: string;
  namedKey: string;
  isReadOnly: boolean;
}


export interface FinancialConceptsQuery {
  groupUID: string;
  date: DateString;
  keywords: string;
}


export interface FinancialConceptDescriptor {
  uid: string;
  number: string;
  name: string;
  fullName: string;
  startDate: DateString;
  endDate: DateString;
  groupName: string;
  statusName: string;
  level: number;
  isLastLevel: boolean;
}


export interface FinancialConceptGroup {
  uid: string;
  name: string;
  concepts: FinancialConceptDescriptor[];
}


export interface FinancialConceptsData extends DataTable {
  query: FinancialConceptsQuery;
  entries: FinancialConceptDescriptor[];
}


export interface FinancialConceptHolder {
  concept: FinancialConcept;
  integration: StandardAccountDescriptor[];
  actions: BaseActions;
}


export interface FinancialConcept {
  uid: string;
  number: string;
  name: string;
  fullName: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  group: Identifiable;
  status: Identifiable;
  level: number;
  isLastLevel: boolean;
}


export const EmptyFinancialConceptGroupDescriptor: FinancialConceptGroupDescriptor = {
  uid: '',
  name: '',
  namedKey: '',
  isReadOnly: true,
}


export const EmptyFinancialConceptsQuery: FinancialConceptsQuery = {
  groupUID: '',
  date: '',
  keywords: '',
};


export const EmptyFinancialConceptDescriptor: FinancialConceptDescriptor = {
  uid: '',
  number: '',
  name: '',
  fullName: '',
  startDate: null,
  endDate: null,
  groupName: '',
  statusName: '',
  level: 0,
  isLastLevel: false,
};


export const EmptyFinancialConcept: FinancialConcept = {
  uid: '',
  number: '',
  name: '',
  fullName: '',
  description: '',
  startDate: '',
  endDate: '',
  group: Empty,
  status: Empty,
  level: 0,
  isLastLevel: false,
};


export const EmptyFinancialConceptHolder: FinancialConceptHolder = {
  concept: EmptyFinancialConcept,
  integration: [],
  actions: EmptyBaseActions,
};


export const DefaultFinancialConceptsColumns: DataTableColumn[] = [
  {
    field: 'number',
    title: 'Código',
    type: DataTableColumnType.text_link,
    size: 'sm',
    showShadow: true,
  },
  {
    field: 'name',
    title: 'Nombre',
    type: DataTableColumnType.text,
    hasLevel: true,
    showTooltip: true,
    tooltipField: 'fullName',
  },
  {
    field: 'startDate',
    title: 'Fecha',
    type: DataTableColumnType.date,
  },
  {
    field: 'statusName',
    title: 'Estado',
    type: DataTableColumnType.text_tag,
  },
];


export const EmptyFinancialConceptsData: FinancialConceptsData = {
  query: EmptyFinancialConceptsQuery,
  columns: DefaultFinancialConceptsColumns,
  entries: [],
};
