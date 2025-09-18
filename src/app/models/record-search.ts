/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableQuery } from './_data-table';


export enum RecordQueryType {
  AccountTotals     = 'AccountTotals',
  AccountingEntries = 'AccountingEntries',
  CashFlowEntries   = 'CashFlowEntries',
  CreditEntries     = 'CreditEntries',
}


export const RecordQueryTypeList: Identifiable[] = [
  { uid: RecordQueryType.AccountTotals,     name: 'Conceptos presupuestales' },
  { uid: RecordQueryType.AccountingEntries, name: 'Movimientos contables' },
  { uid: RecordQueryType.CashFlowEntries,   name: 'Movimientos de flujo de efectivo' },
  { uid: RecordQueryType.CreditEntries,     name: 'Movimientos del sistema de créditos' },
];


export interface RecordSearchData extends DataTable {
  query: RecordSearchQuery;
  columns: DataTableColumn[];
  entries: RecordSearchResult[];
  queryExecuted?: boolean;
  queryType?: Identifiable;
}


export interface RecordSearchQuery extends DataTableQuery {
  queryType: RecordQueryType;
  fromDate: DateString;
  toDate: DateString;
  accounts: string[];
  ledgers: string[];
}


export const EmptyRecordSearchQuery: RecordSearchQuery = {
  queryType: RecordQueryType.AccountTotals,
  fromDate: '',
  toDate: '',
  accounts: [],
  ledgers: [],
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
