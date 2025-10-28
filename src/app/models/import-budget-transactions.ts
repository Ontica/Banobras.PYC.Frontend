/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';


export interface ImportBudgetTransactionsCommand {
  dryRun: boolean;
  transactionTypeUID: string;
  budgetTypeUID: string;
  budgetUID: string;
  operationSourceUID: string;
  applicationDate: DateString;
  justification: string;
}


export interface ImportBudgetTransactionsResult {
  hasErrors: boolean;
  transactionsCount: number;
  errors: Identifiable[];
  warnings: Identifiable[];
  transactionTotals: ImportBudgetTransactionsTotals[];
}


export interface ImportBudgetTransactionsTotals {
  uid: string;
  description: string;
  transactionsCount: number;
  errorsCount: number;
  warningsCount: number;
}


export const EmptyImportBudgetTransactionsResult: ImportBudgetTransactionsResult = {
  hasErrors: false,
  transactionsCount: 0,
  errors: [],
  warnings: [],
  transactionTotals: [],
};


export const EmptyImportBudgetTransactionsCommand: ImportBudgetTransactionsCommand = {
  dryRun: true,
  transactionTypeUID: '',
  budgetTypeUID: '',
  budgetUID: '',
  operationSourceUID: '',
  applicationDate: '',
  justification: '',
};
