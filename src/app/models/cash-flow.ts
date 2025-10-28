/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './_data-table';


export enum CashFlowExplorerTypes {
  CashFlowConceptsReport = 'CashFlowConceptsReport',
  CashFlowReport         = 'CashFlowReport',
}


export const CashFlowExplorerTypesList: Identifiable<CashFlowExplorerTypes>[] = [
  { uid: CashFlowExplorerTypes.CashFlowConceptsReport, name: 'Flujo de efectivo'},
  { uid: CashFlowExplorerTypes.CashFlowReport,         name: 'Reporte ejecutivo del flujo de efectivo' },
];


export interface CashFlowExplorerQuery {
  reportType: CashFlowExplorerTypes;
  fromDate: DateString;
  toDate: DateString;
  keywords: string;
  partyUID: string;
  classificationUID: string;
  operationTypeUID: string;
  projectTypeUID: string;
  projectUID: string;
  financingSourceUID: string;
  financialAccountUID: string;
  programUID: string;
  subprogramUID: string;
}


export interface CashFlowExplorer extends DataTable {
  query: CashFlowExplorerQuery;
  columns: DataTableColumn[];
  entries: CashFlowEntryDescriptor[];
}


export interface CashFlowEntryDescriptor extends DataTableEntry {
  uid: string;
}


export const EmptyCashFlowExplorerQuery: CashFlowExplorerQuery = {
  reportType: CashFlowExplorerTypes.CashFlowConceptsReport,
  fromDate: '',
  toDate: '',
  keywords: '',
  classificationUID: '',
  operationTypeUID: '',
  partyUID: '',
  projectTypeUID: '',
  projectUID: '',
  financingSourceUID: '',
  financialAccountUID: '',
  programUID: '',
  subprogramUID: '',
};


export const EmptyCashFlowExplorer: CashFlowExplorer = {
  query: EmptyCashFlowExplorerQuery,
  columns: [],
  entries: [],
};
