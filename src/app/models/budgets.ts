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
}


export const BudgetExplorerReportTypesList: Identifiable<BudgetExplorerReportTypes>[] = [
  { uid: BudgetExplorerReportTypes.ByColumn,             name: 'Por columna' },
  { uid: BudgetExplorerReportTypes.MonthlyAvailability,  name: 'Disponible mensual' },
];


export interface BudgetType {
  uid: string;
  name: string;
  multiyear: boolean;
  budgets: Budget[];
  segmentTypes: BudgetSegmentType[];
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
  basePartyUID: string;
  groupBy: string[];
  filterBy: BudgetSegmentQuery[];
}


export interface BudgetSegmentQuery {
  segmentUID: string;
  segmentItemsUID: string[];
}


export interface BudgetData extends DataTable {
  query: BudgetQuery;
  columns: DataTableColumn[];
  entries: BudgetEntryDescriptor[];
}


export interface BudgetEntryDescriptor extends DataTableEntry {
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
  segmentTypes: [],
  transactionTypes: [],
}


export const EmptyBudgetQuery: BudgetQuery = {
  reportType: BudgetExplorerReportTypes.ByColumn,
  budgetTypeUID: '',
  budgetUID: '',
  basePartyUID: '',
  groupBy: [],
  filterBy: [],
};


export const EmptyBudgetData: BudgetData = {
  query: EmptyBudgetQuery,
  columns: [],
  entries: [],
};
