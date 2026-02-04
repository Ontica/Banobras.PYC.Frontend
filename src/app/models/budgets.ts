/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './base/data-table';


export enum BudgetExplorerReportTypes {
  ByColumn            = 'ByColumn',
  MonthlyAvailability = 'MonthlyAvailability',
  ScheduledByArea     = 'ScheduledByArea',
}


export const BudgetExplorerReportTypesList: Identifiable<BudgetExplorerReportTypes>[] = [
  { uid: BudgetExplorerReportTypes.ByColumn,             name: 'Por columna' },
  { uid: BudgetExplorerReportTypes.MonthlyAvailability,  name: 'Disponible mensual' },
  { uid: BudgetExplorerReportTypes.ScheduledByArea,      name: 'Calendarizado por área' },
];


export interface BudgetType {
  uid: string;
  name: string;
  multiyear: boolean;
  budgets: Budget[];
  groupByColumns: Identifiable[];
  transactionTypes: Identifiable[];
}


export interface Budget {
  uid: string;
  name: string;
  year: number;
  type: Identifiable;
}


export interface BudgetSegmentType {
  uid: string;
  name: string;
  parentSegmentType: BudgetSegmentType;
  childrenSegmentType: BudgetSegmentType;
}


export interface BudgetSegmentItem {
  uid: string;
  code: string;
  name: string;
  description: string;
  type: Identifiable;
  children: BudgetSegmentItem[];
}


export interface BudgetAccount {
  uid: string;
  baseSegmentUID: string;
  code: string;
  name: string;
  type: Identifiable;
  organizationalUnit: Identifiable;
  isAssigned: boolean;
  status: Identifiable;
}


export interface BudgetAccountsForProductQuery {
  transactionUID?: string;
  operationType?: string;
  baseBudgetUID?: string;
  basePartyUID?: string;
  productUID?: string;
  keywords?: string;
}


export interface BudgetQuery {
  reportType: BudgetExplorerReportTypes;
  budgetTypeUID: string;
  budgetUID: string;
  baseParties: string[];
  groupByColumn: string;
  budgetAccounts: string[];
}


export interface BudgetData extends DataTable {
  query: BudgetQuery;
  columns: DataTableColumn[];
  entries: BudgetEntryDescriptor[];
}


export interface BudgetEntryDescriptor extends DataTableEntry {
  title: string;
  description: string;
}


export interface BudgetEntryBreakdownData {
  entry: BudgetEntryDescriptor;
  breakdown: BudgetEntryBreakdown;
}


export interface BudgetEntryBreakdown extends DataTable {
  query: BudgetQuery; // TODO: definir, entry + BudgetQuery + EntryQuery
  columns: DataTableColumn[];
  entries: BudgetEntryBreakdownEntry[];
}


export interface BudgetEntryBreakdownEntry { // v1 transaction
  uid: string;
}


export interface BudgetRequestFields {
  baseObjectTypeUID: string;
  baseObjectUID: string;
}


export interface BudgetValidationResult {
  result: string;
}


export const EmptyBudgetType: BudgetType = {
  uid: '',
  name: '',
  multiyear: false,
  budgets: [],
  groupByColumns: [],
  transactionTypes: [],
};


export const EmptyBudgetQuery: BudgetQuery = {
  reportType: BudgetExplorerReportTypes.ByColumn,
  budgetTypeUID: '',
  budgetUID: '',
  baseParties: [],
  groupByColumn: '',
  budgetAccounts: [],
};


export const EmptyBudgetData: BudgetData = {
  query: EmptyBudgetQuery,
  columns: [],
  entries: [],
};


export const EmptyBudgetEntryDescriptor: BudgetEntryDescriptor = {
  title: '',
  description: '',
};


export const EmptyBudgetEntryBreakdown: BudgetEntryBreakdown = {
  query: EmptyBudgetQuery,
  columns: [],
  entries: [],
};


export const EmptyBudgetEntryBreakdownData: BudgetEntryBreakdownData = {
  entry: EmptyBudgetEntryDescriptor,
  breakdown: EmptyBudgetEntryBreakdown,
};
