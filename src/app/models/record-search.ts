/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableQuery } from './_data-table';


export enum RecordQueryType {
  AccountTotals                       = 'AccountTotals',
  AccountingEntriesByAccount          = 'AccountingEntriesByAccount',
  AccountingEntriesBySubledgerAccount = 'AccountingEntriesBySubledgerAccount',
  CashFlowAccountingEntries           = 'CashFlowAccountingEntries',
  CashFlowEntries                     = 'CashFlowEntries',
  CreditEntries                       = 'CreditEntries',
}


export const RecordQueryTypeList: Identifiable[] = [
  { uid: RecordQueryType.AccountTotals,                       name: 'Conceptos presupuestales' },
  { uid: RecordQueryType.AccountingEntriesBySubledgerAccount, name: 'Movimientos contables por auxiliar' },
  { uid: RecordQueryType.AccountingEntriesByAccount,          name: 'Movimientos contables por cuenta' },
  { uid: RecordQueryType.CashFlowAccountingEntries,           name: 'Movimientos de flujo de efectivo por auxiliar' },
  { uid: RecordQueryType.CashFlowEntries,                     name: 'Movimientos de flujo de efectivo por concepto' },
  { uid: RecordQueryType.CreditEntries,                       name: 'Movimientos del sistema de créditos' },
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
  operationTypeUID: string;
  keywords: string[];
  ledgers: string[];
  parties: string[];
}


export const EmptyRecordSearchQuery: RecordSearchQuery = {
  queryType: RecordQueryType.AccountTotals,
  fromDate: '',
  toDate: '',
  operationTypeUID: '',
  keywords: [],
  ledgers: [],
  parties: [],
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
