/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './_data-table';


export enum CashFlowReportTypes {
  CashFlow        = 'CashFlow',
  ConceptDetail   = 'ConceptDetail',
  AccountTotals   = 'AccountTotals',
  ConceptTotals   = 'ConceptTotals',
  ProjectTotals   = 'ProjectTotals',
  ConceptAnalytic = 'ConceptAnalytic',
}


export const CashFlowReportTypesList: Identifiable<CashFlowReportTypes>[] = [
  {uid: CashFlowReportTypes.CashFlow,        name: 'Flujo de efectivo'},
  {uid: CashFlowReportTypes.ConceptDetail,   name: 'Detalle a nivel de concepto'},
  {uid: CashFlowReportTypes.AccountTotals,   name: 'Totales por cuenta'},
  {uid: CashFlowReportTypes.ConceptTotals,   name: 'Totales por concepto'},
  {uid: CashFlowReportTypes.ProjectTotals,   name: 'Totales por proyecto'},
  {uid: CashFlowReportTypes.ConceptAnalytic, name: 'Analítico por concepto de movimientos'},
];


export interface CashFlowQuery {
  reportType: CashFlowReportTypes;
  fromAccountingDate: DateString;
  toAccountingDate: DateString;
  accountingLedgerUID: string;
  partyUID: string;
  projectTypeUID: string;
  projectUID: string;
  financialAccountUID: string;
  operationTypeUID: string;
  financingSourceUID: string;
  programUID: string;
  subprogramUID: string;
}


export interface CashFlowData extends DataTable {
  query: CashFlowQuery;
  columns: DataTableColumn[];
  entries: CashFlowEntryDescriptor[];
}


export interface CashFlowEntryDescriptor extends DataTableEntry {
  uid: string;
}


export const EmptyCashFlowQuery: CashFlowQuery = {
  reportType: CashFlowReportTypes.CashFlow,
  fromAccountingDate: '',
  toAccountingDate: '',
  accountingLedgerUID: '',
  partyUID: '',
  projectTypeUID: '',
  projectUID: '',
  financialAccountUID: '',
  operationTypeUID: '',
  programUID: '',
  subprogramUID: '',
  financingSourceUID: '',
};


export const EmptyCashFlowData: CashFlowData = {
  query: EmptyCashFlowQuery,
  columns: [],
  entries: [],
};
