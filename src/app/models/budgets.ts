/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './base/data-table';


export enum BudgetExplorerOperationTypes {
  exportBudget      = 'export-budget',
  exportBudgetEntry = 'export-budget-entry',
}


export enum BudgetExplorerReportTypes {
  Anualizado                        = 'Anualizado',
  DisponibleMensual                 = 'DisponibleMensual',
  DisponibleMensualAcumulado        = 'DisponibleMensualAcumulado',
  PresupuestoDetalladoCalendarizado = 'PresupuestoDetalladoCalendarizado',
  SaldosOperacion                   = 'SaldosOperacion'
}


export enum BudgetEntryExplorerReportTypes {
  BudgetTransactions = 'budget-transactions',
  BudgetEntries      = 'budget-entries',
  MonthlyBalance     = 'monthly-balance',
}


export const BudgetExplorerReportTypesList: BudgetExplorerReportType[] = [
  {
    uid: BudgetExplorerReportTypes.Anualizado,
    name: 'Anualizado',
    defaultEntryReportType: BudgetEntryExplorerReportTypes.MonthlyBalance,
  },
  {
    uid: BudgetExplorerReportTypes.DisponibleMensual,
    name: 'Disponible mensual [PENDIENTE]',
    defaultEntryReportType: BudgetEntryExplorerReportTypes.BudgetTransactions,
  },
  {
    uid: BudgetExplorerReportTypes.DisponibleMensualAcumulado,
    name: 'Disponible mensual acumulado [PENDIENTE]',
    defaultEntryReportType: BudgetEntryExplorerReportTypes.BudgetTransactions,
  },
  {
    uid: BudgetExplorerReportTypes.PresupuestoDetalladoCalendarizado,
    name: 'Presupuesto detallado calendarizado [PENDIENTE]',
    defaultEntryReportType: BudgetEntryExplorerReportTypes.BudgetTransactions,
  },
  {
    uid: BudgetExplorerReportTypes.SaldosOperacion,
    name: 'Saldos operación',
    defaultEntryReportType: BudgetEntryExplorerReportTypes.BudgetEntries,
  },
];


export const BudgetEntryExplorerReportTypesList: Identifiable<BudgetEntryExplorerReportTypes>[] = [
  { uid: BudgetEntryExplorerReportTypes.BudgetTransactions, name: 'Detalle de transacciones' },
  { uid: BudgetEntryExplorerReportTypes.BudgetEntries,      name: 'Detalle de movimientos' },
  { uid: BudgetEntryExplorerReportTypes.MonthlyBalance,     name: 'Saldos por mes' },
];


export interface BudgetExplorerReportType {
  uid: BudgetExplorerReportTypes;
  name: string;
  defaultEntryReportType: BudgetEntryExplorerReportTypes;
}


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


export interface BudgetEntryQuery {
  reportType: BudgetEntryExplorerReportTypes;
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
  query: BudgetQuery;
  subQuery: BudgetEntryQuery;
  entry: BudgetEntryDescriptor;
  breakdown: BudgetEntryBreakdown;
}


export interface BudgetEntryBreakdown extends DataTable {
  columns: DataTableColumn[];
  entries: BudgetEntryBreakdownEntry[];
}


export interface BudgetEntryBreakdownEntry {
  uid: string;
}


export interface BudgetRequestFields {
  baseObjectTypeUID: string;
  baseObjectUID: string;
}


export interface BudgetValidationResult {
  result: string;
}


export const EmptyBudgetExplorerReportType: BudgetExplorerReportType = {
  uid: null,
  name: '',
  defaultEntryReportType: BudgetEntryExplorerReportTypes.BudgetTransactions,
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
  reportType: BudgetExplorerReportTypes.Anualizado,
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


export const EmptyBudgetEntryQuery: BudgetEntryQuery = {
  reportType: BudgetEntryExplorerReportTypes.BudgetTransactions,
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
  query: EmptyBudgetQuery,
  subQuery: EmptyBudgetEntryQuery,
  entry: EmptyBudgetEntryDescriptor,
  breakdown: EmptyBudgetEntryBreakdown,
};
