/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './_data-table';


export enum CashFlowExplorerTypes {
  CashFlow      = 'CashFlow',
  AccountTotals = 'AccountTotals',
  ConceptTotals = 'ConceptTotals',
  ProjectTotals = 'ProjectTotals',
}


export const CashFlowExplorerTypesList: Identifiable<CashFlowExplorerTypes>[] = [
  {uid: CashFlowExplorerTypes.CashFlow,        name: 'Flujo de efectivo'},
  {uid: CashFlowExplorerTypes.AccountTotals,   name: 'Totales por cuenta'},
  {uid: CashFlowExplorerTypes.ConceptTotals,   name: 'Totales por concepto'},
  {uid: CashFlowExplorerTypes.ProjectTotals,   name: 'Totales por proyecto'},
];


export interface CashFlowExplorerQuery {
  reportType: CashFlowExplorerTypes;
  fromDate: DateString;
  toDate: DateString;
  keywords: string;
  partyUID: string;
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
  reportType: CashFlowExplorerTypes.CashFlow,
  fromDate: '',
  toDate: '',
  keywords: '',
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
