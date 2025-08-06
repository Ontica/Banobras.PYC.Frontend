/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { DateRange, EmptyDateRange } from './reporting';


export enum RecordSearchType {
  Budget     = 'Budget',
  Accounting = 'Accounting',
  CashFlow   = 'CashFlow',
  Credit     = 'Credit',
}


export const RecordSearchTypeList: Identifiable[] = [
  { uid: RecordSearchType.Budget,     name: 'Conceptos presupuestales' },
  { uid: RecordSearchType.Accounting, name: 'Movimientos contables' },
  { uid: RecordSearchType.CashFlow,   name: 'Movimientos de flujo de efectivo' },
  { uid: RecordSearchType.Credit,     name: 'Movimientos del sistema de créditos' },
];


export interface RecordSearchData {
  queryExecuted: boolean;
  recordSearchQuery: RecordSearchQuery;
  records: RecordSearchResult[];
}


export interface RecordSearchQuery {
  type: RecordSearchType;
  datePeriod: DateRange;
  keywords: string;
}


export const EmptyRecordSearchQuery: RecordSearchQuery = {
  type: RecordSearchType.Budget,
  datePeriod: EmptyDateRange,
  keywords: '',
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
  queryExecuted: false,
  recordSearchQuery: EmptyRecordSearchQuery,
  records: [],
}


export interface Record {
  uid: string;
}
