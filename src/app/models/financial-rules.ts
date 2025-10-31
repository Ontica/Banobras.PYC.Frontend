/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable } from './_data-table';


export interface FinancialRulesQuery {
  categoryUID: string;
  date: DateString;
  keywords: string;
}


export interface FinancialRuleDescriptor {
  uid: string;
  debitAccount: string;
  creditAccount: string;
  debitConcept: string;
  creditConcept: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  statusName: string;
}


export interface FinancialRulesData extends DataTable {
  query: FinancialRulesQuery;
  entries: FinancialRuleDescriptor[];
}


export interface FinancialRule {
  uid: string;
  category: Identifiable;
  debitAccount: string;
  creditAccount: string;
  debitConcept: string;
  creditConcept: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
  status: Identifiable;
}


export interface FinancialRuleFields {
  categoryUID: string;
  debitAccount: string;
  creditAccount: string;
  debitConcept: string;
  creditConcept: string;
  description: string;
  startDate: DateString;
  endDate: DateString;
}


export const EmptyFinancialRulesQuery: FinancialRulesQuery = {
  categoryUID: '',
  date: '',
  keywords: '',
};


export const EmptyFinancialRuleDescriptor: FinancialRuleDescriptor = {
  uid: '',
  debitAccount: '',
  creditAccount: '',
  debitConcept: '',
  creditConcept: '',
  description: '',
  startDate: '',
  endDate: '',
  statusName: '',
};


export const EmptyFinancialRule: FinancialRule = {
  uid: '',
  category: Empty,
  debitAccount: '',
  creditAccount: '',
  debitConcept: '',
  creditConcept: '',
  description: '',
  startDate: '',
  endDate: '',
  status: Empty,
};


export const EmptyFinancialRulesData: FinancialRulesData = {
  query: EmptyFinancialRulesQuery,
  columns: [],
  entries: [],
};
