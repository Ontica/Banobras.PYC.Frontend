/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTable } from './_data-table';


export interface FinancialRulesQuery {
  categoryUID: string;
  date: DateString;
  keywords: string;
}


export interface FinancialRuleDescriptor {
  uid: string;
}


export interface FinancialRulesData extends DataTable {
  query: FinancialRulesQuery;
  entries: FinancialRuleDescriptor[];
}


export interface FinancialRuleHolder {
  rule: FinancialRule;
}


export interface FinancialRule {
  uid: string;
}


export interface FinancialRuleEntryDescriptor {
  uid: string;
}


export const EmptyFinancialRulesQuery: FinancialRulesQuery = {
  categoryUID: '',
  date: '',
  keywords: '',
};


export const EmptyFinancialRuleDescriptor: FinancialRuleDescriptor = {
  uid: '',
};


export const EmptyFinancialRule: FinancialRule = {
  uid: '',
};


export const EmptyFinancialRuleHolder: FinancialRuleHolder = {
  rule: EmptyFinancialRule,
};


export const EmptyFinancialRulesData: FinancialRulesData = {
  query: EmptyFinancialRulesQuery,
  columns: [],
  entries: [],
};
