/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './_data-table';


export enum CashFlowReportTypes {
  ConceptDetail   = 'ConceptDetail',
  ConceptAnalytic = 'ConceptAnalytic',
}


export const CashFlowReportTypesList: Identifiable<CashFlowReportTypes>[] = [
  { uid: CashFlowReportTypes.ConceptDetail,   name: 'Detalle a nivel de concepto'},
  { uid: CashFlowReportTypes.ConceptAnalytic, name: 'Analítico por concepto de movimientos'},
];


export interface CashFlowReportQuery {
  reportType: CashFlowReportTypes;
  fromDate: DateString;
  toDate: DateString;
  keywords: string[];
  operationTypeUID: string;
  accountingLedgerUID: string;
  accounts: string[];
  subledgerAccounts: string[];
}


export interface CashFlowReport extends DataTable {
  query: CashFlowReportQuery;
  columns: DataTableColumn[];
  entries: CashFlowReportEntry[];
}


export interface CashFlowReportEntry extends DataTableEntry {
  uid: string;
}


export const EmptyCashFlowReportQuery: CashFlowReportQuery = {
  reportType: CashFlowReportTypes.ConceptDetail,
  fromDate: '',
  toDate: '',
  keywords: [],
  accountingLedgerUID: '',
  accounts: [],
  subledgerAccounts: [],
  operationTypeUID: '',
};


export const EmptyCashFlowReport: CashFlowReport = {
  query: EmptyCashFlowReportQuery,
  columns: [],
  entries: [],
};
