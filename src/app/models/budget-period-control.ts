/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface BudgetSelector {
  budgetTypeUID: string;
  budgetUID: string;
}


export interface BudgetPeriod {
  month: number;
  monthName: string;
  modified: number;
  requested: number;
  commited: number;
  toPay: number;
  exercised: number;
  toExercise: number;
  available: number;
  actions: BudgetPeriodActions;
}


export interface BudgetPeriodActions {
  canClose: boolean;
  canOpen: boolean;
  canGenerate: boolean;
}


export interface BudgetPeriodResult {
  message: string;
}


export const EmptyBudgetPeriodActions: BudgetPeriodActions = {
  canClose: false,
  canOpen: false,
  canGenerate: false,
}


export const EmptyBudgetPeriod: BudgetPeriod = {
  month: null,
  monthName: '',
  modified: null,
  requested: null,
  commited: null,
  toPay: null,
  exercised: null,
  toExercise: null,
  available: null,
  actions: EmptyBudgetPeriodActions,
}
