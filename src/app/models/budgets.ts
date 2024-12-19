/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './_data-table';


export interface BudgetType {
  uid: string;
  name: string;
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


export interface BudgetAccountsForProductQuery {
  productUID: string;
  budgetTypeUID: string;
  orgUnitUID: string;
}


export enum BudgetQueryType {
  planning = 'planning',
};


export interface BudgetQuery {
  queryType: BudgetQueryType;
  budgetTypeUID: string;
  budgetUID: string;
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
  entries: BudgetEntry[];
}


export interface BudgetEntry extends DataTableEntry {
  uid: string;
}


export enum BudgetContext {
  Contract               = 'ObjectTypeInfo.Contract.Procurement',
  Milestone              = 'ObjectTypeInfo.Milestone',
  MinorPurchase          = 'ObjectTypeInfo.MinorPurchase',
  ExpenseOrReimbursement = 'ObjectTypeInfo.ExpenseOrReimbursement',
}


export interface BudgetRequestFields {
  baseObjectTypeUID: string;
  baseObjectUID: string;
}


export interface BudgetValidationResult {
  result: string;
}


export const EmptyBudgetQuery: BudgetQuery = {
  queryType: null,
  budgetTypeUID: '',
  budgetUID: '',
  groupBy: [],
  filterBy: [],
};


export const EmptyBudgetData: BudgetData = {
  query: EmptyBudgetQuery,
  columns: [],
  entries: [],
};
