/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { PERMISSIONS } from '@app/data';

import { DataTable, DataTableColumn, DataTableQuery } from './base/data-table';


export enum RecordQueryType {
  AccountTotals             = 'AccountTotals',
  CashFlowAccountingEntries = 'CashFlowAccountingEntries',
  CreditEntries             = 'CreditEntries',
  verificationNumbers       = 'VerificationNumbers',
}


export const RecordQueryTypeList: RecordSearchType[] = [
  {
    uid: RecordQueryType.AccountTotals,
    name: 'Conceptos presupuestales',
    permission: PERMISSIONS.TOOL_CONCEPTOS_PRESUPUESTALES,
  },
  {
    uid: RecordQueryType.CashFlowAccountingEntries,
    name: 'Movimientos de flujo de efectivo por auxiliar',
    permission: PERMISSIONS.TOOL_MOVIMIENTOS_FLUJO_EFECTIVO_POR_AUXILIAR,
  },
  {
    uid: RecordQueryType.CreditEntries,
    name: 'Movimientos del sistema de créditos',
    permission: PERMISSIONS.TOOL_MOVIMIENTOS_SISTEMA_CREDITOS,
  },
  {
    uid: RecordQueryType.verificationNumbers,
    name: 'Números de verificación',
    permission: PERMISSIONS.TOOL_NUMEROS_VERIFICACION,
  },
];


export interface RecordSearchType extends Identifiable {
  uid: string;
  name: string;
  permission: PERMISSIONS;
}


export interface RecordSearchData extends DataTable {
  query: RecordSearchQuery;
  columns: DataTableColumn[];
  entries: RecordSearchResult[];
  queryExecuted?: boolean;
  queryType?: Identifiable;
}


export interface RecordSearchQuery extends DataTableQuery {
  queryType: RecordQueryType;
  classificationUID: string;
  budgetTypeUID: string;
  operationTypeUID: string;
  partyUID: string;
  fromDate: DateString;
  toDate: DateString;
  keywords: string[];
}


export const EmptyRecordSearchQuery: RecordSearchQuery = {
  queryType: null,
  fromDate: '',
  toDate: '',
  classificationUID: '',
  operationTypeUID: '',
  budgetTypeUID: '',
  keywords: [],
  partyUID: '',
};


export interface RecordSearchResult {
  uid: string;
  name: string;
}


export const EmptyRecordSearchResult: RecordSearchResult = {
  uid: '',
  name: '',
}


export const EmptyRecordSearchData: RecordSearchData = {
  query: EmptyRecordSearchQuery,
  columns: [],
  entries: [],
  queryExecuted: false,
  queryType: Empty,
}


export interface Record {
  uid: string;
}
